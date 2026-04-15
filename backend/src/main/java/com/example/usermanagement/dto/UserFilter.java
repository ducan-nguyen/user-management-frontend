package com.example.usermanagement.dto;

import lombok.Data;

@Data
public class UserFilter {
    private String keyword;
    private String role;
    private String status;
    private String fromDate;
    private String toDate;
}