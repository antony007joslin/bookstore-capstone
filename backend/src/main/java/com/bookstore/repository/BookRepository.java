package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByFeaturedTrue();

    List<Book> findByCategoryId(Long categoryId);

    List<Book> findByPublisherId(Long publisherId);

    @Query("SELECT b FROM Book b WHERE " +
           "(:categoryId IS NULL OR b.category.id = :categoryId) AND " +
           "(:publisherId IS NULL OR b.publisher.id = :publisherId) AND " +
           "(:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Book> searchBooks(@Param("categoryId") Long categoryId,
                           @Param("publisherId") Long publisherId,
                           @Param("search") String search);

    @Query("SELECT b FROM Book b WHERE b.category.id = :categoryId AND b.id <> :bookId ORDER BY b.rating DESC")
    List<Book> findRelatedBooks(@Param("categoryId") Long categoryId, @Param("bookId") Long bookId);

    @Query("SELECT DISTINCT b FROM Book b WHERE b.category.id IN " +
           "(SELECT oi.book.category.id FROM OrderItem oi WHERE oi.order.user.id = :userId) " +
           "AND b.id NOT IN (SELECT oi.book.id FROM OrderItem oi WHERE oi.order.user.id = :userId)")
    List<Book> findRecommendationsByUserId(@Param("userId") Long userId);
}
