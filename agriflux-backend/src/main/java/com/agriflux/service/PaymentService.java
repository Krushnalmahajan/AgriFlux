package com.agriflux.service;

import com.agriflux.dto.request.PaymentOrderRequest;
import com.agriflux.dto.request.PaymentVerifyRequest;
import com.agriflux.dto.response.PaymentOrderResponse;
import com.agriflux.enums.PaymentStatus;
import com.agriflux.exception.ResourceNotFoundException;
import com.agriflux.model.Order;
import com.agriflux.model.User;
import com.agriflux.repository.OrderRepository;
import com.agriflux.repository.UserRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

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

    // ── CREATE RAZORPAY ORDER ─────────────────────
    // Called when user clicks "Pay Online"
    // Creates an order on Razorpay's server
    public PaymentOrderResponse createPaymentOrder(
            PaymentOrderRequest request)
            throws RazorpayException {

        User user = getLoggedInUser();

        // Find our AgriFlux order
        Order order = orderRepository
                .findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + request.getOrderId()));

        // Verify order belongs to this user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Unauthorized: Order does not belong to you");
        }

        // Check order is not already paid
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException(
                    "Order is already paid");
        }

        // Convert amount to paise (Razorpay uses smallest unit)
        // 1 Rupee = 100 Paise
        // So ₹250 = 25000 paise
        Long amountInPaise = order.getTotalAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        // Create Razorpay order
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_" + order.getId());

        // Add notes (optional but useful)
        JSONObject notes = new JSONObject();
        notes.put("agriflux_order_id",
                order.getId().toString());
        notes.put("customer_email", user.getEmail());
        orderRequest.put("notes", notes);

        // Call Razorpay API to create order
        com.razorpay.Order razorpayOrder =
                razorpayClient.orders.create(orderRequest);

        // Save Razorpay order ID in our DB
        order.setRazorpayOrderId(
                razorpayOrder.get("id"));
        orderRepository.save(order);

        // Return details needed by React for checkout
        return PaymentOrderResponse.builder()
                .razorpayOrderId(razorpayOrder.get("id"))
                .currency("INR")
                .amount(amountInPaise)
                .keyId(keyId)           // React needs this
                .customerName(user.getName())
                .customerEmail(user.getEmail())
                .build();
    }

    // ── VERIFY PAYMENT ────────────────────────────
    // Called after user completes payment on Razorpay popup
    // Verifies payment is genuine using cryptographic signature
    public String verifyPayment(
            PaymentVerifyRequest request) {

        // Find our order
        Order order = orderRepository
                .findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found"));

        try {
            // ── SIGNATURE VERIFICATION ────────────
            // Razorpay creates signature like this:
            // HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
            // We recreate it and compare
            // If they match → payment is genuine

            String payload = request.getRazorpayOrderId()
                    + "|"
                    + request.getRazorpayPaymentId();

            String generatedSignature =
                    generateHmacSHA256(payload, keySecret);

            if (generatedSignature.equals(
                    request.getRazorpaySignature())) {

                // ✅ Signature matches → Payment verified!
                order.setRazorpayPaymentId(
                        request.getRazorpayPaymentId());
                order.setPaymentStatus(PaymentStatus.PAID);
                orderRepository.save(order);

                return "Payment verified successfully!";

            } else {
                // ❌ Signature mismatch → Possible fraud!
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);

                throw new RuntimeException(
                        "Payment verification failed! " +
                                "Invalid signature.");
            }

        } catch (Exception e) {
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepository.save(order);
            throw new RuntimeException(
                    "Payment verification error: "
                            + e.getMessage());
        }
    }

    // ── GENERATE HMAC SHA256 SIGNATURE ───────────
    // This is the cryptographic verification algorithm
    // Same algorithm Razorpay uses to create signature
    private String generateHmacSHA256(
            String data, String secret) throws Exception {

        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256");
        mac.init(secretKey);

        byte[] hash = mac.doFinal(
                data.getBytes(StandardCharsets.UTF_8));

        // Convert bytes to hex string
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}