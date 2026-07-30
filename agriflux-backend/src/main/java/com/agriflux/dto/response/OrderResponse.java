package com.agriflux.dto.response;

import com.agriflux.enums.OrderStatus;
import com.agriflux.enums.PaymentMethod;
import com.agriflux.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String notes;
    private LocalDateTime createdAt;

    // Address details
    private String deliveryAddress;    // Formatted address string

    // Order items
    private List<OrderItemResponse> items;

    // Razorpay (for online payment later)
    private String razorpayOrderId;
}