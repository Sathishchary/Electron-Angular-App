package com.electronapp.authbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * User entity representing authenticated users
 */
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String username;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    
    @Column(name = "password_hash")
    private String passwordHash; // For email/password login
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OAuth2Provider> oauth2Providers;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public User(String email, String username, String firstName, String lastName) {
        this();
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
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
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Set<OAuth2Provider> getOauth2Providers() { return oauth2Providers; }
    public void setOauth2Providers(Set<OAuth2Provider> oauth2Providers) { this.oauth2Providers = oauth2Providers; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Get full name of the user
     */
    public String getFullName() {
        StringBuilder fullName = new StringBuilder();
        if (firstName != null) fullName.append(firstName);
        if (lastName != null) {
            if (fullName.length() > 0) fullName.append(" ");
            fullName.append(lastName);
        }
        return fullName.length() > 0 ? fullName.toString() : username;
    }
}