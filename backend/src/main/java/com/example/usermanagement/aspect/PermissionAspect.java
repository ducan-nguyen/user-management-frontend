package com.example.usermanagement.aspect;

import com.example.usermanagement.annotation.RequirePermission;
import com.example.usermanagement.entity.Permission;
import com.example.usermanagement.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class PermissionAspect {
    
    private final PermissionService permissionService;
    
    @Before("@annotation(requirePermission)")
    public void checkPermission(RequirePermission requirePermission) {
        for (Permission permission : requirePermission.value()) {
            permissionService.checkPermission(permission);
        }
    }
}