package com.example.usermanagement.repository;

import com.example.usermanagement.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);
    
    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);
    
    void deleteByUsername(String username);
    
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < CURRENT_TIMESTAMP")
    void deleteExpiredTokens();
    
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.token = :token")
    void revokeByToken(String token);
}