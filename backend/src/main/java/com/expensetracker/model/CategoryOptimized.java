package com.expensetracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * OPTIMIZED Category entity representing expense categories
 * 
 * REMOVED FIELDS:
 * - categoryId: Redundant with MongoDB's auto-generated _id
 * 
 * SIMPLIFIED FIELDS:
 * - Uses user ID (MongoDB _id) for relationships instead of custom userId
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "categories")
@CompoundIndex(def = "{'user_id': 1, 'name': 1}", unique = true)
public class CategoryOptimized {
    
    @Id
    private String id;
    
    @Field("user_id")
    @NotBlank(message = "User ID cannot be blank")
    @Indexed
    private String userId; // References User._id
    
    @Field("name")
    @NotBlank(message = "Category name cannot be blank")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    private String name;
    
    @Field("description")
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;
    
    @Field("color")
    @Builder.Default
    private String color = "#6366F1"; // Default indigo color
    
    @Field("icon")
    @Builder.Default
    private String icon = "💰"; // Default money emoji
    
    @Field("is_default")
    @Builder.Default
    private Boolean isDefault = false;
    
    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Default categories that should be created for new users
    public static List<CategoryOptimized> getDefaultCategories(String userId) {
        return Arrays.asList(
            CategoryOptimized.builder()
                .userId(userId)
                .name("Food")
                .description("Food and dining expenses")
                .color("#EF4444")
                .icon("🍽️")
                .isDefault(true)
                .build(),
            CategoryOptimized.builder()
                .userId(userId)
                .name("Shopping")
                .description("Shopping and retail purchases")
                .color("#F59E0B")
                .icon("🛒")
                .isDefault(true)
                .build(),
            CategoryOptimized.builder()
                .userId(userId)
                .name("Travel")
                .description("Travel and transportation expenses")
                .color("#10B981")
                .icon("✈️")
                .isDefault(true)
                .build(),
            CategoryOptimized.builder()
                .userId(userId)
                .name("Bills")
                .description("Utility bills and subscriptions")
                .color("#8B5CF6")
                .icon("📄")
                .isDefault(true)
                .build(),
            CategoryOptimized.builder()
                .userId(userId)
                .name("Entertainment")
                .description("Entertainment and leisure activities")
                .color("#EC4899")
                .icon("🎬")
                .isDefault(true)
                .build(),
            CategoryOptimized.builder()
                .userId(userId)
                .name("Others")
                .description("Miscellaneous expenses")
                .color("#6B7280")
                .icon("📦")
                .isDefault(true)
                .build()
        );
    }
    
    // Update timestamp before saving
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}