package com.agriflux.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")     // ← TEXT for long descriptions
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;              // ← BigDecimal for money (not Double!)

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;      // ← For showing discount

    @Min(value = 0, message = "Stock cannot be negative")
    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_available")
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;    // ← Show on homepage

    private String unit;                   // ← kg, litre, piece etc.

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Relationships ─────────────────────────────
    // Many Products belong to ONE Category
    @ManyToOne(fetch = FetchType.LAZY)     // ← LAZY = load category only when needed
    @JoinColumn(name = "category_id")      // ← Foreign key column name
    private Category category;

    // One Product can be in many CartItems
    @OneToMany(mappedBy = "product")
    private List<CartItem> cartItems;

    // One Product can be in many OrderItems
    @OneToMany(mappedBy = "product")
    private List<OrderItem> orderItems;
}