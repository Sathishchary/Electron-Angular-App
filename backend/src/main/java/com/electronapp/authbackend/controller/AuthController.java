package com.electronapp.authbackend.controller;

import com.electronapp.authbackend.dto.AuthResponse;
import com.electronapp.authbackend.dto.LoginRequest;
import com.electronapp.authbackend.dto.UserDTO;
import com.electronapp.authbackend.entity.User;
import com.electronapp.authbackend.security.JwtUtils;
import com.electronapp.authbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Authentication Controller for login and registration
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Login with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not found!"));
            }
            
            User user = userOpt.get();
            
            // For now, we'll allow login without password validation since OAuth2 users might not have passwords
            // In a real application, you'd want to check if the user has a password set
            if (user.getPasswordHash() != null && 
                !passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid credentials!"));
            }
            
            String jwt = jwtUtils.generateJwtToken(user.getEmail());
            UserDTO userDTO = userService.convertToUserDTO(user);
            
            return ResponseEntity.ok(new AuthResponse(jwt, userDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String email = jwtUtils.getEmailFromJwtToken(token);
            
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not found!"));
            }
            
            UserDTO userDTO = userService.convertToUserDTO(userOpt.get());
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Disconnect OAuth2 provider
     */
    @DeleteMapping("/oauth2/{provider}")
    public ResponseEntity<?> disconnectOAuth2Provider(
            @PathVariable String provider,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtils.getEmailFromJwtToken(token);
            
            boolean success = userService.disconnectOAuth2Provider(email, provider);
            
            if (success) {
                return ResponseEntity.ok(new MessageResponse("OAuth2 provider disconnected successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Provider not found or already disconnected"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Simple message response class
     */
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}