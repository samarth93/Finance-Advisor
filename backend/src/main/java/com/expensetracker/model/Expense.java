package com.expensetracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Expense entity representing individual expense transactions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "expenses")
public class Expense {
    
    @Id
    private String id;
    
    @Field("expense_id")
    @NotBlank(message = "Expense ID cannot be blank")
    @Indexed(unique = true)
    private String expenseId;
    
    @Field("user_id")
    @NotBlank(message = "User ID cannot be blank")
    @Indexed
    private String userId;
    
    @Field("amount")
    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @DecimalMax(value = "1000000.00", message = "Amount cannot exceed 1,000,000")
    private BigDecimal amount;
    
    @Field("category")
    @NotBlank(message = "Category cannot be blank")
    @Indexed
    private String category;
    
    @Field("category_id")
    @Indexed
    private String categoryId;
    
    @Field("date")
    @NotNull(message = "Date cannot be null")
    @Indexed
    private LocalDate date;
    
    @Field("time")
    @NotNull(message = "Time cannot be null")
    private LocalTime time;
    
    @Field("payee")
    @Size(max = 100, message = "Payee name cannot exceed 100 characters")
    private String payee;
    
    @Field("description")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @Field("payment_method")
    private String paymentMethod; // Credit Card, Debit Card, Cash, UPI, Net Banking
    
    @Field("tags")
    private java.util.Set<String> tags;
    
    @Field("receipt_url")
    private String receiptUrl; // For future receipt storage
    
    @Field("location")
    private String location; // For future location-based tracking
    
    @Field("is_recurring")
    @Builder.Default
    private Boolean isRecurring = false;
    
    @Field("recurring_frequency")
    private String recurringFrequency; // DAILY, WEEKLY, MONTHLY, YEARLY
    
    @Field("notes")
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
    
    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Field("source")
    @Builder.Default
    private String source = "MANUAL"; // MANUAL, SMS, EMAIL, BANK_API
    
    // Generate unique expense ID
    public static String generateExpenseId(String userId) {
        return userId + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }
    
    // Get month-year for grouping
    public String getMonthYear() {
        return date.getYear() + "-" + String.format("%02d", date.getMonthValue());
    }
    
    // Update timestamp before saving
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Payment method enum for validation
    public enum PaymentMethod {
        CREDIT_CARD("Credit Card"),
        DEBIT_CARD("Debit Card"),
        CASH("Cash"),
        UPI("UPI"),
        NET_BANKING("Net Banking"),
        WALLET("Digital Wallet");
        
        private final String displayName;
        
        PaymentMethod(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Recurring frequency enum
    public enum RecurringFrequency {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }
    
    // Source enum for tracking expense origin
    public enum ExpenseSource {
        MANUAL, SMS, EMAIL, BANK_API
    }
}
