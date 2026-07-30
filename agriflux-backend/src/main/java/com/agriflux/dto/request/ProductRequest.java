package com.agriflux.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0",
            inclusive = false,
            message = "Price must be greater than 0")
    private BigDecimal price;

    private BigDecimal originalPrice;  // For showing discount

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockQuantity;

    private String imageUrl;

    private String unit;               // kg, litre, piece etc.

    private Boolean isFeatured = false;

    @NotNull(message = "Category is required")
    private Long categoryId;           // Which category this belongs to
}