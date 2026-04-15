package com.example.usermanagement.service;

import com.example.usermanagement.dto.UserRequest;
import com.example.usermanagement.dto.UserDTO;
import com.example.usermanagement.dto.UserFilter;
import com.example.usermanagement.dto.ProfileDTO;
import com.example.usermanagement.dto.UserStatisticsDTO;
import com.example.usermanagement.dto.UserUpdateRequest;
import com.example.usermanagement.entity.User;
import com.example.usermanagement.entity.Role;
import com.example.usermanagement.entity.UserStatus;
import com.example.usermanagement.exception.UserAlreadyExistsException;
import com.example.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO createUser(UserRequest request) {        
        try {
            // Kiểm tra username đã tồn tại chưa
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
            }
            
            // Kiểm tra email đã tồn tại chưa
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFullName(request.getFullName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setAddress(request.getAddress());
            
            // Set role
            if (request.getRole() != null && !request.getRole().isEmpty()) {
                try {
                    user.setRole(Role.valueOf(request.getRole()));
                } catch (IllegalArgumentException e) {
                    user.setRole(Role.ROLE_USER);
                }
            } else {
                user.setRole(Role.ROLE_USER);
            }
            
            user.setStatus(UserStatus.ACTIVE);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());
            
            return convertToDTO(savedUser);
            
        } catch (UserAlreadyExistsException e) {
            System.err.println("User already exists: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error creating user: " + e.getMessage());
        }
    }
    
    // Tìm user theo username
    public User findByUsername(String username) {
        System.out.println("========== UserService.findByUsername ==========");
        System.out.println("Searching for username: " + username);
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> {
                System.err.println("User not found in repository: " + username);
                return new RuntimeException("User not found: " + username);
            });
        
        System.out.println("Found user: " + user.getUsername());
        System.out.println("User role: " + user.getRole());
        System.out.println("================================================");
        
        return user;
    }
    
    // Lấy tất cả users với phân trang và filter
    @Transactional(readOnly = true)
    public Page<UserDTO> findAllUsers(Pageable pageable, UserFilter filter) {
        System.out.println("Finding all users with filter");
        
        Page<User> usersPage = userRepository.findAll(pageable);
        
        return usersPage.map(this::convertToDTO);
    }
    
    // Lấy tất cả users (không phân trang)
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        System.out.println("Getting all users");
        
        return userRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Tìm user theo ID
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        System.out.println("Finding user by ID: " + id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        return convertToDTO(user);
    }
    
    // Cập nhật user
    @Transactional
    public UserDTO updateUser(Long id, UserUpdateRequest request) {
        System.out.println("Updating user with ID: " + id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Chỉ update các field được phép
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(Role.valueOf(request.getRole()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + request.getRole());
            }
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        System.out.println("User updated successfully");
        
        return convertToDTO(updatedUser);
    }
    
    // Xóa user
    @Transactional
    public void deleteUser(Long id) {
        System.out.println("Deleting user with ID: " + id);
        
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        
        userRepository.deleteById(id);
        System.out.println("User deleted successfully");
    }
    
    // Cập nhật status
    @Transactional
    public UserDTO updateStatus(Long id, String status) {
        System.out.println("Updating status for user ID: " + id + " to: " + status);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Chuyển đổi String status thành Enum
        try {
            UserStatus newStatus = UserStatus.valueOf(status);
            user.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status + ". Allowed values: ACTIVE, INACTIVE, LOCKED");
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        System.out.println("Status updated successfully to: " + updatedUser.getStatus());
        
        return convertToDTO(updatedUser);
    }
    
    // Tìm kiếm users
    @Transactional(readOnly = true)
    public List<UserDTO> searchUsers(String keyword) {
        System.out.println("Searching users with keyword: " + keyword);
        
        return userRepository.search(keyword).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Lấy profile của user hiện tại
    @Transactional(readOnly = true)
    public ProfileDTO getProfile(String username) {
        System.out.println("Getting profile for username: " + username);
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setUsername(user.getUsername());
        profileDTO.setEmail(user.getEmail());
        profileDTO.setFullName(user.getFullName());
        profileDTO.setPhoneNumber(user.getPhoneNumber());
        profileDTO.setAddress(user.getAddress());
        profileDTO.setRole(user.getRole() != null ? user.getRole().toString() : null);
        profileDTO.setStatus(user.getStatus() != null ? user.getStatus().toString() : null);
        profileDTO.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        
        return profileDTO;
    }
    
    // Cập nhật profile
    @Transactional
    public String updateProfile(String username, ProfileDTO profileDTO, MultipartFile avatar) {
        System.out.println("Updating profile for username: " + username);
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        // Cập nhật thông tin
        if (profileDTO.getFullName() != null) {
            user.setFullName(profileDTO.getFullName());
        }
        if (profileDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(profileDTO.getPhoneNumber());
        }
        if (profileDTO.getAddress() != null) {
            user.setAddress(profileDTO.getAddress());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Xử lý upload avatar nếu có
        String avatarUrl = null;
        if (avatar != null && !avatar.isEmpty()) {
            // Implement logic upload avatar
            avatarUrl = "/uploads/" + username + "_" + avatar.getOriginalFilename();
            System.out.println("Avatar would be saved to: " + avatarUrl);
        }
        
        return avatarUrl != null ? avatarUrl : "Profile updated without avatar";
    }
    
    // Kiểm tra email đã tồn tại chưa
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Kiểm tra username đã tồn tại chưa
    public boolean isUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }
    
    // Lấy user theo username
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return convertToDTO(user);
    }
    
    // Lấy users theo role
    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByRole(String role) {
        System.out.println("Getting users by role: " + role);
        
        try {
            Role roleEnum = Role.valueOf(role);
            return userRepository.findByRole(roleEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
    }
    
    // Thống kê users
    @Transactional(readOnly = true)
    public UserStatisticsDTO getUserStatistics() {
        System.out.println("Getting user statistics");
        
        List<User> allUsers = userRepository.findAll();
        
        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream().filter(u -> u.getStatus() == UserStatus.ACTIVE).count();
        long inactiveUsers = allUsers.stream().filter(u -> u.getStatus() == UserStatus.INACTIVE).count();
        long lockedUsers = allUsers.stream().filter(u -> u.getStatus() == UserStatus.LOCKED).count();
        
        // Thống kê theo role
        Map<String, Long> usersByRole = new HashMap<>();
        for (Role role : Role.values()) {
            long count = allUsers.stream().filter(u -> u.getRole() == role).count();
            usersByRole.put(role.toString(), count);
        }
        
        // Thống kê theo status
        Map<String, Long> usersByStatus = new HashMap<>();
        usersByStatus.put("ACTIVE", activeUsers);
        usersByStatus.put("INACTIVE", inactiveUsers);
        usersByStatus.put("LOCKED", lockedUsers);
        
        UserStatisticsDTO statistics = new UserStatisticsDTO();
        statistics.setTotalUsers(totalUsers);
        statistics.setActiveUsers(activeUsers);
        statistics.setInactiveUsers(inactiveUsers);
        statistics.setLockedUsers(lockedUsers);
        statistics.setUsersByRole(usersByRole);
        statistics.setUsersByStatus(usersByStatus);
        
        return statistics;
    }
    
    // convertToDTO
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole() != null ? user.getRole().toString() : null);
        dto.setStatus(user.getStatus() != null ? user.getStatus().toString() : null);
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}