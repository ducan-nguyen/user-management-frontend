import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

// Common Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/common/PrivateRoute";

// Pages
import HomePage from "./pages/HomePage";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// User Components
import UserList from "./components/users/UserList";
import UserForm from "./components/users/UserForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app d-flex flex-column min-vh-100">
          <Header />
          <main className="main-content flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/users"
                element={
                  <PrivateRoute>
                    <UserList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/users/new"
                element={
                  <PrivateRoute>
                    <UserForm />
                  </PrivateRoute>
                }
              />

              <Route
                path="/users/edit/:id"
                element={
                  <PrivateRoute>
                    <UserForm />
                  </PrivateRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
