package com.example.usermanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Data
@NoArgsConstructor
public class RefreshToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private LocalDateTime expiryDate;
    
    @Column(nullable = false)
    private boolean revoked = false;
    
    // THÊM CONSTRUCTOR NÀY
    public RefreshToken(String token, String username, LocalDateTime expiryDate) {
        this.token = token;
        this.username = username;
        this.expiryDate = expiryDate;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}