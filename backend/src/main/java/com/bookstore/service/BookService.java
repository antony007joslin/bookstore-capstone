package com.bookstore.service;

import com.bookstore.entity.Book;
import com.bookstore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Book> getAllBooks(Long categoryId, Long publisherId, String search) {
        if (categoryId != null || publisherId != null || (search != null && !search.trim().isEmpty())) {
            String trimmedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
            return bookRepository.searchBooks(categoryId, publisherId, trimmedSearch);
        }
        return bookRepository.findAll();
    }

    public List<Book> getFeaturedBooks() {
        return bookRepository.findByFeaturedTrue();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    public List<Book> getRelatedBooks(Long id) {
        Book current = getBookById(id);
        if (current.getCategory() == null) {
            return List.of();
        }
        return bookRepository.findRelatedBooks(current.getCategory().getId(), id);
    }

    public List<Book> getRecommendationsForUser(Long userId) {
        List<Book> recommended = bookRepository.findRecommendationsByUserId(userId);
        if (recommended.isEmpty()) {
            return bookRepository.findByFeaturedTrue();
        }
        return recommended;
    }
}
