package com.agriflux.dto.request;

import com.agriflux.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull(message = "Address is required")
    private Long addressId;         // Delivery address

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;  // COD or ONLINE

    private String notes;           // Optional delivery notes
}