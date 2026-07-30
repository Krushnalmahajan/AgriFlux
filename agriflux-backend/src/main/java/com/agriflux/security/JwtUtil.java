package com.agriflux.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // ── Convert secret string to SecretKey object ──
    private SecretKey getSigningKey() {
        // Keys.hmacShaKeyFor needs at least 32 bytes (256 bits)
        // Make sure your jwt.secret in application.properties
        // is at least 32 characters long!
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ── GENERATE TOKEN ─────────────────────────────
    public String generateToken(String email, String role) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)                      // ← NEW: was setClaims()
                .subject(email)                      // ← NEW: was setSubject()
                .issuedAt(new Date())                // ← NEW: was setIssuedAt()
                .expiration(new Date(                // ← NEW: was setExpiration()
                        System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())            // ← NEW: no algorithm needed
                .compact();
    }

    // ── EXTRACT ALL CLAIMS ─────────────────────────
    private Claims extractAllClaims(String token) {
        return Jwts.parser()                         // ← NEW: was parserBuilder()
                .verifyWith(getSigningKey())          // ← NEW: was setSigningKey()
                .build()
                .parseSignedClaims(token)            // ← NEW: was parseClaimsJws()
                .getPayload();                       // ← NEW: was getBody()
    }

    // ── EXTRACT EMAIL FROM TOKEN ───────────────────
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ── EXTRACT ROLE FROM TOKEN ────────────────────
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // ── CHECK IF TOKEN IS EXPIRED ──────────────────
    private boolean isTokenExpired(String token) {
        Date expiryDate = extractAllClaims(token).getExpiration();
        return expiryDate.before(new Date());
    }

    // ── VALIDATE TOKEN ─────────────────────────────
    public boolean validateToken(String token, String email) {
        String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }
}