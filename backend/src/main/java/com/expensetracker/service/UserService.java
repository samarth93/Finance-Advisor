package com.expensetracker.service;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for User operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    
    /**
     * Create a new user with default categories
     */
    @Transactional
    public User createUser(String name, String email) {
        log.info("Creating new user with email: {}", email);
        
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists");
        }
        
        // Generate userId from email
        String userId = User.generateUserIdFromEmail(email);
        
        // Check if userId is already taken
        if (userRepository.existsByUserId(userId)) {
            userId = userId + "_" + System.currentTimeMillis();
        }
        
        // Create and save user
        User user = User.builder()
                .userId(userId)
                .name(name)
                .email(email)
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User created successfully: {}", savedUser.getUserId());
        
        // Create default categories for the user
        try {
            categoryService.createDefaultCategories(userId);
            log.info("Default categories created for user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to create default categories for user: {}", userId, e);
            // Don't fail user creation if category creation fails
        }
        
        return savedUser;
    }
    
    /**
     * Find user by userId
     */
    public Optional<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }
    
    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Get user by userId or throw exception
     */
    public User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }
    
    /**
     * Update user information
     */
    @Transactional
    public User updateUser(String userId, String name, String email) {
        log.info("Updating user: {}", userId);
        
        User user = getUserByUserId(userId);
        
        // Check if new email is already taken by another user
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email " + email + " is already taken by another user");
        }
        
        user.setName(name);
        user.setEmail(email);
        user.updateTimestamp();
        
        User updatedUser = userRepository.save(user);
        log.info("User updated successfully: {}", userId);
        
        return updatedUser;
    }
    
    /**
     * Delete user and all associated data
     */
    @Transactional
    public void deleteUser(String userId) {
        log.info("Deleting user: {}", userId);
        
        // Verify user exists before deletion
        getUserByUserId(userId);
        
        // Delete all associated categories and expenses
        try {
            categoryService.deleteAllUserCategories(userId);
            log.info("Deleted all categories for user: {}", userId);
        } catch (Exception e) {
            log.error("Error deleting categories for user: {}", userId, e);
        }
        
        // Delete user
        userRepository.deleteByUserId(userId);
        log.info("User deleted successfully: {}", userId);
    }
    
    /**
     * Deactivate user (soft delete)
     */
    @Transactional
    public User deactivateUser(String userId) {
        log.info("Deactivating user: {}", userId);
        
        User user = getUserByUserId(userId);
        user.setIsActive(false);
        user.updateTimestamp();
        
        User deactivatedUser = userRepository.save(user);
        log.info("User deactivated successfully: {}", userId);
        
        return deactivatedUser;
    }
    
    /**
     * Reactivate user
     */
    @Transactional
    public User reactivateUser(String userId) {
        log.info("Reactivating user: {}", userId);
        
        User user = getUserByUserId(userId);
        user.setIsActive(true);
        user.updateTimestamp();
        
        User reactivatedUser = userRepository.save(user);
        log.info("User reactivated successfully: {}", userId);
        
        return reactivatedUser;
    }
    
    /**
     * Get all active users
     */
    public List<User> getAllActiveUsers() {
        return userRepository.findAllActiveUsers();
    }
    
    /**
     * Check if user exists
     */
    public boolean userExists(String userId) {
        return userRepository.existsByUserId(userId);
    }
    
    /**
     * Get user statistics
     */
    public UserStats getUserStats(String userId) {
        User user = getUserByUserId(userId);
        
        // Get category count and expense count (will be implemented with ExpenseService)
        long categoryCount = categoryService.getCategoryCountForUser(userId);
        
        return UserStats.builder()
                .userId(userId)
                .name(user.getName())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .categoryCount(categoryCount)
                .build();
    }
    
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UserStats {
        private String userId;
        private String name;
        private String email;
        private Boolean isActive;
        private java.time.LocalDateTime createdAt;
        private Long categoryCount;
        private Long expenseCount;
        private java.math.BigDecimal totalExpenses;
    }
}
