package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequestDto;
import com.expensetracker.dto.ExpenseSummaryDto;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for Expense operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    
    /**
     * Create a new expense
     */
    @Transactional
    public Expense createExpense(String userId, ExpenseRequestDto expenseRequest) {
        log.info("Creating expense for user: {} with amount: {}", userId, expenseRequest.getAmount());
        
        // Validate user exists
        if (!userService.userExists(userId)) {
            throw new RuntimeException("User not found: " + userId);
        }
        
        // Validate and get category
        Category category = validateAndGetCategory(userId, expenseRequest);
        
        // Generate expense ID
        String expenseId = Expense.generateExpenseId(userId);
        
        // Create expense
        Expense expense = Expense.builder()
                .expenseId(expenseId)
                .userId(userId)
                .amount(expenseRequest.getAmount())
                .category(category.getName())
                .categoryId(category.getCategoryId())
                .date(expenseRequest.getDate())
                .time(expenseRequest.getTime())
                .payee(expenseRequest.getPayee())
                .description(expenseRequest.getDescription())
                .paymentMethod(expenseRequest.getPaymentMethod())
                .tags(expenseRequest.getTags())
                .location(expenseRequest.getLocation())
                .isRecurring(expenseRequest.getIsRecurring())
                .recurringFrequency(expenseRequest.getRecurringFrequency())
                .notes(expenseRequest.getNotes())
                .source("MANUAL")
                .build();
        
        Expense savedExpense = expenseRepository.save(expense);
        log.info("Expense created successfully: {}", savedExpense.getExpenseId());
        
        return savedExpense;
    }
    
    /**
     * Get all expenses for a user
     */
    public List<Expense> getExpensesByUserId(String userId) {
        log.debug("Fetching all expenses for user: {}", userId);
        return expenseRepository.findByUserIdOrderByDateDescTimeDesc(userId);
    }
    
    /**
     * Get paginated expenses for a user
     */
    public Page<Expense> getExpensesByUserId(String userId, Pageable pageable) {
        log.debug("Fetching paginated expenses for user: {}", userId);
        return expenseRepository.findByUserId(userId, pageable);
    }
    
    /**
     * Get expense by expenseId
     */
    public Optional<Expense> getExpenseById(String expenseId) {
        return expenseRepository.findByExpenseId(expenseId);
    }
    
    /**
     * Get expense by expenseId or throw exception
     */
    public Expense getExpenseByIdOrThrow(String expenseId) {
        return expenseRepository.findByExpenseId(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + expenseId));
    }
    
    /**
     * Update expense
     */
    @Transactional
    public Expense updateExpense(String expenseId, ExpenseRequestDto expenseRequest) {
        log.info("Updating expense: {}", expenseId);
        
        Expense expense = getExpenseByIdOrThrow(expenseId);
        
        // Validate and get category if changed
        Category category = validateAndGetCategory(expense.getUserId(), expenseRequest);
        
        // Update expense fields
        expense.setAmount(expenseRequest.getAmount());
        expense.setCategory(category.getName());
        expense.setCategoryId(category.getCategoryId());
        expense.setDate(expenseRequest.getDate());
        expense.setTime(expenseRequest.getTime());
        expense.setPayee(expenseRequest.getPayee());
        expense.setDescription(expenseRequest.getDescription());
        expense.setPaymentMethod(expenseRequest.getPaymentMethod());
        expense.setTags(expenseRequest.getTags());
        expense.setLocation(expenseRequest.getLocation());
        expense.setIsRecurring(expenseRequest.getIsRecurring());
        expense.setRecurringFrequency(expenseRequest.getRecurringFrequency());
        expense.setNotes(expenseRequest.getNotes());
        expense.updateTimestamp();
        
        Expense updatedExpense = expenseRepository.save(expense);
        log.info("Expense updated successfully: {}", expenseId);
        
        return updatedExpense;
    }
    
    /**
     * Delete expense
     */
    @Transactional
    public void deleteExpense(String expenseId) {
        log.info("Deleting expense: {}", expenseId);
        
        Expense expense = getExpenseByIdOrThrow(expenseId);
        expenseRepository.delete(expense);
        
        log.info("Expense deleted successfully: {}", expenseId);
    }
    
    /**
     * Get expenses by date range
     */
    public List<Expense> getExpensesByDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching expenses for user '{}' from {} to {}", userId, startDate, endDate);
        return expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }
    
    /**
     * Get expenses by category
     */
    public List<Expense> getExpensesByCategory(String userId, String category) {
        log.debug("Fetching expenses for user '{}' in category: {}", userId, category);
        return expenseRepository.findByUserIdAndCategory(userId, category);
    }
    
    /**
     * Get expense summary for a user
     */
    public ExpenseSummaryDto getExpenseSummary(String userId, String period, LocalDate startDate, LocalDate endDate) {
        log.info("Generating expense summary for user '{}' for period: {}", userId, period);
        
        List<Expense> expenses;
        
        // Determine date range based on period
        if (startDate == null || endDate == null) {
            switch (period.toUpperCase()) {
                case "MONTHLY":
                    startDate = LocalDate.now().withDayOfMonth(1);
                    endDate = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
                    break;
                case "YEARLY":
                    startDate = LocalDate.now().withDayOfYear(1);
                    endDate = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear());
                    break;
                case "WEEKLY":
                    startDate = LocalDate.now().minusDays(6);
                    endDate = LocalDate.now();
                    break;
                default: // DAILY or custom
                    if (startDate == null) startDate = LocalDate.now();
                    if (endDate == null) endDate = LocalDate.now();
            }
        }
        
        expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        
        if (expenses.isEmpty()) {
            return ExpenseSummaryDto.builder()
                    .userId(userId)
                    .period(period)
                    .startDate(startDate)
                    .endDate(endDate)
                    .totalAmount(BigDecimal.ZERO)
                    .totalExpenses(0)
                    .averageExpense(BigDecimal.ZERO)
                    .categoryBreakdown(new ArrayList<>())
                    .monthlyTrends(new ArrayList<>())
                    .build();
        }
        
        // Calculate totals
        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        int totalExpenses = expenses.size();
        BigDecimal averageExpense = totalAmount.divide(BigDecimal.valueOf(totalExpenses), 2, RoundingMode.HALF_UP);
        
        // Category breakdown
        Map<String, List<Expense>> expensesByCategory = expenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory));
        
        List<ExpenseSummaryDto.CategorySummary> categoryBreakdown = new ArrayList<>();
        String topCategory = "";
        BigDecimal topCategoryAmount = BigDecimal.ZERO;
        
        // Get category details - handle duplicates by taking the first occurrence
        List<Category> userCategories = categoryService.getCategoriesByUserId(userId);
        Map<String, Category> categoryMap = userCategories.stream()
                .collect(Collectors.toMap(
                    Category::getName, 
                    c -> c,
                    (existing, replacement) -> existing // Keep the first occurrence if duplicates exist
                ));
        
        for (Map.Entry<String, List<Expense>> entry : expensesByCategory.entrySet()) {
            String categoryName = entry.getKey();
            List<Expense> categoryExpenses = entry.getValue();
            
            BigDecimal categoryAmount = categoryExpenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            double percentage = categoryAmount.divide(totalAmount, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            
            Category category = categoryMap.get(categoryName);
            
            ExpenseSummaryDto.CategorySummary categorySummary = ExpenseSummaryDto.CategorySummary.builder()
                    .categoryName(categoryName)
                    .categoryId(category != null ? category.getCategoryId() : "")
                    .amount(categoryAmount)
                    .count(categoryExpenses.size())
                    .percentage(percentage)
                    .color(category != null ? category.getColor() : "#6366F1")
                    .icon(category != null ? category.getIcon() : "💰")
                    .build();
            
            categoryBreakdown.add(categorySummary);
            
            if (categoryAmount.compareTo(topCategoryAmount) > 0) {
                topCategory = categoryName;
                topCategoryAmount = categoryAmount;
            }
        }
        
        // Sort category breakdown by amount (descending)
        categoryBreakdown.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        
        // Monthly trends
        List<ExpenseSummaryDto.MonthlySummary> monthlyTrends = generateMonthlyTrends(userId);
        
        // Top payees
        List<String> topPayees = expenses.stream()
                .map(Expense::getPayee)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(payee -> payee, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        
        return ExpenseSummaryDto.builder()
                .userId(userId)
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .totalAmount(totalAmount)
                .totalExpenses(totalExpenses)
                .averageExpense(averageExpense)
                .categoryBreakdown(categoryBreakdown)
                .monthlyTrends(monthlyTrends)
                .topCategory(topCategory)
                .topCategoryAmount(topCategoryAmount)
                .topPayees(topPayees)
                .build();
    }
    
    /**
     * Generate monthly trends for the last 12 months
     */
    private List<ExpenseSummaryDto.MonthlySummary> generateMonthlyTrends(String userId) {
        List<ExpenseSummaryDto.MonthlySummary> monthlyTrends = new ArrayList<>();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(11).withDayOfMonth(1);
        
        for (int i = 0; i < 12; i++) {
            YearMonth yearMonth = YearMonth.from(startDate.plusMonths(i));
            LocalDate monthStart = yearMonth.atDay(1);
            LocalDate monthEnd = yearMonth.atEndOfMonth();
            
            List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateBetween(userId, monthStart, monthEnd);
            
            BigDecimal monthTotal = monthExpenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal averageDaily = BigDecimal.ZERO;
            if (!monthExpenses.isEmpty()) {
                averageDaily = monthTotal.divide(BigDecimal.valueOf(yearMonth.lengthOfMonth()), 2, RoundingMode.HALF_UP);
            }
            
            ExpenseSummaryDto.MonthlySummary monthlySummary = ExpenseSummaryDto.MonthlySummary.builder()
                    .monthYear(yearMonth.toString())
                    .amount(monthTotal)
                    .count(monthExpenses.size())
                    .averageDaily(averageDaily)
                    .build();
            
            monthlyTrends.add(monthlySummary);
        }
        
        return monthlyTrends;
    }
    
    /**
     * Search expenses
     */
    public List<Expense> searchExpenses(String userId, String searchTerm) {
        // For now, search by payee - can be extended to search in description, notes, etc.
        return expenseRepository.findByUserIdAndPayeeContainingIgnoreCase(userId, searchTerm);
    }
    
    /**
     * Get recent expenses
     */
    public List<Expense> getRecentExpenses(String userId, int days) {
        LocalDate since = LocalDate.now().minusDays(days - 1);
        return expenseRepository.findRecentExpenses(userId, since);
    }
    
    /**
     * Validate and get category for expense
     */
    private Category validateAndGetCategory(String userId, ExpenseRequestDto expenseRequest) {
        Category category;
        
        if (expenseRequest.getCategoryId() != null && !expenseRequest.getCategoryId().isEmpty()) {
            // Use provided category ID
            try {
                category = categoryService.getCategoryByIdOrThrow(expenseRequest.getCategoryId());
                if (!category.getUserId().equals(userId)) {
                    throw new RuntimeException("Invalid category ID: " + expenseRequest.getCategoryId());
                }
            } catch (RuntimeException e) {
                throw new RuntimeException("Invalid category ID: " + expenseRequest.getCategoryId());
            }
        } else if (expenseRequest.getCategory() != null && !expenseRequest.getCategory().isEmpty()) {
            // Use category name - find or create
            category = categoryService.getOrCreateDefaultCategory(userId, expenseRequest.getCategory());
        } else {
            throw new RuntimeException("Category is required");
        }
        
        return category;
    }
}
