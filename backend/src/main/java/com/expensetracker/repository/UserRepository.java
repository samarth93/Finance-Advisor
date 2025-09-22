package com.expensetracker.repository;

import com.expensetracker.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Find user by userId field
     */
    Optional<User> findByUserId(String userId);
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if user exists by userId
     */
    boolean existsByUserId(String userId);
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);
    
    /**
     * Find all active users
     */
    @Query("{'is_active': true}")
    java.util.List<User> findAllActiveUsers();
    
    /**
     * Delete user by userId
     */
    void deleteByUserId(String userId);
}
