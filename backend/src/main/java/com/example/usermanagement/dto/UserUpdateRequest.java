// dto/UserUpdateRequest.java
package com.example.usermanagement.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String phoneNumber;
    private String address;
    private String role;
}