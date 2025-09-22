package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for expense summary data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSummaryDto {
    
    private String userId;
    private String period; // DAILY, WEEKLY, MONTHLY, YEARLY
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalAmount;
    private Integer totalExpenses;
    private BigDecimal averageExpense;
    private List<CategorySummary> categoryBreakdown;
    private List<MonthlySummary> monthlyTrends;
    private String topCategory;
    private BigDecimal topCategoryAmount;
    private List<String> topPayees;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySummary {
        private String categoryId;
        private String categoryName;
        private BigDecimal amount;
        private Integer count;
        private Double percentage;
        private String color;
        private String icon;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlySummary {
        private String monthYear;
        private BigDecimal amount;
        private Integer count;
        private BigDecimal averageDaily;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayeeSummary {
        private String payee;
        private BigDecimal amount;
        private Integer count;
    }
}
