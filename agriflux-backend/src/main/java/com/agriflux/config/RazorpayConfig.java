package com.agriflux.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    // Creates ONE RazorpayClient shared across app
    // Like a connection to Razorpay's servers
    @Bean
    public RazorpayClient razorpayClient()
            throws RazorpayException {
        return new RazorpayClient(keyId, keySecret);
    }
}