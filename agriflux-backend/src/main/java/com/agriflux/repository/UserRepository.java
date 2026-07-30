package com.agriflux.repository;

import com.agriflux.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA auto-generates SQL for these:

    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // SELECT COUNT(*) FROM users WHERE email = ?
    Boolean existsByEmail(String email);

    // SELECT * FROM users WHERE reset_token = ?
    Optional<User> findByResetToken(String resetToken);
}