package com.example.usermanagement.controller;

import com.example.usermanagement.annotation.RequirePermission;
import com.example.usermanagement.dto.*;
import com.example.usermanagement.entity.Permission;
import com.example.usermanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Admin và Manager đều có thể xem users
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            Pageable pageable,
            @ModelAttribute UserFilter filter
    ) {
        return ResponseEntity.ok(
            userService.findAllUsers(pageable, filter)
        );
    }

    // Admin và Manager đều có thể xem chi tiết user
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Chỉ Admin mới được tạo user
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserRequest request) {
        return new ResponseEntity<>(userService.createUser(request), HttpStatus.CREATED);
    }

    // Admin và Manager đều có thể update, nhưng Manager chỉ update được user thường
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // Chỉ Admin mới được xóa user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Admin và Manager đều có thể toggle status, nhưng Manager chỉ toggle được user thường
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(userService.updateStatus(id, status));
    }

    // Chỉ Admin mới có thể xuất dữ liệu
    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    @RequirePermission(Permission.USER_EXPORT)
    public ResponseEntity<?> exportUsers() {
        List<UserDTO> users = userService.getAllUsers();
        // Implement export logic
        return ResponseEntity.ok(users);
    }
}