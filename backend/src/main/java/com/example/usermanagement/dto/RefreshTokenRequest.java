package com.example.usermanagement.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}