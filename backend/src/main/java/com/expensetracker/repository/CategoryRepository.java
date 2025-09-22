package com.expensetracker.repository;

import com.expensetracker.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Category entity
 */
@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    /**
     * Find category by categoryId
     */
    Optional<Category> findByCategoryId(String categoryId);
    
    /**
     * Find all categories for a specific user
     */
    List<Category> findByUserId(String userId);
    
    /**
     * Find categories by user ID ordered by name
     */
    List<Category> findByUserIdOrderByName(String userId);
    
    /**
     * Find default categories for a user
     */
    @Query("{'user_id': ?0, 'is_default': true}")
    List<Category> findDefaultCategoriesByUserId(String userId);
    
    /**
     * Find category by user ID and name
     */
    Optional<Category> findByUserIdAndName(String userId, String name);
    
    /**
     * Check if category exists for user with given name
     */
    boolean existsByUserIdAndName(String userId, String name);
    
    /**
     * Count categories for a user
     */
    long countByUserId(String userId);
    
    /**
     * Delete all categories for a user
     */
    void deleteByUserId(String userId);
    
    /**
     * Find categories by name containing (case insensitive)
     */
    @Query("{'user_id': ?0, 'name': {$regex: ?1, $options: 'i'}}")
    List<Category> findByUserIdAndNameContaining(String userId, String namePattern);
}
