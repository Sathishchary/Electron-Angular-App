package com.electronapp.authbackend.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * User Data Transfer Object for API responses
 */
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String fullName;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private List<OAuth2ProviderDTO> oauth2Providers;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(Long id, String email, String username, String firstName, String lastName, String avatarUrl, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
        this.fullName = buildFullName(firstName, lastName, username);
    }
    
    private String buildFullName(String firstName, String lastName, String username) {
        StringBuilder fullName = new StringBuilder();
        if (firstName != null) fullName.append(firstName);
        if (lastName != null) {
            if (fullName.length() > 0) fullName.append(" ");
            fullName.append(lastName);
        }
        return fullName.length() > 0 ? fullName.toString() : username;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<OAuth2ProviderDTO> getOauth2Providers() { return oauth2Providers; }
    public void setOauth2Providers(List<OAuth2ProviderDTO> oauth2Providers) { this.oauth2Providers = oauth2Providers; }
}