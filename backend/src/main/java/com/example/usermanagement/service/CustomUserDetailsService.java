package com.example.usermanagement.service;

import com.example.usermanagement.entity.User;
import com.example.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("========== LOADING USER: " + username + " ==========");
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> {
                System.err.println("User not found: " + username);
                return new UsernameNotFoundException("User not found: " + username);
            });
        
        System.out.println("User found: " + user.getUsername());
        System.out.println("User role: " + user.getRole());
        System.out.println("User status: " + user.getStatus());
        System.out.println("Password length: " + user.getPassword().length());
        System.out.println("================================================");
        
        return user;
    }
}