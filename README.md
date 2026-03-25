🚀 User Management System

📌 Description

This is a fullstack User Management System built with ReactJS and Spring Boot, providing authentication and role-based authorization using JWT.

The application allows administrators to manage users efficiently with features such as search, pagination, and role control.

---

🛠 Tech Stack

Frontend

- ReactJS (Hooks, Context API, Redux Toolkit)
- HTML5, CSS3, Responsive Design
- Axios (API integration)

Backend

- Java, Spring Boot
- RESTful API
- JWT Authentication & Authorization

Database

- MySQL

---

⚙️ Features

- 🔐 User Authentication (Login / Register)
- 🛡 Role-based Authorization (Admin, Manager, User)
- 👤 CRUD User Management
- 🔎 Search, Pagination, Sorting
- 🔄 REST API Integration
- ⚡ Optimized performance for large datasets

---

🖥️ Screenshots

«(Add your screenshots here)»

Example:

![Login](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)

---

🔗 Demo

«(Add your deployed link here)»

Example:

Frontend: https://your-frontend.vercel.app  
Backend API: https://your-backend.onrender.com

---

📂 Project Structure

user-management/
│── backend/        # Spring Boot API
│── frontend/       # React application
│── database/       # SQL scripts

---

⚙️ Installation & Setup

1️⃣ Clone repository

git clone https://github.com/ducan-nguyen/user-management.git
cd user-management

---

2️⃣ Backend Setup (Spring Boot)

cd backend
mvn spring-boot:run

---

3️⃣ Frontend Setup (React)

cd frontend
npm install
npm start

---

🔗 API Endpoints (Sample)

Method| Endpoint| Description
POST| /api/auth/login| User login
POST| /api/auth/register| User registration
GET| /api/users| Get all users
PUT| /api/users/{id}| Update user
DELETE| /api/users/{id}| Delete user

---

📈 Future Improvements

- Deploy to cloud (Vercel / Render / AWS)
- Add email verification
- Improve UI/UX design
- Add unit & integration tests

---

📫 Contact

- GitHub: https://github.com/ducan-nguyen
- Email: ducan.nguyen9801@gmail.com

---

⭐ If you find this project useful, feel free to give it a star!
