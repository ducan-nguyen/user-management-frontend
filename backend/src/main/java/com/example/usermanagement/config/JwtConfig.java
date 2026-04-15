package com.example.usermanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {
    
    @Value("${app.jwt.secret}")
    private String secret;
    
    @Value("${app.jwt.expiration}")
    private long expiration;
    
    public String getSecret() { 
        return secret; 
    }
    
    public long getExpiration() { 
        return expiration; 
    }
}