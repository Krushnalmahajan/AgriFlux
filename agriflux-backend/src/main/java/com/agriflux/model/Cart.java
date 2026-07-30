package com.agriflux.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ONE cart belongs to ONE user
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // One cart has MANY cart items
    @OneToMany(mappedBy = "cart",
            cascade = CascadeType.ALL,      // ← Delete cart = delete items too
            orphanRemoval = true)            // ← Remove item from list = delete from DB
    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();
}