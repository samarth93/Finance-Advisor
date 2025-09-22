package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTOs for authentication responses
 */
public class AuthResponseDto {
    
    /**
     * Login/Register response DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        
        private String token;
        
        @Builder.Default
        private String tokenType = "Bearer";
        
        private Long expiresIn; // seconds
        private UserInfo user;
        private String message;
    }
    
    /**
     * User information DTO for responses
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        
        private String userId;
        private String name;
        private String email;
        private String role;
        private Boolean emailVerified;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
    }
    
    /**
     * Token validation response DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TokenValidationResponse {
        
        private Boolean valid;
        private String message;
        private UserInfo user;
    }
    
    /**
     * Simple success response DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageResponse {
        
        private String message;
        
        @Builder.Default
        private Boolean success = true;
    }
}