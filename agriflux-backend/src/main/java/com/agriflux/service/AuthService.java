package com.agriflux.service;

import com.agriflux.dto.request.LoginRequest;
import com.agriflux.dto.request.RegisterRequest;
import com.agriflux.dto.response.AuthResponse;
import com.agriflux.enums.AuthProvider;
import com.agriflux.enums.Role;
import com.agriflux.exception.ResourceAlreadyExistsException;
import com.agriflux.model.User;
import com.agriflux.repository.UserRepository;
import com.agriflux.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ── REGISTER ─────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        // Step 1: Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "Email already registered: " + request.getEmail());
        }

        // Step 2: Build User object
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                // Step 3: Hash password with BCrypt
                // "password123" → "$2a$10$xyz..." (irreversible hash)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .isActive(true)
                .build();

        // Step 4: Save to database
        User savedUser = userRepository.save(user);

        // Step 5: Generate JWT token immediately after register
        String token = jwtUtil.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        // Step 6: Return response
        return AuthResponse.builder()
                .token(token)
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .message("Registration successful! Welcome to AgriFlux.")
                .build();
    }

    // ── LOGIN ────────────────────────────────────
    public AuthResponse login(LoginRequest request) {

        // Step 1: Authenticate using Spring Security
        // This internally:
        //   → Loads user by email (CustomUserDetailsService)
        //   → Compares password with BCrypt hash
        //   → Throws exception if wrong credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Step 2: If we reach here → authentication successful
        // Load user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Step 3: Check if account is active
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // Step 4: Generate JWT token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        // Step 5: Return token + user info
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login successful! Welcome back, " + user.getName())
                .build();
    }
}