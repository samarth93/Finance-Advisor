package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

/**
 * DTOs for authentication requests
 */
public class AuthRequestDto {
    
    /**
     * Login request DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        private String email;
        
        @NotBlank(message = "Password cannot be blank")
        private String password;
    }
    
    /**
     * Registration request DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        private String name;
        
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        private String email;
        
        @NotBlank(message = "Password cannot be blank")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
            message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character"
        )
        private String password;
        
        @NotBlank(message = "Confirm password cannot be blank")
        private String confirmPassword;
    }
    
    /**
     * Change password request DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        
        @NotBlank(message = "Current password cannot be blank")
        private String currentPassword;
        
        @NotBlank(message = "New password cannot be blank")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
            message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character"
        )
        private String newPassword;
        
        @NotBlank(message = "Confirm password cannot be blank")
        private String confirmPassword;
    }
}