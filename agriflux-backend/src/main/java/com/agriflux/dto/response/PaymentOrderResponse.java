package com.agriflux.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {

    private String razorpayOrderId;  // Send to React frontend
    private String currency;
    private Long amount;             // Amount in paise (rupees × 100)
    private String keyId;            // Send to React for checkout
    private String customerName;
    private String customerEmail;
}