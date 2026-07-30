package com.agriflux.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// This is what we SEND BACK to frontend after login/register
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;       // JWT token
    private String name;        // User's name
    private String email;       // User's email
    private String role;        // USER or ADMIN
    private String message;     // Success message
}