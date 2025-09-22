package com.expensetracker.config;

import com.expensetracker.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT Authentication Filter to process JWT tokens from requests
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        String userId = null;
        String jwt = null;
        
        // Extract JWT from Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                userId = jwtService.extractUserId(jwt);
            } catch (Exception e) {
                log.warn("JWT token extraction failed: {}", e.getMessage());
            }
        }
        
        // Validate token and set authentication
        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtService.validateToken(jwt)) {
                    String role = jwtService.extractRole(jwt);
                    String email = jwtService.extractEmail(jwt);
                    
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                    
                    // Set additional details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    // Add user info to request attributes for easy access
                    request.setAttribute("userId", userId);
                    request.setAttribute("userEmail", email);
                    request.setAttribute("userRole", role);
                    
                    log.debug("JWT authentication successful for user: {}", userId);
                }
            } catch (Exception e) {
                log.warn("JWT validation failed for user {}: {}", userId, e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // Skip JWT filter for auth endpoints
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/actuator/") ||
               path.equals("/api/auth") ||
               "OPTIONS".equals(request.getMethod());
    }
}