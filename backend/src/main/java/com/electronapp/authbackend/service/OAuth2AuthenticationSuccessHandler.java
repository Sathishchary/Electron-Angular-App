package com.electronapp.authbackend.service;

import com.electronapp.authbackend.entity.User;
import com.electronapp.authbackend.security.JwtUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

/**
 * OAuth2 Authentication Success Handler
 */
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                      Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user information based on provider
        String registrationId = extractRegistrationId(request);
        String email = null;
        String firstName = null;
        String lastName = null;
        String avatarUrl = null;
        String providerUserId = null;
        
        Map<String, Object> attributes = oauth2User.getAttributes();
        
        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            firstName = (String) attributes.get("given_name");
            lastName = (String) attributes.get("family_name");
            avatarUrl = (String) attributes.get("picture");
            providerUserId = (String) attributes.get("sub");
        } else if ("instagram".equals(registrationId)) {
            // Instagram Basic Display API provides limited user info
            providerUserId = (String) attributes.get("id");
            String username = (String) attributes.get("username");
            // Instagram doesn't provide email in Basic Display API
            email = username + "@instagram.local"; // Placeholder email
            firstName = username;
        }
        
        if (email != null && providerUserId != null) {
            // Create or update user
            User user = userService.createOrUpdateOAuth2User(email, firstName, lastName, 
                                                           avatarUrl, registrationId, providerUserId);
            
            // Generate JWT token
            String token = jwtUtils.generateJwtToken(user.getEmail());
            
            // Redirect to frontend with token
            String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:4200/auth/callback")
                .queryParam("token", token)
                .build().toUriString();
            
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } else {
            // Authentication failed
            getRedirectStrategy().sendRedirect(request, response, "http://localhost:4200/login?error=oauth2_failed");
        }
    }
    
    private String extractRegistrationId(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        if (requestUri.contains("/oauth2/code/")) {
            return requestUri.substring(requestUri.lastIndexOf("/") + 1);
        }
        return null;
    }
}