package com.electronapp.authbackend.dto;

/**
 * OAuth2 Provider Data Transfer Object for API responses
 */
public class OAuth2ProviderDTO {
    private String providerName;
    private String providerUserId;
    
    public OAuth2ProviderDTO() {}
    
    public OAuth2ProviderDTO(String providerName, String providerUserId) {
        this.providerName = providerName;
        this.providerUserId = providerUserId;
    }
    
    // Getters and Setters
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    
    public String getProviderUserId() { return providerUserId; }
    public void setProviderUserId(String providerUserId) { this.providerUserId = providerUserId; }
}