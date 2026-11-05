package com.bookstore.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    @NotNull
    private Long userId;

    private Long addressId;

    // Optional inline address creation during checkout
    private String recipientName;
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    @NotEmpty
    private List<OrderItemRequest> items;

    @NotNull
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, GIFT_POINTS

    private Integer giftPointsToRedeem = 0;
}
