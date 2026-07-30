package com.agriflux.model;

import com.agriflux.enums.AuthProvider;
import com.agriflux.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity                         // ← Tells Hibernate: make this a DB table
@Table(name = "users")          // ← Table name in MySQL will be "users"
@Data                           // ← Lombok: generates getters, setters, toString
@NoArgsConstructor              // ← Lombok: generates empty constructor
@AllArgsConstructor             // ← Lombok: generates constructor with all fields
@Builder                        // ← Lombok: enables builder pattern
public class User {

    @Id                                    // ← This is the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ← Auto increment
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Email(message = "Enter valid email")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)  // ← No two users same email
    private String email;

    @Column(nullable = true)    // ← Nullable because Google login has no password
    private String password;

    @Enumerated(EnumType.STRING)           // ← Store enum as text in DB
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;         // ← Default role is USER

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "provider_id")          // ← Google's user ID
    private String providerId;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;       // ← Account active by default

    @Column(name = "reset_token")          // ← For forgot password feature
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @CreationTimestamp                     // ← Auto set when record created
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp                       // ← Auto update when record changes
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Relationships ─────────────────────────────
    // One User has many Addresses
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> addresses;

    // One User has one Cart
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;

    // One User has many Orders
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
}