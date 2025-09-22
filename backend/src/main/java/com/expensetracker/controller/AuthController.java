package com.expensetracker.controller;

import com.expensetracker.dto.AuthRequestDto;
import com.expensetracker.dto.AuthResponseDto;
import com.expensetracker.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * REST Controller for Authentication operations
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Register a new user
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto.AuthResponse> register(
            @Valid @RequestBody AuthRequestDto.RegisterRequest request) {
        
        log.info("Registration request for email: {}", request.getEmail());
        
        try {
            AuthResponseDto.AuthResponse response = authService.register(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Registration failed for email: {}", request.getEmail(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
    
    /**
     * Authenticate user login
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto.AuthResponse> login(
            @Valid @RequestBody AuthRequestDto.LoginRequest request) {
        
        log.info("Login request for email: {}", request.getEmail());
        
        try {
            AuthResponseDto.AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }
    
    /**
     * Validate JWT token
     * POST /api/auth/validate
     */
    @PostMapping("/validate")
    public ResponseEntity<AuthResponseDto.TokenValidationResponse> validateToken(
            @RequestHeader("Authorization") String authorizationHeader) {
        
        try {
            String token = extractTokenFromHeader(authorizationHeader);
            AuthResponseDto.TokenValidationResponse response = authService.validateToken(token);
            
            if (response.getValid()) {
                return ResponseEntity.ok(response);
            } else {
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            log.error("Token validation failed", e);
            AuthResponseDto.TokenValidationResponse response = AuthResponseDto.TokenValidationResponse.builder()
                    .valid(false)
                    .message("Token validation failed")
                    .build();
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
    
    /**
     * Get current user info
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponseDto.UserInfo> getCurrentUser(
            @RequestHeader("Authorization") String authorizationHeader) {
        
        try {
            String token = extractTokenFromHeader(authorizationHeader);
            AuthResponseDto.UserInfo userInfo = authService.getUserInfo(token);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            log.error("Failed to get current user info", e);
            throw new RuntimeException("Failed to get user information: " + e.getMessage());
        }
    }
    
    /**
     * Change password
     * POST /api/auth/change-password
     */
    @PostMapping("/change-password")
    public ResponseEntity<AuthResponseDto.MessageResponse> changePassword(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody AuthRequestDto.ChangePasswordRequest request) {
        
        try {
            String token = extractTokenFromHeader(authorizationHeader);
            // Extract user ID from token
            String userId = authService.getUserInfo(token).getUserId();
            
            AuthResponseDto.MessageResponse response = authService.changePassword(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Password change failed", e);
            throw new RuntimeException("Password change failed: " + e.getMessage());
        }
    }
    
    /**
     * Logout (client-side token removal)
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponseDto.MessageResponse> logout() {
        // JWT tokens are stateless, so logout is handled client-side by removing the token
        // This endpoint is provided for consistency and potential future server-side token blacklisting
        
        AuthResponseDto.MessageResponse response = AuthResponseDto.MessageResponse.builder()
                .message("Logout successful")
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Extract token from Authorization header
     */
    private String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        return authorizationHeader.substring(7);
    }
}