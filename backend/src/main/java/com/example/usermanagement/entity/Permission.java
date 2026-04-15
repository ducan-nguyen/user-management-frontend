package com.example.usermanagement.entity;

public enum Permission {
    // User permissions
    USER_READ,
    USER_CREATE,
    USER_UPDATE,
    USER_DELETE,
    USER_STATUS_TOGGLE,
    
    // Admin permissions
    ROLE_ASSIGN,
    USER_EXPORT,
    USER_IMPORT,
    
    // System permissions
    SYSTEM_CONFIG_READ,
    SYSTEM_CONFIG_UPDATE,
    AUDIT_LOG_READ
}