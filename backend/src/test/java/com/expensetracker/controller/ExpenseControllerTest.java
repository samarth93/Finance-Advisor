package com.expensetracker.controller;

import com.expensetracker.TestDataUtil;
import com.expensetracker.dto.ExpenseRequestDto;
import com.expensetracker.model.Expense;
import com.expensetracker.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for ExpenseController
 */
@WebMvcTest(ExpenseController.class)
@ActiveProfiles("test")
public class ExpenseControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private ExpenseService expenseService;
    
    @Test
    public void testCreateExpense_Success() throws Exception {
        // Given
        String userId = TestDataUtil.TEST_USER_ID;
        ExpenseRequestDto request = TestDataUtil.createTestExpenseRequest();
        Expense expectedExpense = TestDataUtil.createTestExpense();
        
        when(expenseService.createExpense(eq(userId), any(ExpenseRequestDto.class)))
                .thenReturn(expectedExpense);
        
        // When & Then
        mockMvc.perform(post("/expenses")
                        .param("userId", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.amount").value(TestDataUtil.TEST_AMOUNT))
                .andExpect(jsonPath("$.category").value(TestDataUtil.TEST_CATEGORY));
        
        verify(expenseService).createExpense(eq(userId), any(ExpenseRequestDto.class));
    }
    
    @Test
    public void testCreateExpense_InvalidData() throws Exception {
        // Given
        String userId = TestDataUtil.TEST_USER_ID;
        ExpenseRequestDto request = ExpenseRequestDto.builder()
                .amount(BigDecimal.valueOf(-100)) // Invalid negative amount
                .category("")
                .date(null)
                .time(null)
                .build();
        
        // When & Then
        mockMvc.perform(post("/expenses")
                        .param("userId", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    public void testGetExpensesByUserId_Success() throws Exception {
        // Given
        String userId = TestDataUtil.TEST_USER_ID;
        List<Expense> expectedExpenses = Arrays.asList(
                TestDataUtil.createTestExpense(),
                TestDataUtil.createTestExpenseWithCustomData(userId, BigDecimal.valueOf(50.0), "Travel", LocalDate.now())
        );
        
        when(expenseService.getExpensesByUserId(userId))
                .thenReturn(expectedExpenses);
        
        // When & Then
        mockMvc.perform(get("/expenses/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userId").value(userId))
                .andExpect(jsonPath("$[1].userId").value(userId));
        
        verify(expenseService).getExpensesByUserId(userId);
    }
    
    @Test
    public void testUpdateExpense_Success() throws Exception {
        // Given
        String expenseId = "test_expense_123";
        ExpenseRequestDto request = TestDataUtil.createTestExpenseRequest();
        request.setAmount(BigDecimal.valueOf(200.0));
        
        Expense updatedExpense = TestDataUtil.createTestExpense();
        updatedExpense.setExpenseId(expenseId);
        updatedExpense.setAmount(BigDecimal.valueOf(200.0));
        
        when(expenseService.updateExpense(eq(expenseId), any(ExpenseRequestDto.class)))
                .thenReturn(updatedExpense);
        
        // When & Then
        mockMvc.perform(put("/expenses/{expenseId}", expenseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expenseId").value(expenseId))
                .andExpect(jsonPath("$.amount").value(200.0));
        
        verify(expenseService).updateExpense(eq(expenseId), any(ExpenseRequestDto.class));
    }
    
    @Test
    public void testDeleteExpense_Success() throws Exception {
        // Given
        String expenseId = "test_expense_123";
        
        // When & Then
        mockMvc.perform(delete("/expenses/{expenseId}", expenseId))
                .andExpect(status().isNoContent());
        
        verify(expenseService).deleteExpense(expenseId);
    }
    
    @Test
    public void testGetExpenseById_Success() throws Exception {
        // Given
        String expenseId = "test_expense_123";
        Expense expectedExpense = TestDataUtil.createTestExpense();
        expectedExpense.setExpenseId(expenseId);
        
        when(expenseService.getExpenseByIdOrThrow(expenseId))
                .thenReturn(expectedExpense);
        
        // When & Then
        mockMvc.perform(get("/expenses/details/{expenseId}", expenseId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expenseId").value(expenseId))
                .andExpect(jsonPath("$.userId").value(TestDataUtil.TEST_USER_ID));
        
        verify(expenseService).getExpenseByIdOrThrow(expenseId);
    }
    
    @Test
    public void testGetExpensesByDateRange_Success() throws Exception {
        // Given
        String userId = TestDataUtil.TEST_USER_ID;
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        
        List<Expense> expectedExpenses = Arrays.asList(TestDataUtil.createTestExpense());
        
        when(expenseService.getExpensesByDateRange(userId, startDate, endDate))
                .thenReturn(expectedExpenses);
        
        // When & Then
        mockMvc.perform(get("/expenses/{userId}/date-range", userId)
                        .param("startDate", startDate.toString())
                        .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
        
        verify(expenseService).getExpensesByDateRange(userId, startDate, endDate);
    }
}
