### User Management System - Full Stack Application

[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-24.0-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Tổng Quan

**User Management System** là một ứng dụng web quản lý người dùng hoàn chỉnh với đầy đủ các chức năng CRUD, phân quyền chi tiết (Role-Based Access Control), xác thực JWT, và khả năng triển khai với Docker. Dự án được xây dựng với kiến trúc hiện đại, bảo mật cao và dễ dàng mở rộng.

### Mục Tiêu
- Xây dựng hệ thống quản lý người dùng chuyên nghiệp
- Thực hành kiến trúc Microservice với Spring Boot
- Làm quen với ReactJS và các hooks
- Tích hợp bảo mật JWT và phân quyền
- Phát triển kỹ năng Full-stack

---

## Tính Năng Chính

### Xác thực & Phân quyền
- Đăng ký / Đăng nhập với JWT
- Refresh Token tự động
- 3 cấp độ phân quyền: **ADMIN**, **MANAGER**, **USER**
- Bảo vệ routes với PrivateRoute

### Quản lý Người dùng
- CRUD Users (Thêm, Sửa, Xóa, Xem)
- Tìm kiếm theo username, email, fullname
- Phân trang & Sắp xếp dữ liệu
- Thay đổi trạng thái (Active/Inactive/Locked)
- Hiển thị badges cho Role và Status

### Giao diện thân thiện
- Responsive trên mọi thiết bị
- Modal xác nhận khi xóa
- Toast notifications
- Loading spinners
- Dark mode sẵn sàng

### Bảo mật
- JWT Token với thời gian hết hạn
- Refresh Token rotation
- Password encryption (BCrypt)
- CORS configuration
- Role-based method security

---

## Công Nghệ Sử Dụng

### Backend
| Công nghệ         | Version | Mục đích              |
|-------------------|---------|-----------------------|
| Java              | 17      | Ngôn ngữ lập trình    |
| Spring Boot       | 3.1.5   | Framework chính       |
| Spring Security   | 3.1.5   | Bảo mật & phân quyền  |
| Spring Data JPA   | 3.1.5   | ORM                   |
| MySQL             | 8.0     | Cơ sở dữ liệu         |
| JWT               | 0.11.5  | Xác thực token        |
| Lombok            | 1.18.30 | Giảm boilerplate code |
| Maven             | 3.9+    | Quản lý dependencies  |

### Frontend
| Công nghệ         | Version | Mục đích        |
|-------------------|---------|-----------------|
| React             | 18.2.0  | Framework chính |
| React Router DOM  | 6.18.0  | Điều hướng      |
| Axios             | 1.6.0   | HTTP client     |
| Bootstrap         | 5.3.2   | CSS Framework   |
| React Bootstrap   | 2.9.1   | UI Components   |
| React Hook Form   | 7.47.0  | Form management |
| React Toastify    | 9.1.3   | Notifications   |
| React Icons       | 4.11.0  | Icons           |

### DevOps
- Docker & Docker Compose
- Git & GitHub
- Deploy sẵn sàng lên VPS

---

## Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Hệ Thống
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose (tùy chọn)
- Maven 3.9+

### Cách 1: Chạy với Docker (Khuyến nghị)

```bash
# Clone repository
git clone https://github.com/ducan-nguyen/user-management-system.git
cd user-management-system

# Tạo file .env từ mẫu
cp .env.example .env

# Khởi động tất cả services
docker compose up -d

# Kiểm tra trạng thái
docker compose ps

# Xem logs
docker compose logs -f