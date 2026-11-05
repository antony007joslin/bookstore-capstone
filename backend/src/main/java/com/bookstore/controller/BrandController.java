package com.bookstore.controller;

import com.bookstore.entity.Brand;
import com.bookstore.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
@Tag(name = "Brands & Publishers", description = "Publisher and brand browsing")
public class BrandController {
    private final BrandService brandService;

    @GetMapping
    @Operation(summary = "Get all brands / publishers", description = "Retrieves all book publishers")
    public ResponseEntity<List<Brand>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get brand by ID", description = "Retrieves specific publisher/brand details")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }
}
