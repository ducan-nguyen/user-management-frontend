-- =====================================================
-- TẠO DATABASE
-- =====================================================
CREATE DATABASE IF NOT EXISTS user_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE user_management;

-- =====================================================
-- TẠO BẢNG USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TẠO BẢNG REFRESH TOKENS
-- =====================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_username (username),
    INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT DỮ LIỆU MẪU
-- Password: admin123
-- Hash BCrypt: $2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki
-- =====================================================

-- ADMIN USERS (2 users)
INSERT IGNORE INTO users (username, email, password, full_name, phone_number, address, role, status) VALUES
('admin', 'admin@example.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'System Administrator', '0909123456', '123 Admin Building, Ha Noi', 'ROLE_ADMIN', 'ACTIVE'),
('superadmin', 'superadmin@example.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Super Admin', '0909123457', '456 Admin Tower, HCMC', 'ROLE_ADMIN', 'ACTIVE');

-- MANAGER USERS (5 users)
INSERT IGNORE INTO users (username, email, password, full_name, phone_number, address, role, status) VALUES
('manager1', 'manager1@company.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Nguyễn Văn A', '0912345678', '789 Manager Street, Da Nang', 'ROLE_MANAGER', 'ACTIVE'),
('manager2', 'manager2@company.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Trần Thị B', '0912345679', '101 Manager Avenue, Hai Phong', 'ROLE_MANAGER', 'ACTIVE'),
('manager3', 'manager3@company.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Lê Văn C', '0912345680', '202 Manager Road, Can Tho', 'ROLE_MANAGER', 'ACTIVE'),
('manager4', 'manager4@company.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Phạm Thị D', '0912345681', '303 Manager Lane, Hue', 'ROLE_MANAGER', 'ACTIVE'),
('manager5', 'manager5@company.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Hoàng Văn E', '0912345682', '404 Manager Blvd, Nha Trang', 'ROLE_MANAGER', 'INACTIVE');

-- REGULAR USERS (15 users)
INSERT IGNORE INTO users (username, email, password, full_name, phone_number, address, role, status) VALUES
('user1', 'user1@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Phạm Văn D', '0987654321', '303 User Street, Ha Noi', 'ROLE_USER', 'ACTIVE'),
('user2', 'user2@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Hoàng Thị E', '0987654322', '404 User Avenue, HCMC', 'ROLE_USER', 'ACTIVE'),
('user3', 'user3@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Đặng Văn F', '0987654323', '505 User Road, Da Nang', 'ROLE_USER', 'ACTIVE'),
('user4', 'user4@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Bùi Thị G', '0987654324', '606 User Lane, Hai Phong', 'ROLE_USER', 'ACTIVE'),
('user5', 'user5@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Võ Văn H', '0987654325', '707 User Blvd, Can Tho', 'ROLE_USER', 'INACTIVE'),
('user6', 'user6@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Đỗ Thị I', '0987654326', '808 User Drive, Nha Trang', 'ROLE_USER', 'LOCKED'),
('user7', 'user7@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Dương Văn K', '0987654327', '909 User Court, Hue', 'ROLE_USER', 'ACTIVE'),
('user8', 'user8@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Lý Thị L', '0987654328', '111 User Circle, Vung Tau', 'ROLE_USER', 'ACTIVE'),
('user9', 'user9@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Trịnh Văn M', '0987654329', '222 User Square, Ha Long', 'ROLE_USER', 'ACTIVE'),
('user10', 'user10@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Vũ Thị N', '0987654330', '333 User Plaza, Da Lat', 'ROLE_USER', 'ACTIVE'),
('user11', 'user11@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Ngô Văn O', '0987654331', '444 User Park, Quy Nhon', 'ROLE_USER', 'ACTIVE'),
('user12', 'user12@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Mai Thị P', '0987654332', '555 User Hill, Buon Ma Thuot', 'ROLE_USER', 'ACTIVE'),
('user13', 'user13@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Hồ Văn Q', '0987654333', '666 User Valley, My Tho', 'ROLE_USER', 'ACTIVE'),
('user14', 'user14@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Đinh Thị R', '0987654334', '777 User Ridge, Soc Trang', 'ROLE_USER', 'ACTIVE'),
('user15', 'user15@gmail.com', '$2a$10$mLO/3K34DNA.JpFuEQezXemyFC7WdVPwvqRewdRxNAU.8iRvb/9Ki', 'Khúc Văn S', '0987654335', '888 User Cape, Ca Mau', 'ROLE_USER', 'ACTIVE');

-- =====================================================
-- KIỂM TRA DỮ LIỆU
-- =====================================================
SELECT '=== DANH SÁCH USERS ===' as '';
SELECT id, username, full_name, role, status FROM users ORDER BY role, id;

SELECT '=== THỐNG KÊ THEO ROLE ===' as '';
SELECT role, COUNT(*) as total FROM users GROUP BY role;

SELECT '=== THỐNG KÊ THEO STATUS ===' as '';
SELECT status, COUNT(*) as total FROM users GROUP BY status;