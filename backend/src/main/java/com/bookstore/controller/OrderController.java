package com.bookstore.controller;

import com.bookstore.dto.CreateOrderRequest;
import com.bookstore.entity.Order;
import com.bookstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders & Checkout", description = "Order processing, checkout, purchase confirmation, and 48-hour order cancellation")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place order", description = "Creates a new purchase order with address, items, and gift points redemption")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves order details and purchase confirmation data")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user order history", description = "Retrieves all past orders for a user with status and cancellation eligibility")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel order", description = "Cancels an order if placed within the 48-hour window")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long id,
            @RequestParam Long userId) {
        return ResponseEntity.ok(orderService.cancelOrder(id, userId));
    }
}
