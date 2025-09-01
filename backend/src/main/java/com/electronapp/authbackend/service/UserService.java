package com.electronapp.authbackend.service;

import com.electronapp.authbackend.dto.OAuth2ProviderDTO;
import com.electronapp.authbackend.dto.UserDTO;
import com.electronapp.authbackend.entity.OAuth2Provider;
import com.electronapp.authbackend.entity.User;
import com.electronapp.authbackend.repository.OAuth2ProviderRepository;
import com.electronapp.authbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for user management operations
 */
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OAuth2ProviderRepository oauth2ProviderRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Create or update user from OAuth2 authentication
     */
    public User createOrUpdateOAuth2User(String email, String firstName, String lastName, 
                                       String avatarUrl, String providerName, String providerUserId) {
        // Check if user already exists with this OAuth2 provider
        Optional<OAuth2Provider> existingProvider = oauth2ProviderRepository
            .findByProviderNameAndProviderUserId(providerName, providerUserId);
        
        if (existingProvider.isPresent()) {
            // User already exists, return existing user
            return existingProvider.get().getUser();
        }
        
        // Check if user exists by email
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        
        if (existingUser.isPresent()) {
            // User exists, link new OAuth2 provider
            user = existingUser.get();
        } else {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setAvatarUrl(avatarUrl);
            
            // Generate username from email if not provided
            if (user.getUsername() == null) {
                String username = email.split("@")[0];
                user.setUsername(makeUsernameUnique(username));
            }
            
            user = userRepository.save(user);
        }
        
        // Create OAuth2 provider link
        OAuth2Provider oauth2Provider = new OAuth2Provider(user, providerName, providerUserId);
        oauth2ProviderRepository.save(oauth2Provider);
        
        return user;
    }
    
    /**
     * Convert User entity to UserDTO
     */
    public UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getFirstName(),
            user.getLastName(),
            user.getAvatarUrl(),
            user.getCreatedAt()
        );
        
        // Add OAuth2 providers
        if (user.getOauth2Providers() != null) {
            List<OAuth2ProviderDTO> providerDTOs = user.getOauth2Providers().stream()
                .map(provider -> new OAuth2ProviderDTO(provider.getProviderName(), provider.getProviderUserId()))
                .collect(Collectors.toList());
            userDTO.setOauth2Providers(providerDTOs);
        }
        
        return userDTO;
    }
    
    /**
     * Make username unique by appending numbers if necessary
     */
    private String makeUsernameUnique(String baseUsername) {
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }
    
    /**
     * Disconnect OAuth2 provider from user
     */
    public boolean disconnectOAuth2Provider(String userEmail, String providerName) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        Optional<OAuth2Provider> providerOpt = oauth2ProviderRepository.findByUserAndProviderName(user, providerName);
        
        if (providerOpt.isPresent()) {
            oauth2ProviderRepository.delete(providerOpt.get());
            return true;
        }
        
        return false;
    }
}