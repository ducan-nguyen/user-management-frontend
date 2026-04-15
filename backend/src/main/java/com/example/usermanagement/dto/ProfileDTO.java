package com.example.usermanagement.dto;

import lombok.Data;

@Data
public class ProfileDTO {
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String role;
    private String status;
    private String avatarUrl;
    private String createdAt;
}