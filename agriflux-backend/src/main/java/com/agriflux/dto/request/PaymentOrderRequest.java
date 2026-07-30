package com.agriflux.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentOrderRequest {

    // The AgriFlux order ID to pay for
    @NotNull(message = "Order ID is required")
    private Long orderId;
}