package com.expensetracker.integration;

import com.expensetracker.TestDataUtil;
import com.expensetracker.dto.CategoryRequestDto;
import com.expensetracker.dto.ExpenseRequestDto;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the complete Expense Tracker application
 */
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureWebMvc
public class ExpenseTrackerIntegrationTest {
    
    @Autowired
    private WebApplicationContext webApplicationContext;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    private MockMvc mockMvc;
    
    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Clean up test data
        expenseRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
    }
    
    @Test
    public void testCompleteExpenseFlow() throws Exception {
        // Step 1: Create a user
        User user = TestDataUtil.createTestUser();
        userRepository.save(user);
        
        // Step 2: Create a category
        Category category = TestDataUtil.createTestCategory();
        categoryRepository.save(category);
        
        // Step 3: Create an expense
        ExpenseRequestDto expenseRequest = TestDataUtil.createTestExpenseRequest();
        expenseRequest.setCategoryId(category.getCategoryId());
        
        String createExpenseResponse = mockMvc.perform(post("/expenses")
                        .param("userId", user.getUserId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(expenseRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(user.getUserId()))
                .andExpect(jsonPath("$.amount").value(TestDataUtil.TEST_AMOUNT))
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        Expense createdExpense = objectMapper.readValue(createExpenseResponse, Expense.class);
        
        // Step 4: Retrieve the expense
        mockMvc.perform(get("/expenses/details/{expenseId}", createdExpense.getExpenseId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expenseId").value(createdExpense.getExpenseId()))
                .andExpect(jsonPath("$.amount").value(TestDataUtil.TEST_AMOUNT));
        
        // Step 5: Update the expense
        expenseRequest.setAmount(BigDecimal.valueOf(150.75));
        expenseRequest.setPayee("Updated Payee");
        
        mockMvc.perform(put("/expenses/{expenseId}", createdExpense.getExpenseId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(expenseRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(150.75))
                .andExpect(jsonPath("$.payee").value("Updated Payee"));
        
        // Step 6: Get all expenses for user
        mockMvc.perform(get("/expenses/{userId}", user.getUserId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
        
        // Step 7: Get expense summary
        mockMvc.perform(get("/expenses/{userId}/summary", user.getUserId())
                        .param("period", "MONTHLY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(user.getUserId()))
                .andExpect(jsonPath("$.totalExpenses").value(1));
        
        // Step 8: Delete the expense
        mockMvc.perform(delete("/expenses/{expenseId}", createdExpense.getExpenseId()))
                .andExpect(status().isNoContent());
        
        // Step 9: Verify deletion
        mockMvc.perform(get("/expenses/{userId}", user.getUserId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
    
    @Test
    public void testCategoryManagement() throws Exception {
        // Step 1: Create a user
        User user = TestDataUtil.createTestUser();
        userRepository.save(user);
        
        // Step 2: Get categories (should be empty initially)
        mockMvc.perform(get("/categories/{userId}", user.getUserId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
        
        // Step 3: Initialize default categories
        mockMvc.perform(post("/categories/{userId}/initialize-defaults", user.getUserId()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(6)); // Should create 6 default categories
        
        // Step 4: Create a custom category
        CategoryRequestDto categoryRequest = TestDataUtil.createTestCategoryRequest();
        
        String createCategoryResponse = mockMvc.perform(post("/categories")
                        .param("userId", user.getUserId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(categoryRequest.getName()))
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        Category createdCategory = objectMapper.readValue(createCategoryResponse, Category.class);
        
        // Step 5: Get all categories (should have 7 now)
        mockMvc.perform(get("/categories/{userId}", user.getUserId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(7));
        
        // Step 6: Update the custom category
        categoryRequest.setName("Updated Test Category");
        categoryRequest.setDescription("Updated description");
        
        mockMvc.perform(put("/categories/{categoryId}", createdCategory.getCategoryId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Test Category"));
        
        // Step 7: Delete the custom category
        mockMvc.perform(delete("/categories/{categoryId}", createdCategory.getCategoryId()))
                .andExpect(status().isNoContent());
        
        // Step 8: Verify deletion (should have 6 categories again)
        mockMvc.perform(get("/categories/{userId}", user.getUserId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(6));
    }
}
