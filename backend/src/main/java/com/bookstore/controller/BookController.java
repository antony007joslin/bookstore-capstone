package com.bookstore.controller;

import com.bookstore.entity.Book;
import com.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Books Catalogue", description = "Product catalog, search, details, and recommendations")
public class BookController {
    private final BookService bookService;

    @GetMapping("/books")
    @Operation(summary = "Get books", description = "Search and filter books by category, brand/publisher, or keyword")
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long publisherId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(bookService.getAllBooks(categoryId, publisherId, search));
    }

    @GetMapping("/books/featured")
    @Operation(summary = "Get featured books", description = "Retrieves curated featured books")
    public ResponseEntity<List<Book>> getFeaturedBooks() {
        return ResponseEntity.ok(bookService.getFeaturedBooks());
    }

    @GetMapping("/books/{id}")
    @Operation(summary = "Get book details", description = "Retrieves single book by ID")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/books/{id}/related")
    @Operation(summary = "Get related books", description = "Retrieves related books within the same category")
    public ResponseEntity<List<Book>> getRelatedBooks(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getRelatedBooks(id));
    }

    @GetMapping("/recommendations/user/{userId}")
    @Operation(summary = "Get recommended books for user", description = "Retrieves tailored book recommendations based on user order history")
    public ResponseEntity<List<Book>> getRecommendations(@PathVariable Long userId) {
        return ResponseEntity.ok(bookService.getRecommendationsForUser(userId));
    }
}
