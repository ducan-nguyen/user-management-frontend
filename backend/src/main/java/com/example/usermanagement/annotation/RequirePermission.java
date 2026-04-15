package com.example.usermanagement.annotation;

import com.example.usermanagement.entity.Permission;
import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    Permission[] value();
}