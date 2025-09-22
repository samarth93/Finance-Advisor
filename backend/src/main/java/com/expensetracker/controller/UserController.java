package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for User operations
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class UserController {
    
    private final UserService userService;
    
    /**
     * Create a new user
     * POST /api/users
     */
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());
        
        try {
            User user = userService.createUser(request.getName(), request.getEmail());
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating user with email: {}", request.getEmail(), e);
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }
    
    /**
     * Get user by userId
     * GET /api/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserByUserId(@PathVariable String userId) {
        log.info("Fetching user: {}", userId);
        
        try {
            User user = userService.getUserByUserId(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error fetching user: {}", userId, e);
            throw new RuntimeException("Failed to fetch user: " + e.getMessage());
        }
    }
    
    /**
     * Get user by email
     * GET /api/users/by-email
     */
    @GetMapping("/by-email")
    public ResponseEntity<User> getUserByEmail(@RequestParam @Email String email) {
        log.info("Fetching user by email: {}", email);
        
        try {
            Optional<User> user = userService.findByEmail(email);
            return user.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching user by email: {}", email, e);
            throw new RuntimeException("Failed to fetch user by email: " + e.getMessage());
        }
    }
    
    /**
     * Update user
     * PUT /api/users/{userId}
     */
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserRequest request) {
        
        log.info("Updating user: {}", userId);
        
        try {
            User user = userService.updateUser(userId, request.getName(), request.getEmail());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error updating user: {}", userId, e);
            throw new RuntimeException("Failed to update user: " + e.getMessage());
        }
    }
    
    /**
     * Delete user
     * DELETE /api/users/{userId}
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        log.info("Deleting user: {}", userId);
        
        try {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting user: {}", userId, e);
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }
    
    /**
     * Deactivate user
     * PUT /api/users/{userId}/deactivate
     */
    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable String userId) {
        log.info("Deactivating user: {}", userId);
        
        try {
            User user = userService.deactivateUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error deactivating user: {}", userId, e);
            throw new RuntimeException("Failed to deactivate user: " + e.getMessage());
        }
    }
    
    /**
     * Reactivate user
     * PUT /api/users/{userId}/reactivate
     */
    @PutMapping("/{userId}/reactivate")
    public ResponseEntity<User> reactivateUser(@PathVariable String userId) {
        log.info("Reactivating user: {}", userId);
        
        try {
            User user = userService.reactivateUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error reactivating user: {}", userId, e);
            throw new RuntimeException("Failed to reactivate user: " + e.getMessage());
        }
    }
    
    /**
     * Get all active users
     * GET /api/users/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<User>> getAllActiveUsers() {
        log.info("Fetching all active users");
        
        try {
            List<User> users = userService.getAllActiveUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching active users", e);
            throw new RuntimeException("Failed to fetch active users: " + e.getMessage());
        }
    }
    
    /**
     * Check if user exists
     * GET /api/users/{userId}/exists
     */
    @GetMapping("/{userId}/exists")
    public ResponseEntity<Boolean> userExists(@PathVariable String userId) {
        log.info("Checking if user exists: {}", userId);
        
        try {
            boolean exists = userService.userExists(userId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            log.error("Error checking user existence: {}", userId, e);
            throw new RuntimeException("Failed to check user existence: " + e.getMessage());
        }
    }
    
    /**
     * Get user statistics
     * GET /api/users/{userId}/stats
     */
    @GetMapping("/{userId}/stats")
    public ResponseEntity<UserService.UserStats> getUserStats(@PathVariable String userId) {
        log.info("Fetching user statistics: {}", userId);
        
        try {
            UserService.UserStats stats = userService.getUserStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching user statistics: {}", userId, e);
            throw new RuntimeException("Failed to fetch user statistics: " + e.getMessage());
        }
    }
    
    // Request DTOs
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class CreateUserRequest {
        @NotBlank(message = "Name cannot be blank")
        private String name;
        
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        private String email;
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UpdateUserRequest {
        @NotBlank(message = "Name cannot be blank")
        private String name;
        
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        private String email;
    }
}
