package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Expense entity with advanced queries
 */
@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {
    
    /**
     * Find expense by expenseId
     */
    Optional<Expense> findByExpenseId(String expenseId);
    
    /**
     * Find all expenses for a specific user
     */
    List<Expense> findByUserId(String userId);
    
    /**
     * Find expenses for a user with pagination
     */
    Page<Expense> findByUserId(String userId, Pageable pageable);
    
    /**
     * Find expenses for a user ordered by date descending
     */
    List<Expense> findByUserIdOrderByDateDescTimeDesc(String userId);
    
    /**
     * Find expenses by user and date range
     */
    List<Expense> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Find expenses by user and category
     */
    List<Expense> findByUserIdAndCategory(String userId, String category);
    
    /**
     * Find expenses by user and category with date range
     */
    List<Expense> findByUserIdAndCategoryAndDateBetween(String userId, String category, LocalDate startDate, LocalDate endDate);
    
    /**
     * Find expenses by user and amount range
     */
    List<Expense> findByUserIdAndAmountBetween(String userId, BigDecimal minAmount, BigDecimal maxAmount);
    
    /**
     * Find expenses by payee
     */
    List<Expense> findByUserIdAndPayeeContainingIgnoreCase(String userId, String payee);
    
    /**
     * Count expenses for a user
     */
    long countByUserId(String userId);
    
    /**
     * Count expenses for a user in date range
     */
    long countByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Sum total expenses for a user
     */
    @Query(value = "{'user_id': ?0}", fields = "{'amount': 1}")
    List<Expense> findAmountsByUserId(String userId);
    
    /**
     * Find recent expenses (last N days)
     */
    @Query("{'user_id': ?0, 'date': {$gte: ?1}}")
    List<Expense> findRecentExpenses(String userId, LocalDate since);
    
    /**
     * Find expenses by month and year
     */
    @Query("{'user_id': ?0, 'date': {$gte: ?1, $lt: ?2}}")
    List<Expense> findByUserIdAndMonth(String userId, LocalDate startOfMonth, LocalDate startOfNextMonth);
    
    /**
     * Find top payees by expense count
     */
    @Aggregation(pipeline = {
        "{ '$match': { 'user_id': ?0 } }",
        "{ '$group': { '_id': '$payee', 'count': { '$sum': 1 }, 'total': { '$sum': '$amount' } } }",
        "{ '$sort': { 'total': -1 } }",
        "{ '$limit': ?1 }"
    })
    List<PayeeSummary> findTopPayeesByAmount(String userId, int limit);
    
    /**
     * Find category-wise expense summary
     */
    @Aggregation(pipeline = {
        "{ '$match': { 'user_id': ?0 } }",
        "{ '$group': { '_id': '$category', 'count': { '$sum': 1 }, 'total': { '$sum': '$amount' } } }",
        "{ '$sort': { 'total': -1 } }"
    })
    List<CategoryExpenseSummary> findCategoryWiseSummary(String userId);
    
    /**
     * Find monthly expense trends
     */
    @Aggregation(pipeline = {
        "{ '$match': { 'user_id': ?0 } }",
        "{ '$group': { '_id': { 'year': { '$year': '$date' }, 'month': { '$month': '$date' } }, 'count': { '$sum': 1 }, 'total': { '$sum': '$amount' } } }",
        "{ '$sort': { '_id.year': -1, '_id.month': -1 } }"
    })
    List<MonthlyExpenseSummary> findMonthlyTrends(String userId);
    
    /**
     * Delete all expenses for a user
     */
    void deleteByUserId(String userId);
    
    /**
     * Find expenses by tags
     */
    @Query("{'user_id': ?0, 'tags': {$in: ?1}}")
    List<Expense> findByUserIdAndTagsIn(String userId, List<String> tags);
    
    // Inner classes for aggregation results
    interface PayeeSummary {
        String getId(); // payee name
        Long getCount();
        BigDecimal getTotal();
    }
    
    interface CategoryExpenseSummary {
        String getId(); // category name
        Long getCount();
        BigDecimal getTotal();
    }
    
    interface MonthlyExpenseSummary {
        MonthYear getId();
        Long getCount();
        BigDecimal getTotal();
        
        interface MonthYear {
            Integer getYear();
            Integer getMonth();
        }
    }
}
