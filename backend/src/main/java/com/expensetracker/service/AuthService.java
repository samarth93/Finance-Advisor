package com.expensetracker.service;

import com.expensetracker.dto.AuthRequestDto;
import com.expensetracker.dto.AuthResponseDto;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Authentication service for handling user registration, login, and token management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    /**
     * Register a new user
     */
    @Transactional
    public AuthResponseDto.AuthResponse register(AuthRequestDto.RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        
        // Generate unique user ID from email
        String userId = generateUniqueUserId(request.getEmail());
        
        // Create new user
        User user = User.builder()
                .userId(userId)
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .isActive(true)
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // Save user
        User savedUser = userRepository.save(user);
        
        // Initialize default categories for the new user
        try {
            categoryService.createDefaultCategories(userId);
            log.info("Default categories initialized for user: {}", userId);
        } catch (Exception e) {
            log.warn("Failed to initialize default categories for user: {}, error: {}", userId, e.getMessage());
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(savedUser.getUserId(), savedUser.getEmail(), savedUser.getRole());
        
        log.info("User registered successfully: {}", userId);
        
        return AuthResponseDto.AuthResponse.builder()
                .token(token)
                .expiresIn(jwtService.getExpirationTime())
                .user(mapToUserInfo(savedUser))
                .message("User registered successfully")
                .build();
    }
    
    /**
     * Authenticate user login
     */
    @Transactional
    public AuthResponseDto.AuthResponse login(AuthRequestDto.LoginRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());
        
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Check if account is active
        if (!user.isAccountValid()) {
            throw new RuntimeException("Account is inactive");
        }
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Update last login
        user.updateLastLogin();
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUserId(), user.getEmail(), user.getRole());
        
        log.info("User authenticated successfully: {}", user.getUserId());
        
        return AuthResponseDto.AuthResponse.builder()
                .token(token)
                .expiresIn(jwtService.getExpirationTime())
                .user(mapToUserInfo(user))
                .message("Login successful")
                .build();
    }
    
    /**
     * Change user password
     */
    @Transactional
    public AuthResponseDto.MessageResponse changePassword(String userId, AuthRequestDto.ChangePasswordRequest request) {
        log.info("Changing password for user: {}", userId);
        
        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }
        
        // Find user
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.updateTimestamp();
        userRepository.save(user);
        
        log.info("Password changed successfully for user: {}", userId);
        
        return AuthResponseDto.MessageResponse.builder()
                .message("Password changed successfully")
                .build();
    }
    
    /**
     * Validate JWT token and return user info
     */
    public AuthResponseDto.TokenValidationResponse validateToken(String token) {
        try {
            if (!jwtService.validateToken(token)) {
                return AuthResponseDto.TokenValidationResponse.builder()
                        .valid(false)
                        .message("Invalid or expired token")
                        .build();
            }
            
            String userId = jwtService.extractUserId(token);
            Optional<User> userOpt = userRepository.findByUserId(userId);
            
            if (userOpt.isEmpty() || !userOpt.get().isAccountValid()) {
                return AuthResponseDto.TokenValidationResponse.builder()
                        .valid(false)
                        .message("User not found or account inactive")
                        .build();
            }
            
            return AuthResponseDto.TokenValidationResponse.builder()
                    .valid(true)
                    .message("Token is valid")
                    .user(mapToUserInfo(userOpt.get()))
                    .build();
                    
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage());
            return AuthResponseDto.TokenValidationResponse.builder()
                    .valid(false)
                    .message("Token validation failed")
                    .build();
        }
    }
    
    /**
     * Get user info by token
     */
    public AuthResponseDto.UserInfo getUserInfo(String token) {
        String userId = jwtService.extractUserId(token);
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return mapToUserInfo(user);
    }
    
    /**
     * Generate unique user ID from email
     */
    private String generateUniqueUserId(String email) {
        String baseUserId = User.generateUserIdFromEmail(email);
        String userId = baseUserId;
        int counter = 1;
        
        // Ensure uniqueness
        while (userRepository.findByUserId(userId).isPresent()) {
            userId = baseUserId + counter;
            counter++;
        }
        
        return userId;
    }
    
    /**
     * Map User entity to UserInfo DTO
     */
    private AuthResponseDto.UserInfo mapToUserInfo(User user) {
        return AuthResponseDto.UserInfo.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .emailVerified(user.getEmailVerified())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}