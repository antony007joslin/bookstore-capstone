package com.bookstore.controller;

import com.bookstore.entity.Address;
import com.bookstore.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "User delivery address management")
public class AddressController {
    private final AddressService addressService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user delivery addresses", description = "Retrieves saved addresses for a specific user")
    public ResponseEntity<List<Address>> getAddressesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUserId(userId));
    }

    @PostMapping("/user/{userId}")
    @Operation(summary = "Add delivery address", description = "Saves a new delivery address for the user")
    public ResponseEntity<Address> addAddress(@PathVariable Long userId, @RequestBody Address address) {
        return ResponseEntity.ok(addressService.createAddress(userId, address));
    }
}
