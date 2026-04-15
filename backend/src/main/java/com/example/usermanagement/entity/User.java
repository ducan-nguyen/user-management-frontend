package com.example.usermanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String fullName;
    private String phoneNumber;
    private String address;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Trả về cả role và permissions
        Collection<SimpleGrantedAuthority> authorities = 
            role.getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(Collectors.toList());
        
        authorities.add(new SimpleGrantedAuthority(role.name()));
        
        return authorities;
    }
    
    public boolean hasPermission(Permission permission) {
        return role.hasPermission(permission);
    }
    
    @Override
    public boolean isAccountNonExpired() { return true; }
    
    @Override
    public boolean isAccountNonLocked() { return status != UserStatus.LOCKED; }
    
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    
    @Override
    public boolean isEnabled() { return status == UserStatus.ACTIVE; }
}