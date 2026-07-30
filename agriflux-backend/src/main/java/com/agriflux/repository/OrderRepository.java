package com.agriflux.repository;

import com.agriflux.enums.OrderStatus;
import com.agriflux.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {

    // Get all orders for a specific user
    // Sorted by newest first
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Get orders by status (for admin)
    List<Order> findByOrderStatus(OrderStatus status);

    // Get all orders sorted by newest first (for admin)
    List<Order> findAllByOrderByCreatedAtDesc();

    // Count orders by status (for dashboard)
    Long countByOrderStatus(OrderStatus status);
}