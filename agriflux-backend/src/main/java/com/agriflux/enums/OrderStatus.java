package com.agriflux.enums;

public enum OrderStatus {
    PLACED,      // Order just placed
    CONFIRMED,   // Admin confirmed
    PROCESSING,  // Being prepared
    SHIPPED,     // Out for delivery
    DELIVERED,   // Reached customer
    CANCELLED    // Cancelled by user/admin
}
