package com.example.usermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String role;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}