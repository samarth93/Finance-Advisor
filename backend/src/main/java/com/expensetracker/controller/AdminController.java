package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Admin controller for database management operations
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Analyze database collections and schema
     */
    @GetMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeDatabase() {
        Map<String, Object> analysis = new HashMap<>();
        
        try {
            // Collection counts
            Map<String, Object> collections = new HashMap<>();
            collections.put("users_count", mongoTemplate.count(new Query(), User.class));
            collections.put("categories_count", mongoTemplate.count(new Query(), Category.class));
            collections.put("expenses_count", mongoTemplate.count(new Query(), Expense.class));
            analysis.put("collections", collections);
            
            // Sample documents
            Map<String, Object> samples = new HashMap<>();
            
            // Sample user
            User sampleUser = mongoTemplate.findOne(new Query().limit(1), User.class);
            if (sampleUser != null) {
                Map<String, Object> userSample = new HashMap<>();
                userSample.put("fields", Arrays.asList("id", "userId", "name", "email", "role", "emailVerified", 
                    "lastLogin", "createdAt", "updatedAt", "isActive"));
                userSample.put("indexes", Arrays.asList("email (unique)", "userId (unique)"));
                samples.put("user_schema", userSample);
            }
            
            // Sample category
            Category sampleCategory = mongoTemplate.findOne(new Query().limit(1), Category.class);
            if (sampleCategory != null) {
                Map<String, Object> categorySample = new HashMap<>();
                categorySample.put("fields", Arrays.asList("id", "categoryId", "userId", "name", "description", 
                    "color", "icon", "isDefault", "createdAt", "updatedAt"));
                categorySample.put("indexes", Arrays.asList("categoryId", "userId", "user_id + name (compound, unique)"));
                samples.put("category_schema", categorySample);
            }
            
            // Sample expense
            Expense sampleExpense = mongoTemplate.findOne(new Query().limit(1), Expense.class);
            if (sampleExpense != null) {
                Map<String, Object> expenseSample = new HashMap<>();
                expenseSample.put("fields", Arrays.asList("id", "expenseId", "userId", "amount", "category", 
                    "categoryId", "date", "time", "payee", "description", "paymentMethod", "tags", 
                    "receiptUrl", "location", "isRecurring", "recurringFrequency", "notes", 
                    "createdAt", "updatedAt", "source"));
                expenseSample.put("indexes", Arrays.asList("expenseId (unique)", "userId", "categoryId", "date"));
                samples.put("expense_schema", expenseSample);
            }
            
            analysis.put("schemas", samples);
            
            // Data integrity analysis
            Map<String, Object> integrity = new HashMap<>();
            
            // Check for orphaned data
            List<User> users = mongoTemplate.findAll(User.class);
            List<Category> categories = mongoTemplate.findAll(Category.class);
            List<Expense> expenses = mongoTemplate.findAll(Expense.class);
            
            Set<String> userIds = new HashSet<>();
            users.forEach(user -> userIds.add(user.getUserId()));
            
            Set<String> categoryIds = new HashSet<>();
            categories.forEach(category -> categoryIds.add(category.getCategoryId()));
            
            // Check orphaned categories
            long orphanedCategories = categories.stream()
                .filter(category -> !userIds.contains(category.getUserId()))
                .count();
            integrity.put("orphaned_categories", orphanedCategories);
            
            // Check orphaned expenses
            long orphanedExpensesByUser = expenses.stream()
                .filter(expense -> !userIds.contains(expense.getUserId()))
                .count();
            integrity.put("orphaned_expenses_by_user", orphanedExpensesByUser);
            
            long orphanedExpensesByCategory = expenses.stream()
                .filter(expense -> expense.getCategoryId() != null && !categoryIds.contains(expense.getCategoryId()))
                .count();
            integrity.put("orphaned_expenses_by_category", orphanedExpensesByCategory);
            
            analysis.put("data_integrity", integrity);
            
            // Schema issues
            List<String> issues = new ArrayList<>();
            List<String> recommendations = new ArrayList<>();
            
            // Check for unused fields in Expense model
            boolean hasReceiptUrl = expenses.stream().anyMatch(e -> e.getReceiptUrl() != null);
            boolean hasLocation = expenses.stream().anyMatch(e -> e.getLocation() != null);
            boolean hasRecurring = expenses.stream().anyMatch(e -> e.getIsRecurring() != null && e.getIsRecurring());
            boolean hasTags = expenses.stream().anyMatch(e -> e.getTags() != null && !e.getTags().isEmpty());
            
            if (!hasReceiptUrl) {
                issues.add("receiptUrl field is unused in all expenses");
                recommendations.add("Consider removing receiptUrl field or implement receipt upload feature");
            }
            
            if (!hasLocation) {
                issues.add("location field is unused in all expenses");
                recommendations.add("Consider removing location field or implement location tracking");
            }
            
            if (!hasRecurring) {
                issues.add("recurring expense features are unused");
                recommendations.add("Consider removing recurring fields or implement recurring expense feature");
            }
            
            if (!hasTags) {
                issues.add("tags field is unused in all expenses");
                recommendations.add("Consider removing tags field or implement expense tagging");
            }
            
            // Check User model fields
            boolean hasEmailVerified = users.stream().anyMatch(u -> u.getEmailVerified() != null && u.getEmailVerified());
            boolean hasLastLogin = users.stream().anyMatch(u -> u.getLastLogin() != null);
            
            if (!hasEmailVerified) {
                issues.add("Email verification feature is not implemented");
                recommendations.add("Consider implementing email verification or remove emailVerified field");
            }
            
            if (!hasLastLogin) {
                issues.add("Last login tracking is not being used");
                recommendations.add("Consider implementing last login tracking or remove lastLogin field");
            }
            
            analysis.put("schema_issues", issues);
            analysis.put("recommendations", recommendations);
            
            return ResponseEntity.ok(analysis);
            
        } catch (Exception e) {
            analysis.put("error", "Failed to analyze database: " + e.getMessage());
            return ResponseEntity.status(500).body(analysis);
        }
    }
    
    /**
     * Clean all data from collections while preserving schema
     */
    @DeleteMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupDatabase() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get counts before cleanup
            long usersCount = mongoTemplate.count(new Query(), User.class);
            long categoriesCount = mongoTemplate.count(new Query(), Category.class);
            long expensesCount = mongoTemplate.count(new Query(), Expense.class);
            
            // Clear all collections
            mongoTemplate.remove(new Query(), User.class);
            mongoTemplate.remove(new Query(), Category.class);
            mongoTemplate.remove(new Query(), Expense.class);
            
            // Verify cleanup
            long usersAfter = mongoTemplate.count(new Query(), User.class);
            long categoriesAfter = mongoTemplate.count(new Query(), Category.class);
            long expensesAfter = mongoTemplate.count(new Query(), Expense.class);
            
            Map<String, Object> deleted = new HashMap<>();
            deleted.put("users_deleted", usersCount);
            deleted.put("categories_deleted", categoriesCount);
            deleted.put("expenses_deleted", expensesCount);
            
            Map<String, Object> remaining = new HashMap<>();
            remaining.put("users_remaining", usersAfter);
            remaining.put("categories_remaining", categoriesAfter);
            remaining.put("expenses_remaining", expensesAfter);
            
            result.put("deleted_counts", deleted);
            result.put("remaining_counts", remaining);
            result.put("status", "success");
            result.put("message", "All data cleared successfully. Collections and indexes preserved.");
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            result.put("error", "Failed to cleanup database: " + e.getMessage());
            result.put("status", "error");
            return ResponseEntity.status(500).body(result);
        }
    }
    
    /**
     * Get detailed collection statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCollectionStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Users statistics
            List<User> users = mongoTemplate.findAll(User.class);
            Map<String, Object> userStats = new HashMap<>();
            userStats.put("total_users", users.size());
            userStats.put("active_users", users.stream().filter(u -> u.getIsActive() != null && u.getIsActive()).count());
            userStats.put("verified_users", users.stream().filter(u -> u.getEmailVerified() != null && u.getEmailVerified()).count());
            stats.put("users", userStats);
            
            // Categories statistics
            List<Category> categories = mongoTemplate.findAll(Category.class);
            Map<String, Object> categoryStats = new HashMap<>();
            categoryStats.put("total_categories", categories.size());
            categoryStats.put("default_categories", categories.stream().filter(c -> c.getIsDefault() != null && c.getIsDefault()).count());
            categoryStats.put("custom_categories", categories.stream().filter(c -> c.getIsDefault() == null || !c.getIsDefault()).count());
            stats.put("categories", categoryStats);
            
            // Expenses statistics
            List<Expense> expenses = mongoTemplate.findAll(Expense.class);
            Map<String, Object> expenseStats = new HashMap<>();
            expenseStats.put("total_expenses", expenses.size());
            if (!expenses.isEmpty()) {
                double totalAmount = expenses.stream().mapToDouble(e -> e.getAmount().doubleValue()).sum();
                double avgAmount = totalAmount / expenses.size();
                expenseStats.put("total_amount", totalAmount);
                expenseStats.put("average_amount", avgAmount);
                
                // Payment method breakdown
                Map<String, Long> paymentMethods = new HashMap<>();
                expenses.forEach(e -> {
                    String method = e.getPaymentMethod() != null ? e.getPaymentMethod() : "Unknown";
                    paymentMethods.put(method, paymentMethods.getOrDefault(method, 0L) + 1);
                });
                expenseStats.put("payment_methods", paymentMethods);
            }
            stats.put("expenses", expenseStats);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            stats.put("error", "Failed to get statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(stats);
        }
    }
}