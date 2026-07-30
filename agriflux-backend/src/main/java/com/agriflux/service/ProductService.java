package com.agriflux.service;

import com.agriflux.dto.request.ProductRequest;
import com.agriflux.dto.response.ProductResponse;
import com.agriflux.exception.ResourceNotFoundException;
import com.agriflux.model.Category;
import com.agriflux.model.Product;
import com.agriflux.repository.CategoryRepository;
import com.agriflux.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ── CREATE PRODUCT ────────────────────────────
    public ProductResponse createProduct(ProductRequest request) {

        // Find the category first
        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found: " + request.getCategoryId()));

        // Build product entity
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .unit(request.getUnit())
                .isFeatured(request.getIsFeatured())
                .isAvailable(true)
                .category(category)
                .build();

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    // ── GET ALL PRODUCTS ──────────────────────────
    public List<ProductResponse> getAllProducts() {
        return productRepository.findByIsAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── GET SINGLE PRODUCT ────────────────────────
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));
        return mapToResponse(product);
    }

    // ── GET PRODUCTS BY CATEGORY ──────────────────
    public List<ProductResponse> getProductsByCategory(Long categoryId) {

        // Verify category exists first
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found: " + categoryId));

        return productRepository
                .findByCategoryIdAndIsAvailableTrue(categoryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── SEARCH PRODUCTS ───────────────────────────
    public List<ProductResponse> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllProducts();    // Empty search = return all
        }
        return productRepository.searchProducts(keyword.trim())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── GET FEATURED PRODUCTS ─────────────────────
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── UPDATE PRODUCT ────────────────────────────
    public ProductResponse updateProduct(Long id,
                                         ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));

        // Update category if changed
        if (request.getCategoryId() != null) {
            Category category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found"));
            product.setCategory(category);
        }

        // Update fields
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnit(request.getUnit());
        product.setIsFeatured(request.getIsFeatured());

        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    // ── DELETE PRODUCT ────────────────────────────
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));

        // Soft delete
        product.setIsAvailable(false);
        productRepository.save(product);
    }

    // ── UPDATE STOCK ──────────────────────────────
    // Called when order is placed
    public void reduceStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException(
                    "Insufficient stock for: " + product.getName());
        }

        product.setStockQuantity(
                product.getStockQuantity() - quantity);

        // Auto mark unavailable if stock hits 0
        if (product.getStockQuantity() == 0) {
            product.setIsAvailable(false);
        }

        productRepository.save(product);
    }

    // ── CONVERT ENTITY TO RESPONSE DTO ───────────
    private ProductResponse mapToResponse(Product product) {

        // Calculate discount percentage if original price exists
        Double discountPercentage = null;
        if (product.getOriginalPrice() != null &&
                product.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0) {

            discountPercentage = product.getOriginalPrice()
                    .subtract(product.getPrice())  // originalPrice - price
                    .divide(product.getOriginalPrice(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .unit(product.getUnit())
                .isAvailable(product.getIsAvailable())
                .isFeatured(product.getIsFeatured())
                .createdAt(product.getCreatedAt())
                .categoryId(product.getCategory() != null ?
                        product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ?
                        product.getCategory().getName() : null)
                .discountPercentage(discountPercentage)
                .build();
    }
}