package com.example.usermanagement.entity;

import java.util.Set;

public enum Role {
    ROLE_ADMIN(Set.of(
        Permission.USER_READ,
        Permission.USER_CREATE,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.USER_STATUS_TOGGLE,
        Permission.ROLE_ASSIGN,
        Permission.USER_EXPORT,
        Permission.USER_IMPORT,
        Permission.SYSTEM_CONFIG_READ,
        Permission.SYSTEM_CONFIG_UPDATE,
        Permission.AUDIT_LOG_READ
    )),
    
    ROLE_MANAGER(Set.of(
        Permission.USER_READ,
        Permission.USER_CREATE,
        Permission.USER_UPDATE,
        Permission.USER_STATUS_TOGGLE,
        Permission.USER_EXPORT
    )),
    
    ROLE_USER(Set.of(
        Permission.USER_READ
    ));
    
    private final Set<Permission> permissions;
    
    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }
    
    public Set<Permission> getPermissions() {
        return permissions;
    }
    
    public boolean hasPermission(Permission permission) {
        return permissions.contains(permission);
    }
}