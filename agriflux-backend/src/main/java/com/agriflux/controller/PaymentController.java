package com.agriflux.controller;

import com.agriflux.dto.request.PaymentOrderRequest;
import com.agriflux.dto.request.PaymentVerifyRequest;
import com.agriflux.dto.response.PaymentOrderResponse;
import com.agriflux.service.PaymentService;
import com.razorpay.RazorpayException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    // POST /api/payment/create-order
    // Creates Razorpay order for payment
    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createOrder(
            @Valid @RequestBody PaymentOrderRequest request)
            throws RazorpayException {
        return ResponseEntity.ok(
                paymentService.createPaymentOrder(request));
    }

    // POST /api/payment/verify
    // Verifies payment after user pays
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(
                paymentService.verifyPayment(request));
    }
}