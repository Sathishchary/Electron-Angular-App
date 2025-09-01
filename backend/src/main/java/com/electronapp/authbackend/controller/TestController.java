package com.electronapp.authbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Test controller for basic API testing
 */
@RestController
@RequestMapping("/test")
public class TestController {
    
    @GetMapping("/public")
    public Map<String, String> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Public endpoint accessible");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }
    
    @GetMapping("/protected")
    public Map<String, String> protectedEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Protected endpoint accessible - user is authenticated");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }
}