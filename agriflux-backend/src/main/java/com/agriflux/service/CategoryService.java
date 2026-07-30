package com.agriflux.service;

import com.agriflux.dto.request.CategoryRequest;
import com.agriflux.dto.response.CategoryResponse;
import com.agriflux.exception.ResourceAlreadyExistsException;
import com.agriflux.exception.ResourceNotFoundException;
import com.agriflux.model.Category;
import com.agriflux.repository.CategoryRepository;
import com.agriflux.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    // ── CREATE CATEGORY ───────────────────────────
    public CategoryResponse createCategory(CategoryRequest request) {

        // Check duplicate
        if (categoryRepository.existsByName(request.getName())) {
            throw new ResourceAlreadyExistsException(
                    "Category already exists: " + request.getName());
        }

        // Build and save
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    // ── GET ALL CATEGORIES ────────────────────────
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)   // Convert each to Response
                .collect(Collectors.toList());
    }

    // ── GET SINGLE CATEGORY ───────────────────────
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id));
        return mapToResponse(category);
    }

    // ── UPDATE CATEGORY ───────────────────────────
    public CategoryResponse updateCategory(Long id,
                                           CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id));

        // Update only fields that are provided
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getImageUrl() != null) {
            category.setImageUrl(request.getImageUrl());
        }

        Category updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    // ── DELETE CATEGORY ───────────────────────────
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id));

        // Soft delete — just mark as inactive
        // Don't actually delete from DB
        // Why? → Order history needs category info
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    // ── CONVERT ENTITY TO RESPONSE DTO ───────────
    // Private helper method — used internally
    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                // Count products in this category
                .productCount(
                        productRepository
                                .countByCategoryId(category.getId())
                                .intValue())
                .build();
    }
}