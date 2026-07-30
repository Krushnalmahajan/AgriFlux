package com.agriflux.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    // ⭐ VERY IMPORTANT: Store price at time of order
    // Product price may change later, but order price must stay fixed
    @Column(name = "price_at_purchase",
            nullable = false,
            precision = 10,
            scale = 2)
    private BigDecimal priceAtPurchase;

    // Many OrderItems belong to ONE Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    // Many OrderItems reference ONE Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}