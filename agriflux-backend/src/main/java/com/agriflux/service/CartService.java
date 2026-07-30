package com.agriflux.service;

import com.agriflux.dto.request.CartItemRequest;
import com.agriflux.dto.response.CartItemResponse;
import com.agriflux.dto.response.CartResponse;
import com.agriflux.exception.ResourceNotFoundException;
import com.agriflux.model.Cart;
import com.agriflux.model.CartItem;
import com.agriflux.model.Product;
import com.agriflux.model.User;
import com.agriflux.repository.CartItemRepository;
import com.agriflux.repository.CartRepository;
import com.agriflux.repository.ProductRepository;
import com.agriflux.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ── GET LOGGED IN USER ────────────────────────
    // This is how we know WHOSE cart to access
    // Spring Security stores user info after JWT validation
    private User getLoggedInUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();  // getName() returns email (we set email as subject in JWT)

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    // ── GET OR CREATE CART ────────────────────────
    // Every user has exactly one cart
    // If cart doesn't exist → create it automatically
    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    // Cart doesn't exist → create new one
                    Cart newCart = Cart.builder()
                            .user(user)
                            .cartItems(new ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    // ── GET CART ──────────────────────────────────
    public CartResponse getCart() {
        User user = getLoggedInUser();
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    // ── ADD TO CART ───────────────────────────────
    @Transactional  // ← If anything fails, rollback everything
    public CartResponse addToCart(CartItemRequest request) {

        User user = getLoggedInUser();
        Cart cart = getOrCreateCart(user);

        // Find the product
        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found: " + request.getProductId()));

        // Check if product is available
        if (!product.getIsAvailable()) {
            throw new RuntimeException(
                    "Product is not available: " + product.getName());
        }

        // Check if product is in stock
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException(
                    "Insufficient stock. Available: "
                            + product.getStockQuantity());
        }

        // Check if product ALREADY exists in cart
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductId(
                        cart.getId(),
                        product.getId());

        if (existingItem.isPresent()) {
            // Product already in cart → just increase quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();

            // Check stock for new total quantity
            if (product.getStockQuantity() < newQuantity) {
                throw new RuntimeException(
                        "Insufficient stock. Available: "
                                + product.getStockQuantity());
            }

            item.setQuantity(newQuantity);
            cartItemRepository.save(item);

        } else {
            // Product not in cart → create new CartItem
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        // Return updated cart
        Cart updatedCart = cartRepository
                .findById(cart.getId()).get();
        return mapToCartResponse(updatedCart);
    }

    // ── UPDATE QUANTITY ───────────────────────────
    @Transactional
    public CartResponse updateQuantity(Long cartItemId,
                                       Integer quantity) {

        User user = getLoggedInUser();
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found: " + cartItemId));

        // Security check
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException(
                    "Unauthorized: This item does not belong to your cart");
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0
            cart.getCartItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
            cartItemRepository.flush();
            cartRepository.save(cart);
        } else {
            // Check stock
            if (cartItem.getProduct().getStockQuantity() < quantity) {
                throw new RuntimeException(
                        "Insufficient stock. Available: "
                                + cartItem.getProduct().getStockQuantity());
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
            cartItemRepository.flush();  // ← Force sync
        }

        // ← Fetch fresh from DB
        Cart updatedCart = cartRepository
                .findById(cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart not found"));

        return mapToCartResponse(updatedCart);
    }

    // ── REMOVE ITEM FROM CART ─────────────────────
    // ── REMOVE ITEM FROM CART ─────────────────────
    @Transactional
    public CartResponse removeFromCart(Long cartItemId) {

        User user = getLoggedInUser();
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart item not found: " + cartItemId));

        // Security check
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException(
                    "Unauthorized: This item does not belong to your cart");
        }

        // Delete the item
        cartItemRepository.deleteById(cartItemId);
        cartItemRepository.flush();

        // Fetch fresh cart from DB
        Cart updatedCart = cartRepository
                .findById(cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart not found"));

        return mapToCartResponse(updatedCart);
    }

    // ── CLEAR ENTIRE CART ─────────────────────────
    // Called after order is placed
    @Transactional
    public void clearCart() {
        User user = getLoggedInUser();
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    // ── CONVERT CART TO RESPONSE DTO ─────────────
    private CartResponse mapToCartResponse(Cart cart) {

        // Convert each CartItem to CartItemResponse
        List<CartItemResponse> itemResponses = cart.getCartItems()
                .stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        // Calculate grand total
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // reduce() starts with 0 and keeps adding each itemTotal

        // Total number of items (sum of all quantities)
        Integer totalItems = cart.getCartItems()
                .stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(itemResponses)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    // ── CONVERT CARTITEM TO RESPONSE DTO ─────────
    private CartItemResponse mapToCartItemResponse(CartItem item) {

        // Calculate item total = price × quantity
        BigDecimal itemTotal = item.getProduct()
                .getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImageUrl())
                .unit(item.getProduct().getUnit())
                .productPrice(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .itemTotal(itemTotal)
                .build();
    }
}