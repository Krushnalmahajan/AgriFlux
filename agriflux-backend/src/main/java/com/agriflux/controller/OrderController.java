package com.agriflux.controller;

import com.agriflux.dto.request.OrderRequest;
import com.agriflux.dto.response.OrderResponse;
import com.agriflux.enums.OrderStatus;
import com.agriflux.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    // ── USER ROUTES ───────────────────────────────

    // POST /api/orders/place
    @PostMapping("/orders/place")
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(orderService.placeOrder(request));
    }

    // GET /api/orders/my-orders
    @GetMapping("/orders/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    // GET /api/orders/{orderId}
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(
                orderService.getOrderById(orderId));
    }

    // PUT /api/orders/{orderId}/cancel
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(
                orderService.cancelOrder(orderId));
    }

    // ── ADMIN ROUTES ──────────────────────────────

    // GET /api/admin/orders
    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // PUT /api/admin/orders/{orderId}/status
    @PutMapping("/admin/orders/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(
                orderService.updateOrderStatus(orderId, status));
    }
}