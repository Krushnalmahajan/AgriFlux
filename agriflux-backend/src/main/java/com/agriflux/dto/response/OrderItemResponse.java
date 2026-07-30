package com.agriflux.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {

    private Long orderItemId;
    private Long productId;
    private String productName;
    private String productImage;
    private String unit;
    private Integer quantity;
    private BigDecimal priceAtPurchase;  // Price when ordered
    private BigDecimal itemTotal;        // price × quantity
}