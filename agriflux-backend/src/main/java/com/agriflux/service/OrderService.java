package com.agriflux.service;

import com.agriflux.dto.request.OrderRequest;
import com.agriflux.dto.response.OrderItemResponse;
import com.agriflux.dto.response.OrderResponse;
import com.agriflux.enums.OrderStatus;
import com.agriflux.enums.PaymentStatus;
import com.agriflux.exception.ResourceNotFoundException;
import com.agriflux.model.*;
import com.agriflux.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ── GET LOGGED IN USER ────────────────────────
    private User getLoggedInUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));
    }

    // ── PLACE ORDER ───────────────────────────────
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {

        User user = getLoggedInUser();

        // Step 1: Get user's cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Cart not found"));

        // Step 2: Check cart is not empty
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException(
                    "Cannot place order with empty cart");
        }

        // Step 3: Verify address belongs to this user
        Address address = addressRepository
                .findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Unauthorized: Address does not belong to you");
        }

        // Step 4: Check stock and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();

            // Check if product is still available
            if (!product.getIsAvailable()) {
                throw new RuntimeException(
                        "Product no longer available: "
                                + product.getName());
            }

            // Check stock
            if (product.getStockQuantity()
                    < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for: "
                                + product.getName()
                                + ". Available: "
                                + product.getStockQuantity());
            }

            // Add to total
            totalAmount = totalAmount.add(
                    product.getPrice().multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity())));
        }

        // Step 5: Create Order
        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PLACED)
                .notes(request.getNotes())
                .orderItems(new ArrayList<>())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Step 6: Create OrderItems from CartItems
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();

            // Create order item
            // ⭐ Lock price at current moment
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice()) // ← Locked price
                    .build();

            orderItems.add(orderItem);

            // Step 7: Reduce stock
            product.setStockQuantity(
                    product.getStockQuantity()
                            - cartItem.getQuantity());

            // Auto mark unavailable if stock = 0
            if (product.getStockQuantity() == 0) {
                product.setIsAvailable(false);
            }

            productRepository.save(product);
        }

        savedOrder.setOrderItems(orderItems);
        orderRepository.save(savedOrder);

        // Step 8: Clear cart after successful order
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return mapToOrderResponse(savedOrder);
    }

    // ── GET MY ORDERS ─────────────────────────────
    public List<OrderResponse> getMyOrders() {
        User user = getLoggedInUser();
        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    // ── GET SINGLE ORDER ──────────────────────────
    public OrderResponse getOrderById(Long orderId) {
        User user = getLoggedInUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderId));

        // Security: verify order belongs to this user
        // Unless user is admin
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Unauthorized: This order does not belong to you");
        }

        return mapToOrderResponse(order);
    }

    // ── CANCEL ORDER ──────────────────────────────
    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        User user = getLoggedInUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderId));

        // Verify ownership
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Unauthorized: This order does not belong to you");
        }

        // Check if order can be cancelled
        // Only PLACED or CONFIRMED can be cancelled
        if (order.getOrderStatus() == OrderStatus.SHIPPED ||
                order.getOrderStatus() == OrderStatus.DELIVERED ||
                order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Order cannot be cancelled. Status: "
                            + order.getOrderStatus());
        }

        // Restore stock for each item
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(
                    product.getStockQuantity() + item.getQuantity());
            product.setIsAvailable(true);
            productRepository.save(product);
        }

        // Update status
        order.setOrderStatus(OrderStatus.CANCELLED);
        Order cancelled = orderRepository.save(order);

        return mapToOrderResponse(cancelled);
    }

    // ── ADMIN: GET ALL ORDERS ─────────────────────
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    // ── ADMIN: UPDATE ORDER STATUS ────────────────
    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId, OrderStatus newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderId));

        // Validate status transition
        validateStatusTransition(
                order.getOrderStatus(), newStatus);

        order.setOrderStatus(newStatus);

        // If delivered → mark payment as paid (for COD)
        if (newStatus == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        Order updated = orderRepository.save(order);
        return mapToOrderResponse(updated);
    }

    // ── VALIDATE STATUS TRANSITION ────────────────
    // Prevents invalid status changes
    // Example: Cannot go from DELIVERED back to PLACED
    private void validateStatusTransition(
            OrderStatus current, OrderStatus next) {

        boolean isValid = switch (current) {
            case PLACED     -> next == OrderStatus.CONFIRMED
                    || next == OrderStatus.CANCELLED;
            case CONFIRMED  -> next == OrderStatus.PROCESSING
                    || next == OrderStatus.CANCELLED;
            case PROCESSING -> next == OrderStatus.SHIPPED;
            case SHIPPED    -> next == OrderStatus.DELIVERED;
            case DELIVERED  -> false; // Cannot change delivered
            case CANCELLED  -> false; // Cannot change cancelled
        };

        if (!isValid) {
            throw new RuntimeException(
                    "Invalid status transition from "
                            + current + " to " + next);
        }
    }

    // ── MAP ORDER TO RESPONSE ─────────────────────
    private OrderResponse mapToOrderResponse(Order order) {

        // Format address as readable string
        Address addr = order.getAddress();
        String formattedAddress = addr.getFullName()
                + ", " + addr.getAddressLine1()
                + (addr.getAddressLine2() != null ?
                ", " + addr.getAddressLine2() : "")
                + ", " + addr.getCity()
                + ", " + addr.getState()
                + " - " + addr.getPincode();

        // Map order items
        List<OrderItemResponse> itemResponses =
                order.getOrderItems()
                        .stream()
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .deliveryAddress(formattedAddress)
                .items(itemResponses)
                .razorpayOrderId(order.getRazorpayOrderId())
                .build();
    }

    // ── MAP ORDER ITEM TO RESPONSE ────────────────
    private OrderItemResponse mapToOrderItemResponse(
            OrderItem item) {

        BigDecimal itemTotal = item.getPriceAtPurchase()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemResponse.builder()
                .orderItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImageUrl())
                .unit(item.getProduct().getUnit())
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .itemTotal(itemTotal)
                .build();
    }
}