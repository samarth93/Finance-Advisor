package com.expensetracker;

import com.expensetracker.dto.CategoryRequestDto;
import com.expensetracker.dto.ExpenseRequestDto;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

/**
 * Utility class for creating test data
 */
public class TestDataUtil {
    
    public static final String TEST_USER_ID = "testuser123";
    public static final String TEST_EMAIL = "test@example.com";
    public static final String TEST_NAME = "Test User";
    public static final String TEST_CATEGORY = "Food";
    public static final BigDecimal TEST_AMOUNT = BigDecimal.valueOf(100.50);
    
    public static User createTestUser() {
        return User.builder()
                .userId(TEST_USER_ID)
                .name(TEST_NAME)
                .email(TEST_EMAIL)
                .isActive(true)
                .build();
    }
    
    public static Category createTestCategory() {
        return Category.builder()
                .categoryId(Category.generateCategoryId(TEST_USER_ID, TEST_CATEGORY))
                .userId(TEST_USER_ID)
                .name(TEST_CATEGORY)
                .description("Test food category")
                .color("#EF4444")
                .icon("🍽️")
                .isDefault(true)
                .build();
    }
    
    public static CategoryRequestDto createTestCategoryRequest() {
        return CategoryRequestDto.builder()
                .name("Test Category")
                .description("Test category description")
                .color("#6366F1")
                .icon("🧪")
                .build();
    }
    
    public static Expense createTestExpense() {
        return Expense.builder()
                .expenseId(Expense.generateExpenseId(TEST_USER_ID))
                .userId(TEST_USER_ID)
                .amount(TEST_AMOUNT)
                .category(TEST_CATEGORY)
                .categoryId(Category.generateCategoryId(TEST_USER_ID, TEST_CATEGORY))
                .date(LocalDate.now())
                .time(LocalTime.now())
                .payee("Test Restaurant")
                .description("Test lunch")
                .paymentMethod("Credit Card")
                .tags(Set.of("lunch", "work"))
                .location("Test City")
                .isRecurring(false)
                .notes("Test expense for unit testing")
                .source("MANUAL")
                .build();
    }
    
    public static ExpenseRequestDto createTestExpenseRequest() {
        return ExpenseRequestDto.builder()
                .amount(TEST_AMOUNT)
                .category(TEST_CATEGORY)
                .date(LocalDate.now())
                .time(LocalTime.now())
                .payee("Test Payee")
                .description("Test expense")
                .paymentMethod("Credit Card")
                .tags(Set.of("test"))
                .location("Test Location")
                .isRecurring(false)
                .notes("Test notes")
                .build();
    }
    
    public static Expense createTestExpenseWithCustomData(
            String userId, 
            BigDecimal amount, 
            String category, 
            LocalDate date) {
        return Expense.builder()
                .expenseId(Expense.generateExpenseId(userId))
                .userId(userId)
                .amount(amount)
                .category(category)
                .categoryId(Category.generateCategoryId(userId, category))
                .date(date)
                .time(LocalTime.now())
                .payee("Custom Payee")
                .description("Custom expense")
                .paymentMethod("Debit Card")
                .source("MANUAL")
                .build();
    }
}
