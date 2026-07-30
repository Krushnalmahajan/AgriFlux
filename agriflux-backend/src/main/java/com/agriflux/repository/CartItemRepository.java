package com.agriflux.repository;

import com.agriflux.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    // Find specific product in specific cart
    // Used to check if product already in cart
    Optional<CartItem> findByCartIdAndProductId(
            Long cartId, Long productId);
}