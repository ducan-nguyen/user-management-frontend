package com.example.usermanagement.service;

import com.example.usermanagement.entity.RefreshToken;
import com.example.usermanagement.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    
    private final RefreshTokenRepository refreshTokenRepository;
    
    @Value("${app.jwt.refresh-expiration:604800000}") // Mặc định 7 ngày
    private long refreshExpiration; // milliseconds
    
    @Transactional
    public RefreshToken createRefreshToken(String username) {
        // Xóa token cũ nếu có
        refreshTokenRepository.deleteByUsername(username);
        
        String token = UUID.randomUUID().toString();
        
        // Chuyển milliseconds thành seconds cho plusSeconds
        long expirySeconds = refreshExpiration / 1000;
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(expirySeconds);
        
        RefreshToken refreshToken = new RefreshToken(token, username, expiryDate);
        return refreshTokenRepository.save(refreshToken);
    }
    
    @Transactional
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        
        if (refreshToken.isRevoked()) {
            throw new RuntimeException("Refresh token has been revoked");
        }
        
        if (refreshToken.isExpired()) {
            throw new RuntimeException("Refresh token has expired");
        }
        
        return refreshToken;
    }
    
    @Transactional
    public void revokeToken(String token) {
        // SỬA: Không throw exception nếu token không tồn tại
        refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            System.out.println("Revoked refresh token: " + token);
        });
    }
    
    @Transactional
    public void revokeAllUserTokens(String username) {
        refreshTokenRepository.deleteByUsername(username);
        System.out.println("Revoked all tokens for user: " + username);
    }
    
    // Thêm method mới để kiểm tra token hợp lệ (không throw exception)
    @Transactional(readOnly = true)
    public boolean isValidToken(String token) {
        return refreshTokenRepository.findByToken(token)
            .map(rt -> !rt.isRevoked() && !rt.isExpired())
            .orElse(false);
    }
}