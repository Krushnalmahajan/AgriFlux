package com.agriflux.service;

import com.agriflux.dto.request.AddressRequest;
import com.agriflux.exception.ResourceNotFoundException;
import com.agriflux.model.Address;
import com.agriflux.model.User;
import com.agriflux.repository.AddressRepository;
import com.agriflux.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private User getLoggedInUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));
    }

    // ── ADD ADDRESS ───────────────────────────────
    public Address addAddress(AddressRequest request) {
        User user = getLoggedInUser();

        // If this is set as default
        // Remove default from existing addresses
        if (request.getIsDefault()) {
            List<Address> existing =
                    addressRepository.findByUserId(user.getId());
            existing.forEach(addr -> {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            });
        }

        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country("India")
                .isDefault(request.getIsDefault())
                .build();

        return addressRepository.save(address);
    }

    // ── GET MY ADDRESSES ──────────────────────────
    public List<Address> getMyAddresses() {
        User user = getLoggedInUser();
        return addressRepository.findByUserId(user.getId());
    }

    // ── DELETE ADDRESS ────────────────────────────
    public void deleteAddress(Long addressId) {
        User user = getLoggedInUser();

        Address address = addressRepository
                .findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Unauthorized: Address does not belong to you");
        }

        addressRepository.delete(address);
    }
}