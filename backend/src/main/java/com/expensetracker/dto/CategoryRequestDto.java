package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for category creation and update requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequestDto {
    
    @NotBlank(message = "Category name cannot be blank")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    private String name;
    
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;
    
    @Builder.Default
    private String color = "#6366F1"; // Default indigo color
    
    @Builder.Default
    private String icon = "💰"; // Default money emoji
}
