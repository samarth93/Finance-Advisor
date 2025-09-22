package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

/**
 * DTO for expense creation and update requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequestDto {
    
    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @DecimalMax(value = "1000000.00", message = "Amount cannot exceed 1,000,000")
    private BigDecimal amount;
    
    @NotBlank(message = "Category cannot be blank")
    private String category;
    
    private String categoryId;
    
    @NotNull(message = "Date cannot be null")
    private LocalDate date;
    
    @NotNull(message = "Time cannot be null")
    private LocalTime time;
    
    @Size(max = 100, message = "Payee name cannot exceed 100 characters")
    private String payee;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    private String paymentMethod;
    
    private Set<String> tags;
    
    private String location;
    
    @Builder.Default
    private Boolean isRecurring = false;
    
    private String recurringFrequency;
    
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}
