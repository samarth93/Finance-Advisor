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
 * User entity representing a user in the expense tracker system
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Field("user_id")
    @NotBlank(message = "User ID cannot be blank")
    @Size(min = 3, max = 50, message = "User ID must be between 3 and 50 characters")
    @Indexed(unique = true)
    private String userId;
    
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
    
    @Field("role")
    @Builder.Default
    private String role = "USER";
    
    @Field("email_verified")
    @Builder.Default
    private Boolean emailVerified = false;
    
    @Field("last_login")
    private LocalDateTime lastLogin;
    
    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Field("is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    // Helper method to generate user ID from email
    public static String generateUserIdFromEmail(String email) {
        return email.split("@")[0].toLowerCase();
    }
    
    // Update timestamp before saving
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Update last login timestamp
    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Check if user account is valid for authentication
    public boolean isAccountValid() {
        return this.isActive != null && this.isActive;
    }
}
