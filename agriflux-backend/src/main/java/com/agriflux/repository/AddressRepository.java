package com.agriflux.repository;

import com.agriflux.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository
        extends JpaRepository<Address, Long> {

    // Get all addresses for a user
    List<Address> findByUserId(Long userId);

    // Get default address for a user
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);
}