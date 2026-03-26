User Management System - Full Stack Application

📋 Project Overview

User Management System is a complete web application that allows comprehensive user management with full CRUD operations, role-based access control, JWT authentication, and a user-friendly interface. Built with modern architecture, high security standards, and easy scalability.

🎯 Objectives

· Build a professional user management system
· Practice Microservice architecture with Spring Boot
· Learn ReactJS and hooks
· Integrate JWT security and role-based permissions
· Develop Full-stack development skills

---

🏗️ System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │────▶│    Database     │
│    (ReactJS)    │     │  (Spring Boot)  │     │    (MySQL)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
   - Components           - Controllers              - Users
   - Hooks                - Services                 - Roles
   - Context              - Repositories             - Tokens
   - Services             - Security/JWT              - Audit Logs
```

---

🛠️ Technologies Used

Backend

Technology Version Purpose
Java 17 Programming language
Spring Boot 3.1.5 Main framework
Spring Security 3.1.5 Security and authorization
Spring Data JPA 3.1.5 ORM and database interaction
MySQL 8.0 Database
JWT (jjwt) 0.11.5 Token authentication
Lombok 1.18.30 Reduce boilerplate code
Maven 3.9.0 Dependency management

Frontend

Technology Version Purpose
React 18.2.0 Main framework
React Router DOM 6.18.0 Page navigation
Axios 1.6.0 API calls
Bootstrap 5.3.2 CSS Framework
React Bootstrap 2.9.1 UI Components
React Hook Form 7.47.0 Form management
React Toastify 9.1.3 Notifications
React Icons 4.11.0 Icons

---

📁 Project Structure

```
user-management-system/
│
├── backend/                          # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/usermanagement/
│   │   │   │   ├── config/           # Security, CORS, JWT config
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── JwtConfig.java
│   │   │   │   │
│   │   │   │   ├── controller/       # REST API endpoints
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   │
│   │   │   │   ├── service/          # Business logic
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   └── CustomUserDetailsService.java
│   │   │   │   │
│   │   │   │   ├── repository/       # Database access
│   │   │   │   │   └── UserRepository.java
│   │   │   │   │
│   │   │   │   ├── model/            # Entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   └── UserStatus.java
│   │   │   │   │
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   │   ├── UserDTO.java
│   │   │   │   │   ├── UserRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── ProfileDTO.java
│   │   │   │   │   └── UserStatisticsDTO.java
│   │   │   │   │
│   │   │   │   ├── security/         # JWT filters & providers
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   └── JwtAuthenticationEntryPoint.java
│   │   │   │   │
│   │   │   │   ├── exception/        # Global exception handling
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   ├── UserAlreadyExistsException.java
│   │   │   │   │   └── ErrorResponse.java
│   │   │   │   │
│   │   │   │   └── utils/            # Utility classes
│   │   │   │       ├── AppConstants.java
│   │   │   │       └── ValidationUtils.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── database.sql
│   │   │
│   │   └── test/                     # Unit tests
│   │
│   └── pom.xml                        # Maven dependencies
│
└── frontend/                         # React Application
    ├── public/
    │   ├── index.html
    │   └── assets/
    │
    └── src/
        ├── components/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   │
        │   ├── users/
        │   │   ├── UserList.jsx
        │   │   ├── UserForm.jsx
        │   │   └── UserSearch.jsx
        │   │
        │   └── common/
        │       ├── Header.jsx
        │       ├── Footer.jsx
        │       ├── PrivateRoute.jsx
        │       ├── Pagination.jsx
        │       └── LoadingSpinner.jsx
        │
        ├── pages/
        │   └── HomePage.jsx
        │
        ├── services/
        │   ├── api.js
        │   ├── auth.service.js
        │   └── user.service.js
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── hooks/
        │   ├── useAuth.js
        │   └── useLocalStorage.js
        │
        ├── utils/
        │   └── constants.js
        │
        ├── App.jsx
        ├── App.css
        └── index.js
```

---

✨ Key Features

1. Authentication & Authorization

· ✅ User registration
· ✅ JWT-based login
· ✅ Three-tier role system: Admin, Manager, User
· ✅ Automatic redirection based on roles
· ✅ Protected routes with PrivateRoute component

2. User Management

· ✅ View user list with pagination
· ✅ Search users by username, email, full name
· ✅ Create new users
· ✅ Update user information
· ✅ Delete users with confirmation dialog
· ✅ Toggle status (Active/Inactive/Locked)
· ✅ Sort columns (ID, Username, Email, Full Name)

3. Role-Based Permissions

Feature Admin Manager User
View users list ✅ ✅ ✅
Create new user ✅ (all roles) ✅ (User only) ❌
Edit user ✅ (all) ✅ (User only) ❌
Delete user ✅ (all) ✅ (User only) ❌
Toggle status ✅ (all) ✅ (User only) ❌
View Home page ✅ ✅ ✅

4. User-Friendly Interface

· ✅ Fully responsive design
· ✅ Confirmation modals for deletions
· ✅ Toast notifications for actions
· ✅ Loading spinners
· ✅ Flexible pagination
· ✅ Sortable columns with visual indicators
· ✅ Role and status badges with color coding

---

🗄️ Database Schema

Users Table

```sql
CREATE TABLE users (
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
```

Sample Data

```sql
-- All users have password: admin123
-- BCrypt Hash: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE4lBo7oJe7GY3U.2

-- Admin Users
INSERT INTO users (username, email, password, full_name, role, status) VALUES
('admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE4lBo7oJe7GY3U.2',
 'System Administrator', 'ROLE_ADMIN', 'ACTIVE');

-- Manager Users
INSERT INTO users (username, email, password, full_name, role, status) VALUES
('manager1', 'manager1@company.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE4lBo7oJe7GY3U.2',
 'Manager One', 'ROLE_MANAGER', 'ACTIVE');

-- Regular Users
INSERT INTO users (username, email, password, full_name, role, status) VALUES
('user1', 'user1@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE4lBo7oJe7GY3U.2',
 'User One', 'ROLE_USER', 'ACTIVE');
```

---

🔧 API Endpoints

Authentication

Method Endpoint Description Request Body
POST /api/auth/login Login { "username": "admin", "password": "admin123" }
POST /api/auth/register Register { "username": "newuser", "email": "user@mail.com", "password": "pass123", "fullName": "New User" }

User Management

Method Endpoint Description Permission
GET /api/users Get all users (paginated) ADMIN
GET /api/users/{id} Get user by ID ADMIN/MANAGER
POST /api/users Create new user ADMIN
PUT /api/users/{id} Update user ADMIN/MANAGER
DELETE /api/users/{id} Delete user ADMIN
PATCH /api/users/{id}/status Update status ADMIN
GET /api/users/search Search users ADMIN/MANAGER
GET /api/users/profile Get current user profile ALL
GET /api/users/check-email Check email exists ALL
GET /api/users/check-username Check username exists ALL

---

🚀 Installation Guide

System Requirements

· Java 17+
· Node.js 18+
· MySQL 8.0+
· Maven 3.9+
· Git

1. Clone Repository

```bash
git clone https://github.com/your-username/user-management-system.git
cd user-management-system
```

2. Backend Setup

```bash
cd backend

# Configure database in application.properties
# Edit src/main/resources/application.properties:
# spring.datasource.url=jdbc:mysql://localhost:3306/user_management
# spring.datasource.username=root
# spring.datasource.password=yourpassword

# Build and run
mvn clean install
mvn spring-boot:run
```

3. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run database script
source backend/src/main/resources/database.sql

# Or copy-paste content of database.sql into MySQL
```

4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

5. Access the Application

· Frontend: http://localhost:3000
· Backend API: http://localhost:8080

Sample Accounts

Role Username Password
Admin admin admin123
Manager manager1 admin123
User user1 admin123

---

🎯 Advanced Features Implemented

1. Centralized Error Handling

· Global exception handling with @RestControllerAdvice
· Detailed validation errors
· Custom error responses with appropriate HTTP status codes
· Toast notifications on frontend

2. Security

· JWT token authentication
· Password encryption with BCrypt
· Role-based authorization with @PreAuthorize
· CORS configuration for frontend access
· Secure headers and session management

3. Performance

· Backend pagination for user lists
· Cache busting for API calls (timestamp parameter)
· Lazy loading components
· Optimized re-renders with React hooks

4. UX/UI

· Responsive design with Bootstrap
· Loading states and spinners
· Confirmation modals before destructive actions
· Search functionality with debounce
· Sortable columns with visual indicators
· Role and status badges with color coding

5. Validation

· Frontend validation with React Hook Form
· Backend validation with Jakarta Validation
· Password confirmation on registration
· Email format validation
· Minimum username length validation

---

🐛 Common Issues & Solutions

1. 401 Unauthorized Error

Cause: Token expired or invalid
Fix: Login again to get new token

2. 403 Forbidden Error

Cause: User lacks permission
Fix: Check current user role and permissions

3. 409 Conflict Error

Cause: Username or email already exists
Fix: Use different username/email

4. 500 Internal Server Error

Cause: Backend error
Fix: Check backend console logs and database connection

---

📈 Future Development (TODO)

Version 2.0

· Export users to Excel/PDF
· Avatar upload functionality
· Email verification on registration
· Password reset via email
· Activity logs and audit trails
· Dark mode toggle
· Unit and integration tests
· Docker containerization

Version 3.0

· Real-time notifications with WebSocket
· Multi-language support (i18n)
· Advanced filtering and sorting
· Data visualization dashboard
· API rate limiting
· Microservices architecture

---

📝 License

This project is distributed under the MIT license.

---

👨‍💻 Author

Your Name

· Email: your.email@example.com
· GitHub: github.com/your-username
· LinkedIn: linkedin.com/in/your-profile

---

🙏 Acknowledgments

Thank you for your interest in this project! This application was built for learning purposes to develop Full-stack development skills. All contributions and feedback are highly valuable for improving the project.

---

⭐ Support the Project

If you find this project helpful, please:

· ⭐ Star it on GitHub
· 📢 Share it with friends
· 🤝 Contribute code or report issues
· 💬 Provide feedback for improvements

---

Happy Coding! 🚀
