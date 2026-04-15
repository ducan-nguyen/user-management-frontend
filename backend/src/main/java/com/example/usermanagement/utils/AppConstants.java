package com.example.usermanagement.utils;

public class AppConstants {
    // API Endpoints
    public static final String API_BASE = "/api";
    public static final String API_AUTH = API_BASE + "/auth";
    public static final String API_USERS = API_BASE + "/users";
    
    // Roles
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_MANAGER = "ROLE_MANAGER";
    
    // Status
    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_INACTIVE = "INACTIVE";
    public static final String STATUS_LOCKED = "LOCKED";
    
    // Validation
    public static final int MIN_PASSWORD_LENGTH = 6;
    public static final int MAX_PASSWORD_LENGTH = 20;
    public static final int MIN_USERNAME_LENGTH = 3;
    public static final int MAX_USERNAME_LENGTH = 50;
    
    // Pagination
    public static final String DEFAULT_PAGE = "0";
    public static final String DEFAULT_SIZE = "10";
    public static final String DEFAULT_SORT = "id";
}