package com.example.usermanagement.controller;

import com.example.usermanagement.dto.*;
import com.example.usermanagement.entity.RefreshToken;
import com.example.usermanagement.entity.User;
import com.example.usermanagement.exception.ErrorResponse;
import com.example.usermanagement.security.JwtTokenProvider;
import com.example.usermanagement.service.CustomUserDetailsService;
import com.example.usermanagement.service.RefreshTokenService;
import com.example.usermanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

	private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService customUserDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByUsername(userDetails.getUsername());
        
        // Tạo refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken.getToken());
        response.put("tokenType", "Bearer");
        response.put("expiresIn", tokenProvider.getExpiration());
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().toString());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            System.out.println("=== REFRESH TOKEN REQUEST ===");
            System.out.println("Refresh token: " + request.getRefreshToken());
            
            // Xác thực refresh token
            RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());
            System.out.println("Refresh token is valid for user: " + refreshToken.getUsername());

            // Load user details
            UserDetails userDetails = customUserDetailsService
                    .loadUserByUsername(refreshToken.getUsername());

            // Tạo authentication mới
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );

            // Tạo access token mới
            String newAccessToken = tokenProvider.generateToken(authentication);
            System.out.println("New access token generated");

            // Tạo refresh token mới (token rotation)
            RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(refreshToken.getUsername());
            System.out.println("New refresh token created");

            // Revoke token cũ - KHÔNG THROW EXCEPTION
            try {
                refreshTokenService.revokeToken(request.getRefreshToken());
                System.out.println("Old refresh token revoked");
            } catch (Exception e) {
                // Chỉ log, không throw - token cũ có thể đã bị revoke
                System.out.println("Could not revoke old token: " + e.getMessage());
            }

            return ResponseEntity.ok(
                    new RefreshTokenResponse(newAccessToken, newRefreshToken.getToken())
            );
            
        } catch (Exception e) {
            System.err.println("Refresh token error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
            	    .status(HttpStatus.UNAUTHORIZED)
            	    .body(new ErrorResponse(
            	        HttpStatus.UNAUTHORIZED.value(),
            	        "Unauthorized",
            	        "Invalid refresh token: " + e.getMessage()
            	    ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorization) {
        String token = authorization.substring(7);
        String username = tokenProvider.getUsernameFromToken(token);
        
        // Revoke all refresh tokens của user
        refreshTokenService.revokeAllUserTokens(username);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}