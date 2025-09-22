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
 * Category entity representing expense categories
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "categories")
@CompoundIndex(def = "{'user_id': 1, 'name': 1}", unique = true)
public class Category {
    
    @Id
    private String id;
    
    @Field("category_id")
    @NotBlank(message = "Category ID cannot be blank")
    @Indexed
    private String categoryId;
    
    @Field("user_id")
    @NotBlank(message = "User ID cannot be blank")
    @Indexed
    private String userId;
    
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
    public static List<Category> getDefaultCategories(String userId) {
        return Arrays.asList(
            Category.builder()
                .categoryId(generateCategoryId(userId, "Food"))
                .userId(userId)
                .name("Food")
                .description("Food and dining expenses")
                .color("#EF4444")
                .icon("🍽️")
                .isDefault(true)
                .build(),
            Category.builder()
                .categoryId(generateCategoryId(userId, "Shopping"))
                .userId(userId)
                .name("Shopping")
                .description("Shopping and retail purchases")
                .color("#F59E0B")
                .icon("🛒")
                .isDefault(true)
                .build(),
            Category.builder()
                .categoryId(generateCategoryId(userId, "Travel"))
                .userId(userId)
                .name("Travel")
                .description("Travel and transportation expenses")
                .color("#10B981")
                .icon("✈️")
                .isDefault(true)
                .build(),
            Category.builder()
                .categoryId(generateCategoryId(userId, "Bills"))
                .userId(userId)
                .name("Bills")
                .description("Utility bills and subscriptions")
                .color("#8B5CF6")
                .icon("📄")
                .isDefault(true)
                .build(),
            Category.builder()
                .categoryId(generateCategoryId(userId, "Entertainment"))
                .userId(userId)
                .name("Entertainment")
                .description("Entertainment and leisure activities")
                .color("#EC4899")
                .icon("🎬")
                .isDefault(true)
                .build(),
            Category.builder()
                .categoryId(generateCategoryId(userId, "Others"))
                .userId(userId)
                .name("Others")
                .description("Miscellaneous expenses")
                .color("#6B7280")
                .icon("📦")
                .isDefault(true)
                .build()
        );
    }
    
    public static String generateCategoryId(String userId, String categoryName) {
        return userId + "_" + categoryName.toLowerCase().replaceAll("\\s+", "_");
    }
    
    // Update timestamp before saving
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
