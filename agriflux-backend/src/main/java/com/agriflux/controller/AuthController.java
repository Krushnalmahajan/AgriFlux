package com.agriflux.controller;

import com.agriflux.dto.request.LoginRequest;
import com.agriflux.dto.request.RegisterRequest;
import com.agriflux.dto.response.AuthResponse;
import com.agriflux.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController               // ← REST API controller
@RequestMapping("/api/auth")  // ← All URLs start with /api/auth
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")  // ← Allow React to call this
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        // @Valid       → triggers validation annotations
        // @RequestBody → converts JSON body to Java object
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/test (to verify auth is working)
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth endpoints are working!");
    }
}