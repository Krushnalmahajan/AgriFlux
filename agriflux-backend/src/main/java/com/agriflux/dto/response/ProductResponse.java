package com.agriflux.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// This is what we send to frontend
// Clean and controlled — no internal fields exposed
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String imageUrl;
    private String unit;
    private Boolean isAvailable;
    private Boolean isFeatured;
    private LocalDateTime createdAt;

    // Category info embedded in product response
    private Long categoryId;
    private String categoryName;

    // Calculated field — not stored in DB
    // We calculate it here
    private Double discountPercentage;
}