package com.example.usermanagement.service;

import com.example.usermanagement.entity.Permission;
import com.example.usermanagement.entity.Role;
import com.example.usermanagement.entity.User;
import com.example.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PermissionService {
    
    private final UserRepository userRepository;
    
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public boolean hasPermission(Permission permission) {
        User currentUser = getCurrentUser();
        return currentUser.hasPermission(permission);
    }
    
    public void checkPermission(Permission permission) {
        if (!hasPermission(permission)) {
            throw new RuntimeException("Access denied: Missing permission " + permission);
        }
    }
    
    public boolean isAdmin() {
        return getCurrentUser().getRole() == Role.ROLE_ADMIN;
    }
    
    public boolean isManager() {
        return getCurrentUser().getRole() == Role.ROLE_MANAGER;
    }
    
    public boolean isUser() {
        return getCurrentUser().getRole() == Role.ROLE_USER;
    }
}