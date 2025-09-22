package com.expensetracker.controller;

import com.expensetracker.dto.CategoryRequestDto;
import com.expensetracker.model.Category;
import com.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST Controller for Category operations
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class CategoryController {
    
    private final CategoryService categoryService;
    
    /**
     * Get the current authenticated user ID from the security context
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // This will be the userId from the JWT
    }
    
    /**
     * Add custom categories for the current authenticated user
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(
            @Valid @RequestBody CategoryRequestDto categoryRequest) {
        
        String userId = getCurrentUserId();
        log.info("Creating category '{}' for user: {}", categoryRequest.getName(), userId);
        
        try {
            Category category = categoryService.createCategory(userId, categoryRequest);
            return new ResponseEntity<>(category, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating category for user: {}", userId, e);
            throw new RuntimeException("Failed to create category: " + e.getMessage());
        }
    }
    
    /**
     * Get all categories for the current authenticated user
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        String userId = getCurrentUserId();
        log.info("Fetching categories for user: {}", userId);
        
        try {
            List<Category> categories = categoryService.getCategoriesByUserId(userId);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error fetching categories for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch categories: " + e.getMessage());
        }
    }
    
    /**
     * Get category by ID
     * GET /api/categories/details/{categoryId}
     */
    @GetMapping("/details/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String categoryId) {
        log.info("Fetching category: {}", categoryId);
        
        try {
            Category category = categoryService.getCategoryByIdOrThrow(categoryId);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            log.error("Error fetching category: {}", categoryId, e);
            throw new RuntimeException("Failed to fetch category: " + e.getMessage());
        }
    }
    
    /**
     * Update category
     * PUT /api/categories/{categoryId}
     */
    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable String categoryId,
            @Valid @RequestBody CategoryRequestDto categoryRequest) {
        
        log.info("Updating category: {}", categoryId);
        
        try {
            Category category = categoryService.updateCategory(categoryId, categoryRequest);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            log.error("Error updating category: {}", categoryId, e);
            throw new RuntimeException("Failed to update category: " + e.getMessage());
        }
    }
    
    /**
     * Delete category
     * DELETE /api/categories/{categoryId}
     */
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String categoryId) {
        log.info("Deleting category: {}", categoryId);
        
        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting category: {}", categoryId, e);
            throw new RuntimeException("Failed to delete category: " + e.getMessage());
        }
    }
    
    /**
     * Get default categories for a user
     * GET /api/categories/{userId}/defaults
     */
    @GetMapping("/{userId}/defaults")
    public ResponseEntity<List<Category>> getDefaultCategories(@PathVariable String userId) {
        log.info("Fetching default categories for user: {}", userId);
        
        try {
            List<Category> categories = categoryService.getDefaultCategories(userId);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error fetching default categories for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch default categories: " + e.getMessage());
        }
    }
    
    /**
     * Search categories by name
     * GET /api/categories/{userId}/search
     */
    @GetMapping("/{userId}/search")
    public ResponseEntity<List<Category>> searchCategories(
            @PathVariable String userId,
            @RequestParam String query) {
        
        log.info("Searching categories for user: {} with query: {}", userId, query);
        
        try {
            List<Category> categories = categoryService.searchCategoriesByName(userId, query);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error searching categories for user: {}", userId, e);
            throw new RuntimeException("Failed to search categories: " + e.getMessage());
        }
    }
    
    /**
     * Initialize default categories for a user
     * POST /api/categories/{userId}/initialize-defaults
     */
    @PostMapping("/{userId}/initialize-defaults")
    public ResponseEntity<List<Category>> initializeDefaultCategories(@PathVariable String userId) {
        log.info("Initializing default categories for user: {}", userId);
        
        try {
            List<Category> categories = categoryService.createDefaultCategories(userId);
            return new ResponseEntity<>(categories, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error initializing default categories for user: {}", userId, e);
            throw new RuntimeException("Failed to initialize default categories: " + e.getMessage());
        }
    }
    
    /**
     * Get category count for user
     * GET /api/categories/{userId}/count
     */
    @GetMapping("/{userId}/count")
    public ResponseEntity<Long> getCategoryCount(@PathVariable String userId) {
        log.info("Fetching category count for user: {}", userId);
        
        try {
            long count = categoryService.getCategoryCountForUser(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Error fetching category count for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch category count: " + e.getMessage());
        }
    }
}
