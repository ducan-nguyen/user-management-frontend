User Management System - Full Stack Application

📋 Project Overview
User Management System is a complete web application that allows comprehensive user management with full CRUD operations, role-based access control, JWT authentication, and a user-friendly interface. Built with modern architecture, high security standards, and easy scalability.

🎯 Objectives
Build a professional user management system

Practice Microservice architecture with Spring Boot

Learn ReactJS and hooks

Integrate JWT security and role-based permissions

Develop Full-stack development skills

🚀 Installation Guide

System Requirements

Java 17+

Node.js 18+

MySQL 8.0+

Maven 3.9+

Git

1. Clone Repository
bash
git clone https://github.com/ducan-nguyen/user-management-system.git

cd user-management-system

3. Backend Setup
bash
cd backend

# Configure database in application.properties
# Edit src/main/resources/application.properties:
# spring.datasource.url=jdbc:mysql://localhost:3306/user_management
# spring.datasource.username=root
# spring.datasource.password=yourpassword

# Build and run
mvn clean install
mvn spring-boot:run
3. Database Setup
bash
# Login to MySQL
mysql -u root -p

# Run database script
source backend/src/main/resources/database.sql

# Or copy-paste content of database.sql into MySQL
4. Frontend Setup
bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start
5. Access the Application
Frontend: http://localhost:3000

Backend API: http://localhost:8080

Sample Accounts
Role	Username	Password
Admin	admin	admin123
Manager	manager1	admin123
User	user1	admin123
🎯 Advanced Features Implemented
1. Centralized Error Handling
Global exception handling with @RestControllerAdvice

Detailed validation errors

Custom error responses with appropriate HTTP status codes

Toast notifications on frontend

2. Security
JWT token authentication

Password encryption with BCrypt

Role-based authorization with @PreAuthorize

CORS configuration for frontend access

Secure headers and session management

3. Performance
Backend pagination for user lists

Cache busting for API calls (timestamp parameter)

Lazy loading components

Optimized re-renders with React hooks

4. UX/UI
Responsive design with Bootstrap

Loading states and spinners

Confirmation modals before destructive actions

Search functionality with debounce

Sortable columns with visual indicators

Role and status badges with color coding

5. Validation
Frontend validation with React Hook Form

Backend validation with Jakarta Validation

Password confirmation on registration

Email format validation

Minimum username length validation

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

📈 Future Development (TODO)
Version 2.0
Export users to Excel/PDF

Avatar upload functionality

Email verification on registration

Password reset via email

Activity logs and audit trails

Dark mode toggle

Unit and integration tests

Docker containerization

Version 3.0
Real-time notifications with WebSocket

Multi-language support (i18n)

Advanced filtering and sorting

Data visualization dashboard

API rate limiting

Microservices architecture

📝 License
This project is distributed under the MIT license.

👨‍💻 Author
Your Name

Email: ducan.nguyen9801@gmail.com

GitHub: [github.com/ducan-nguyen](https://github.com/ducan-nguyen)

🙏 Acknowledgments
Thank you for your interest in this project! This application was built for learning purposes to develop Full-stack development skills. All contributions and feedback are highly valuable for improving the project.

⭐ Support the Project
If you find this project helpful, please:

⭐ Star it on GitHub

📢 Share it with friends

🤝 Contribute code or report issues

💬 Provide feedback for improvements

Happy Coding! 🚀
