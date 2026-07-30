package com.agriflux.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
// OncePerRequestFilter = runs exactly once per request

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // ── Step 1: Get Authorization header ────
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;

        // ── Step 2: Check if header has Bearer token
        // Header format: "Bearer eyJhbGciOi..."
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
            email = jwtUtil.extractEmail(token);
        }

        // ── Step 3: Validate token ───────────────
        // Only proceed if email found AND no existing authentication
        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user from database
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            // Check if token is valid
            if (jwtUtil.validateToken(token, userDetails.getUsername())) {

                // ── Step 4: Create authentication object
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,  // credentials (not needed after auth)
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                // ── Step 5: Tell Spring Security this user is authenticated
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // ── Step 6: Continue to next filter/controller
        filterChain.doFilter(request, response);
    }
}