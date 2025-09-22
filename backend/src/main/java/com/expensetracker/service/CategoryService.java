package com.expensetracker.service;

import com.expensetracker.dto.CategoryRequestDto;
import com.expensetracker.model.Category;
import com.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Category operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    /**
     * Create default categories for a new user
     */
    @Transactional
    public List<Category> createDefaultCategories(String userId) {
        log.info("Creating default categories for user: {}", userId);
        
        // Check if default categories already exist
        List<Category> existingCategories = categoryRepository.findDefaultCategoriesByUserId(userId);
        if (!existingCategories.isEmpty()) {
            log.info("Default categories already exist for user: {}", userId);
            return existingCategories;
        }
        
        List<Category> defaultCategories = Category.getDefaultCategories(userId);
        List<Category> savedCategories = categoryRepository.saveAll(defaultCategories);
        
        log.info("Created {} default categories for user: {}", savedCategories.size(), userId);
        return savedCategories;
    }
    
    /**
     * Create a new custom category
     */
    @Transactional
    public Category createCategory(String userId, CategoryRequestDto categoryRequest) {
        log.info("Creating custom category '{}' for user: {}", categoryRequest.getName(), userId);
        
        // Check if category with same name already exists for this user
        if (categoryRepository.existsByUserIdAndName(userId, categoryRequest.getName())) {
            throw new RuntimeException("Category with name '" + categoryRequest.getName() + "' already exists for user: " + userId);
        }
        
        String categoryId = Category.generateCategoryId(userId, categoryRequest.getName());
        
        Category category = Category.builder()
                .categoryId(categoryId)
                .userId(userId)
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .color(categoryRequest.getColor() != null ? categoryRequest.getColor() : "#6366F1")
                .icon(categoryRequest.getIcon() != null ? categoryRequest.getIcon() : "💰")
                .isDefault(false)
                .build();
        
        Category savedCategory = categoryRepository.save(category);
        log.info("Custom category created successfully: {}", savedCategory.getCategoryId());
        
        return savedCategory;
    }
    
    /**
     * Get all categories for a user
     */
    public List<Category> getCategoriesByUserId(String userId) {
        log.debug("Fetching categories for user: {}", userId);
        return categoryRepository.findByUserIdOrderByName(userId);
    }
    
    /**
     * Get category by categoryId
     */
    public Optional<Category> getCategoryById(String categoryId) {
        return categoryRepository.findByCategoryId(categoryId);
    }
    
    /**
     * Get category by categoryId or throw exception
     */
    public Category getCategoryByIdOrThrow(String categoryId) {
        List<Category> categories = categoryRepository.findAll()
                .stream()
                .filter(c -> c.getCategoryId().equals(categoryId))
                .toList();
        
        if (categories.isEmpty()) {
            throw new RuntimeException("Category not found: " + categoryId);
        }
        
        // Return the first category if duplicates exist
        if (categories.size() > 1) {
            log.warn("Found {} duplicate categories with ID: {}, returning first one", categories.size(), categoryId);
        }
        
        return categories.get(0);
    }
    
    /**
     * Update category
     */
    @Transactional
    public Category updateCategory(String categoryId, CategoryRequestDto categoryRequest) {
        log.info("Updating category: {}", categoryId);
        
        Category category = getCategoryByIdOrThrow(categoryId);
        
        // Check if new name conflicts with existing category (excluding current category)
        Optional<Category> existingCategory = categoryRepository.findByUserIdAndName(
                category.getUserId(), categoryRequest.getName());
        
        if (existingCategory.isPresent() && !existingCategory.get().getCategoryId().equals(categoryId)) {
            throw new RuntimeException("Category with name '" + categoryRequest.getName() + "' already exists");
        }
        
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        category.setColor(categoryRequest.getColor() != null ? categoryRequest.getColor() : category.getColor());
        category.setIcon(categoryRequest.getIcon() != null ? categoryRequest.getIcon() : category.getIcon());
        category.updateTimestamp();
        
        Category updatedCategory = categoryRepository.save(category);
        log.info("Category updated successfully: {}", categoryId);
        
        return updatedCategory;
    }
    
    /**
     * Delete category
     */
    @Transactional
    public void deleteCategory(String categoryId) {
        log.info("Deleting category: {}", categoryId);
        
        Category category = getCategoryByIdOrThrow(categoryId);
        
        // Check if it's a default category
        if (category.getIsDefault()) {
            throw new RuntimeException("Cannot delete default category: " + categoryId);
        }
        
        // TODO: Check if category is being used by any expenses
        // For now, we'll allow deletion - in production, you might want to:
        // 1. Prevent deletion if expenses exist
        // 2. Or move expenses to "Others" category
        
        categoryRepository.delete(category);
        log.info("Category deleted successfully: {}", categoryId);
    }
    
    /**
     * Get default categories for a user
     */
    public List<Category> getDefaultCategories(String userId) {
        return categoryRepository.findDefaultCategoriesByUserId(userId);
    }
    
    /**
     * Search categories by name
     */
    public List<Category> searchCategoriesByName(String userId, String searchTerm) {
        log.debug("Searching categories for user '{}' with term: {}", userId, searchTerm);
        return categoryRepository.findByUserIdAndNameContaining(userId, searchTerm);
    }
    
    /**
     * Get category count for user
     */
    public long getCategoryCountForUser(String userId) {
        return categoryRepository.countByUserId(userId);
    }
    
    /**
     * Delete all categories for a user
     */
    @Transactional
    public void deleteAllUserCategories(String userId) {
        log.info("Deleting all categories for user: {}", userId);
        categoryRepository.deleteByUserId(userId);
        log.info("All categories deleted for user: {}", userId);
    }
    
    /**
     * Validate if category exists and belongs to user
     */
    public boolean validateCategoryForUser(String categoryId, String userId) {
        Optional<Category> category = categoryRepository.findByCategoryId(categoryId);
        return category.isPresent() && category.get().getUserId().equals(userId);
    }
    
    /**
     * Get or create default category for user
     */
    @Transactional
    public Category getOrCreateDefaultCategory(String userId, String categoryName) {
        Optional<Category> existingCategory = categoryRepository.findByUserIdAndName(userId, categoryName);
        
        if (existingCategory.isPresent()) {
            return existingCategory.get();
        }
        
        // Create new category
        CategoryRequestDto categoryRequest = CategoryRequestDto.builder()
                .name(categoryName)
                .description("Auto-created category")
                .build();
        
        return createCategory(userId, categoryRequest);
    }
}
