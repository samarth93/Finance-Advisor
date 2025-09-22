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
import java.time.LocalDateTime;

/**
 * OPTIMIZED Expense entity representing individual expense transactions
 * 
 * REMOVED FIELDS:
 * - expenseId: Redundant with MongoDB's auto-generated _id
 * - category: Redundant with categoryId reference
 * - date + time: Combined into single datetime field
 * - receiptUrl: Future feature, add when receipt upload is implemented
 * - location: Future feature, add when location tracking is implemented
 * - isRecurring/recurringFrequency: Future feature, add when recurring expenses are implemented
 * - tags: Future feature, add when expense tagging is implemented
 * - source: Not currently used
 * 
 * SIMPLIFIED FIELDS:
 * - Uses MongoDB _id references for user and category relationships
 * - Combined date and time into single datetime field
 * - Simplified payment method to enum values
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "expenses")
public class ExpenseOptimized {
    
    @Id
    private String id;
    
    @Field("user_id")
    @NotBlank(message = "User ID cannot be blank")
    @Indexed
    private String userId; // References User._id
    
    @Field("category_id")
    @NotBlank(message = "Category ID cannot be blank")
    @Indexed
    private String categoryId; // References Category._id
    
    @Field("amount")
    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @DecimalMax(value = "1000000.00", message = "Amount cannot exceed 1,000,000")
    private BigDecimal amount;
    
    @Field("description")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @Field("datetime")
    @NotNull(message = "Date and time cannot be null")
    @Indexed
    private LocalDateTime datetime;
    
    @Field("payee")
    @Size(max = 100, message = "Payee name cannot exceed 100 characters")
    private String payee;
    
    @Field("payment_method")
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.CASH;
    
    @Field("notes")
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
    
    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Get month-year for grouping analytics
    public String getMonthYear() {
        return datetime.getYear() + "-" + String.format("%02d", datetime.getMonthValue());
    }
    
    // Get date for daily analytics
    public String getDateString() {
        return datetime.toLocalDate().toString();
    }
    
    // Update timestamp before saving
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Simplified Payment method enum
    public enum PaymentMethod {
        CREDIT_CARD("Credit Card"),
        DEBIT_CARD("Debit Card"),
        CASH("Cash"),
        UPI("UPI"),
        NET_BANKING("Net Banking"),
        DIGITAL_WALLET("Digital Wallet");
        
        private final String displayName;
        
        PaymentMethod(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}