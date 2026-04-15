package com.example.usermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    
    public RefreshTokenResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = "Bearer";
    }
}