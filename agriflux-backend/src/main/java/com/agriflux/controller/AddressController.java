package com.agriflux.controller;

import com.agriflux.dto.request.AddressRequest;
import com.agriflux.model.Address;
import com.agriflux.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    private final AddressService addressService;

    // POST /api/addresses
    @PostMapping
    public ResponseEntity<Address> addAddress(
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(addressService.addAddress(request));
    }

    // GET /api/addresses
    @GetMapping
    public ResponseEntity<List<Address>> getMyAddresses() {
        return ResponseEntity.ok(
                addressService.getMyAddresses());
    }

    // DELETE /api/addresses/{addressId}
    @DeleteMapping("/{addressId}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok(
                "Address deleted successfully");
    }
}