package com.bookstore.service;

import com.bookstore.dto.CreateOrderRequest;
import com.bookstore.dto.OrderItemRequest;
import com.bookstore.entity.*;
import com.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final BookRepository bookRepository;

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Address address = null;
        if (request.getAddressId() != null) {
            address = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found with id: " + request.getAddressId()));
        } else if (request.getStreetAddress() != null) {
            Address newAddress = Address.builder()
                    .user(user)
                    .recipientName(request.getRecipientName() != null ? request.getRecipientName() : user.getFullName())
                    .streetAddress(request.getStreetAddress())
                    .city(request.getCity())
                    .state(request.getState())
                    .postalCode(request.getPostalCode())
                    .country(request.getCountry() != null ? request.getCountry() : "United States")
                    .isDefault(false)
                    .build();
            address = addressRepository.save(newAddress);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        int maxDeliveryDays = 2;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .address(address)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("COMPLETED")
                .orderStatus("PROCESSING")
                .createdAt(LocalDateTime.now())
                .build();

        for (OrderItemRequest itemReq : request.getItems()) {
            Book book = bookRepository.findById(itemReq.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + itemReq.getBookId()));

            if (book.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
            }

            // Deduct inventory
            book.setStockQuantity(book.getStockQuantity() - itemReq.getQuantity());
            bookRepository.save(book);

            BigDecimal unitPrice = book.getDiscountPrice() != null ? book.getDiscountPrice() : book.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            if (book.getTentativeDeliveryDays() != null && book.getTentativeDeliveryDays() > maxDeliveryDays) {
                maxDeliveryDays = book.getTentativeDeliveryDays();
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .subtotal(subtotal)
                    .build();

            orderItems.add(orderItem);
        }

        // Handle Gift Points redemption (10 points = $1.00)
        int pointsToRedeem = 0;
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getGiftPointsToRedeem() != null && request.getGiftPointsToRedeem() > 0) {
            pointsToRedeem = Math.min(request.getGiftPointsToRedeem(), user.getGiftPoints());
            discount = BigDecimal.valueOf(pointsToRedeem).divide(BigDecimal.valueOf(10), 2, RoundingMode.HALF_UP);
            if (discount.compareTo(totalAmount) > 0) {
                discount = totalAmount;
                pointsToRedeem = discount.multiply(BigDecimal.valueOf(10)).intValue();
            }
            user.setGiftPoints(user.getGiftPoints() - pointsToRedeem);
        }

        // Earn loyalty points: 1 point per $10 spent on final amount
        BigDecimal finalAmount = totalAmount.subtract(discount);
        int earnedPoints = finalAmount.divide(BigDecimal.valueOf(10), 0, RoundingMode.FLOOR).intValue();
        user.setGiftPoints(user.getGiftPoints() + earnedPoints);
        userRepository.save(user);

        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discount);
        order.setGiftPointsRedeemed(pointsToRedeem);
        order.setFinalAmount(finalAmount);
        order.setDeliveryEstimateDate(LocalDateTime.now().plusDays(maxDeliveryDays));
        order.setItems(orderItems);

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = getOrderById(orderId);

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Cannot cancel another user's order");
        }

        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        if ("DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Cannot cancel an already delivered order");
        }

        long hoursSinceCreation = Duration.between(order.getCreatedAt(), LocalDateTime.now()).toHours();
        if (hoursSinceCreation > 48) {
            throw new RuntimeException("Cancellation window expired. Orders can only be cancelled within 48 hours of purchase.");
        }

        order.setOrderStatus("CANCELLED");

        // Refund redeemed points and revert inventory
        User user = order.getUser();
        if (order.getGiftPointsRedeemed() != null && order.getGiftPointsRedeemed() > 0) {
            user.setGiftPoints(user.getGiftPoints() + order.getGiftPointsRedeemed());
            userRepository.save(user);
        }

        for (OrderItem item : order.getItems()) {
            Book book = item.getBook();
            book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
            bookRepository.save(book);
        }

        return orderRepository.save(order);
    }
}
