package com.agriflux.repository;

import com.agriflux.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    // Check if category name already exists
    Boolean existsByName(String name);

    // Find active categories only
    List<Category> findByIsActiveTrue();

    // Find by name (case insensitive)
    Optional<Category> findByNameIgnoreCase(String name);
}