package com.example.usermanagement.repository;

import com.example.usermanagement.entity.User;
import com.example.usermanagement.entity.Role;
import com.example.usermanagement.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Tìm user theo username
    Optional<User> findByUsername(String username);
    
    // Tìm user theo email
    Optional<User> findByEmail(String email);
    
    // Kiểm tra username đã tồn tại chưa
    Boolean existsByUsername(String username);
    
    // Kiểm tra email đã tồn tại chưa
    Boolean existsByEmail(String email);
    
    // Kiểm tra phone number đã tồn tại chưa
    Boolean existsByPhoneNumber(String phoneNumber);
    
    // Tìm kiếm users theo keyword
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> search(@Param("keyword") String keyword);
    
    // Tìm kiếm users theo keyword có phân trang
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchWithPagination(@Param("keyword") String keyword, Pageable pageable);
    
    // Tìm users theo role
    List<User> findByRole(Role role);
    
    // Tìm users theo role có phân trang
    Page<User> findByRole(Role role, Pageable pageable);
    
    // Tìm users theo status
    List<User> findByStatus(UserStatus status);
    
    // Tìm users theo status có phân trang
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    
    // Đếm số users theo role
    Long countByRole(Role role);
    
    // Đếm số users theo status
    Long countByStatus(UserStatus status);
    
    // Tìm users với filter phức tạp
    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status)")
    Page<User> findByFilters(@Param("keyword") String keyword,
                             @Param("role") Role role,
                             @Param("status") UserStatus status,
                             Pageable pageable);
    
    // Tìm users tạo trong khoảng thời gian
    @Query("SELECT u FROM User u WHERE " +
           "u.createdAt BETWEEN :startDate AND :endDate")
    List<User> findByCreatedDateBetween(@Param("startDate") java.time.LocalDateTime startDate,
                                         @Param("endDate") java.time.LocalDateTime endDate);
    
    // Tìm users có role là ADMIN và sắp xếp theo ngày tạo
    List<User> findByRoleOrderByCreatedAtDesc(Role role);
    
    // Lấy users mới nhất
    List<User> findTop10ByOrderByCreatedAtDesc();
    
    // Thống kê users theo role
    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countUsersByRole();
    
    // Thống kê users theo status
    @Query("SELECT u.status, COUNT(u) FROM User u GROUP BY u.status")
    List<Object[]> countUsersByStatus();
    
    // Thống kê users theo tháng
    @Query("SELECT YEAR(u.createdAt), MONTH(u.createdAt), COUNT(u) " +
           "FROM User u GROUP BY YEAR(u.createdAt), MONTH(u.createdAt) " +
           "ORDER BY YEAR(u.createdAt) DESC, MONTH(u.createdAt) DESC")
    List<Object[]> countUsersByMonth();
}