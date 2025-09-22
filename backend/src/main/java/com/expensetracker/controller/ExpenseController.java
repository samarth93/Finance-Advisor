package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequestDto;
import com.expensetracker.dto.ExpenseSummaryDto;
import com.expensetracker.model.Expense;
import com.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Expense operations
 */
@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ExpenseController {
    
    private final ExpenseService expenseService;
    
    /**
     * Get the current authenticated user ID from the security context
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // This will be the userId from the JWT
    }
    
    /**
     * Add a new expense (manual entry)
     * POST /api/expenses
     */
    @PostMapping
    public ResponseEntity<Expense> createExpense(
            @Valid @RequestBody ExpenseRequestDto expenseRequest) {
        
        String userId = getCurrentUserId();
        log.info("Creating expense for user: {} with amount: {}", userId, expenseRequest.getAmount());
        
        try {
            Expense expense = expenseService.createExpense(userId, expenseRequest);
            return new ResponseEntity<>(expense, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating expense for user: {}", userId, e);
            throw new RuntimeException("Failed to create expense: " + e.getMessage());
        }
    }
    
    /**
     * Fetch all expenses for the current authenticated user
     * GET /api/expenses
     */
    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses() {
        String userId = getCurrentUserId();
        log.info("Fetching expenses for user: {}", userId);
        
        try {
            List<Expense> expenses = expenseService.getExpensesByUserId(userId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            log.error("Error fetching expenses for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch expenses: " + e.getMessage());
        }
    }
    
    /**
     * Fetch paginated expenses for the current authenticated user
     * GET /api/expenses/paginated
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<Expense>> getExpensesPaginated(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Positive int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        String userId = getCurrentUserId();
        log.info("Fetching paginated expenses for user: {} (page: {}, size: {})", userId, page, size);
        
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy, "time"));
            Page<Expense> expenses = expenseService.getExpensesByUserId(userId, pageable);
            
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            log.error("Error fetching paginated expenses for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch paginated expenses: " + e.getMessage());
        }
    }
    
    /**
     * Fetch expense summary by category and month for the current authenticated user
     * GET /api/expenses/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryDto> getExpenseSummary(
            @RequestParam(defaultValue = "MONTHLY") String period,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        String userId = getCurrentUserId();
        log.info("Generating expense summary for user: {} with period: {}", userId, period);
        
        try {
            ExpenseSummaryDto summary = expenseService.getExpenseSummary(userId, period, startDate, endDate);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error generating expense summary for user: {}", userId, e);
            throw new RuntimeException("Failed to generate expense summary: " + e.getMessage());
        }
    }
    
    /**
     * Update an expense
     * PUT /api/expenses/{expenseId}
     */
    @PutMapping("/{expenseId}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable String expenseId,
            @Valid @RequestBody ExpenseRequestDto expenseRequest) {
        
        log.info("Updating expense: {}", expenseId);
        
        try {
            Expense expense = expenseService.updateExpense(expenseId, expenseRequest);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            log.error("Error updating expense: {}", expenseId, e);
            throw new RuntimeException("Failed to update expense: " + e.getMessage());
        }
    }
    
    /**
     * Delete an expense
     * DELETE /api/expenses/{expenseId}
     */
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String expenseId) {
        log.info("Deleting expense: {}", expenseId);
        
        try {
            expenseService.deleteExpense(expenseId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting expense: {}", expenseId, e);
            throw new RuntimeException("Failed to delete expense: " + e.getMessage());
        }
    }
    
    /**
     * Get expense by ID
     * GET /api/expenses/details/{expenseId}
     */
    @GetMapping("/details/{expenseId}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable String expenseId) {
        log.info("Fetching expense: {}", expenseId);
        
        try {
            Expense expense = expenseService.getExpenseByIdOrThrow(expenseId);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            log.error("Error fetching expense: {}", expenseId, e);
            throw new RuntimeException("Failed to fetch expense: " + e.getMessage());
        }
    }
    
    /**
     * Get expenses by date range
     * GET /api/expenses/{userId}/date-range
     */
    @GetMapping("/{userId}/date-range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        log.info("Fetching expenses for user: {} from {} to {}", userId, startDate, endDate);
        
        try {
            List<Expense> expenses = expenseService.getExpensesByDateRange(userId, startDate, endDate);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            log.error("Error fetching expenses by date range for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch expenses by date range: " + e.getMessage());
        }
    }
    
    /**
     * Get expenses by category
     * GET /api/expenses/{userId}/category/{category}
     */
    @GetMapping("/{userId}/category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(
            @PathVariable String userId,
            @PathVariable String category) {
        
        log.info("Fetching expenses for user: {} in category: {}", userId, category);
        
        try {
            List<Expense> expenses = expenseService.getExpensesByCategory(userId, category);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            log.error("Error fetching expenses by category for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch expenses by category: " + e.getMessage());
        }
    }
    
    /**
     * Search expenses
     * GET /api/expenses/{userId}/search
     */
    @GetMapping("/{userId}/search")
    public ResponseEntity<List<Expense>> searchExpenses(
            @PathVariable String userId,
            @RequestParam String query) {
        
        log.info("Searching expenses for user: {} with query: {}", userId, query);
        
        try {
            List<Expense> expenses = expenseService.searchExpenses(userId, query);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            log.error("Error searching expenses for user: {}", userId, e);
            throw new RuntimeException("Failed to search expenses: " + e.getMessage());
        }
    }
    
    /**
     * Get recent expenses
     * GET /api/expenses/{userId}/recent
     */
    @GetMapping("/{userId}/recent")
    public ResponseEntity<List<Expense>> getRecentExpenses(
            @PathVariable String userId,
            @RequestParam(defaultValue = "7") int days) {
        
        log.info("Fetching recent expenses for user: {} (last {} days)", userId, days);
        
        try {
            List<Expense> expenses = expenseService.getRecentExpenses(userId, days);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            log.error("Error fetching recent expenses for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch recent expenses: " + e.getMessage());
        }
    }
}
