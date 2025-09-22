package com.expensetracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * OPTIMIZED User entity representing a user in the expense tracker system
 * 
 * REMOVED FIELDS:
 * - userId: Redundant with MongoDB's auto-generated _id
 * - emailVerified: Not implemented, can be added when email verification is built
 * - lastLogin: Not being tracked, can be added when login tracking is implemented
 * - role: Only USER role exists, can be added when role system is needed
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class UserOptimized {
    
    @Id
    private String id;
    
    @Field("name")
    @NotBlank(message = "Name cannot be blank")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @Field("email")
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)
    private String email;
    
    @Field("password")
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;
    
    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Field("is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    // Update timestamp before saving
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Check if user account is valid for authentication
    public boolean isAccountValid() {
        return this.isActive != null && this.isActive;
    }
    
    // Generate user identifier from email for relationships
    public String getUserIdentifier() {
        return this.email.split("@")[0].toLowerCase();
    }
}