package com.agriflux.repository;

import com.agriflux.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    // Get all available products
    List<Product> findByIsAvailableTrue();

    // Get products by category
    List<Product> findByCategoryIdAndIsAvailableTrue(Long categoryId);

    // Get featured products (for homepage)
    List<Product> findByIsFeaturedTrueAndIsAvailableTrue();

    // Search products by name OR description
    // @Query lets us write custom JPQL queries
    @Query("SELECT p FROM Product p WHERE " +
            "p.isAvailable = true AND (" +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    // Get products with low stock (for admin dashboard)
    @Query("SELECT p FROM Product p WHERE " +
            "p.stockQuantity <= :threshold AND p.isAvailable = true")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);

    // Count products by category
    Long countByCategoryId(Long categoryId);
}