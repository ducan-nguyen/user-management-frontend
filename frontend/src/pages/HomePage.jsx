import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaUsers,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaCheckCircle,
  FaArrowRight,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const features = [
    {
      icon: <FaUsers size={40} className="text-primary mb-3" />,
      title: "User Management",
      description: "Complete CRUD operations for managing users efficiently",
    },
    {
      icon: <FaShieldAlt size={40} className="text-success mb-3" />,
      title: "Role-Based Access",
      description:
        "Secure authentication with role-based permissions (Admin, Manager, User)",
    },
    {
      icon: <FaRocket size={40} className="text-info mb-3" />,
      title: "Fast & Responsive",
      description: "Built with React and Spring Boot for optimal performance",
    },
    {
      icon: <FaChartLine size={40} className="text-warning mb-3" />,
      title: "Real-time Updates",
      description: "Instant updates with modern state management",
    },
  ];

  const stats = [
    { number: "100%", label: "Secure" },
    { number: "24/7", label: "Availability" },
    { number: "Zero", label: "Downtime" },
    { number: "∞", label: "Scalable" },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      navigate("/users");
    } else {
      navigate("/register");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="display-3 fw-bold mb-4">User Management System</h1>
              <p className="lead mb-4">
                A modern, secure, and scalable solution for managing your users.
                Built with Spring Boot and React for enterprise-grade
                applications.
              </p>

              {/* Thay đổi phần buttons dựa trên trạng thái đăng nhập */}
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                {isAuthenticated() ? (
                  // ĐÃ ĐĂNG NHẬP - Hiển thị nút Dashboard và Logout
                  <>
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() => navigate("/users")}
                      className="px-4"
                    >
                      <FaUser className="me-2" /> Go to Dashboard
                    </Button>
                    <Button
                      variant="outline-light"
                      size="lg"
                      onClick={handleLogout}
                      className="px-4"
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </Button>
                  </>
                ) : (
                  // CHƯA ĐĂNG NHẬP - Hiển thị nút Get Started và Learn More
                  <>
                    <Button
                      variant="light"
                      size="lg"
                      onClick={handleGetStarted}
                      className="px-4"
                    >
                      Get Started <FaArrowRight className="ms-2" />
                    </Button>
                    <Button
                      variant="outline-light"
                      size="lg"
                      href="#features"
                      className="px-4"
                    >
                      Learn More
                    </Button>
                  </>
                )}
              </div>

              {/* Hiển thị thông báo welcome nếu đã đăng nhập */}
              {isAuthenticated() && (
                <div className="mt-4 p-3 bg-white bg-opacity-10 rounded">
                  <p className="mb-0">
                    Welcome back, <strong>{user?.username}</strong>!
                    <span className="ms-2 badge bg-light text-dark">
                      {user?.role?.replace("ROLE_", "")}
                    </span>
                  </p>
                </div>
              )}
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                alt="User Management"
                className="img-fluid rounded-3 shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col key={index} md={3} className="text-center mb-4 mb-md-0">
                <div className="stats-card p-4">
                  <h2 className="display-4 fw-bold text-primary">
                    {stat.number}
                  </h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5">
        <Container>
          <h2 className="text-center display-5 fw-bold mb-5">
            Why Choose Our System?
          </h2>
          <Row>
            {features.map((feature, index) => (
              <Col key={index} lg={3} md={6} className="mb-4">
                <Card className="h-100 text-center p-4 border-0 shadow-sm hover-card">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <Card.Title className="h4 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="how-it-works py-5 bg-light">
        <Container>
          <h2 className="text-center display-5 fw-bold mb-5">How It Works</h2>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="step-item d-flex mb-4">
                <div className="step-number me-4">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    1
                  </div>
                </div>
                <div>
                  <h4>Register an Account</h4>
                  <p className="text-muted">
                    Sign up with your email and create a secure password
                  </p>
                </div>
              </div>
              <div className="step-item d-flex mb-4">
                <div className="step-number me-4">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    2
                  </div>
                </div>
                <div>
                  <h4>Login to Dashboard</h4>
                  <p className="text-muted">
                    Access your personalized dashboard with secure
                    authentication
                  </p>
                </div>
              </div>
              <div className="step-item d-flex mb-4">
                <div className="step-number me-4">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    3
                  </div>
                </div>
                <div>
                  <h4>Manage Users</h4>
                  <p className="text-muted">
                    Create, read, update, and delete users with ease
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow">
                <Card.Body className="p-5">
                  <h3 className="mb-4">
                    {isAuthenticated()
                      ? "Welcome Back!"
                      : "Ready to get started?"}
                  </h3>
                  <p className="text-muted mb-4">
                    {isAuthenticated()
                      ? `You're logged in as ${user?.username}. Head to your dashboard to start managing users.`
                      : "Join thousands of satisfied users who trust our system for their user management needs."}
                  </p>
                  <div className="d-grid gap-3">
                    {isAuthenticated() ? (
                      // ĐÃ ĐĂNG NHẬP
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate("/users")}
                      >
                        <FaUser className="me-2" /> Go to Dashboard
                      </Button>
                    ) : (
                      // CHƯA ĐĂNG NHẬP
                      <>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => navigate("/register")}
                        >
                          Create Free Account
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="lg"
                          onClick={() => navigate("/login")}
                        >
                          Login to Existing Account
                        </Button>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="testimonials py-5">
        <Container>
          <h2 className="text-center display-5 fw-bold mb-5">
            What Our Users Say
          </h2>
          <Row>
            {[1, 2, 3].map((item) => (
              <Col key={item} md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaCheckCircle key={i} className="text-warning me-1" />
                      ))}
                    </div>
                    <Card.Text className="fst-italic mb-3">
                      "This system has completely transformed how we manage our
                      users. It's intuitive, fast, and secure."
                    </Card.Text>
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-primary rounded-circle me-3"
                        style={{ width: "40px", height: "40px" }}
                      ></div>
                      <div>
                        <h6 className="mb-0">John Doe</h6>
                        <small className="text-muted">System Admin</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section - CHỈ HIỂN THỊ KHI CHƯA ĐĂNG NHẬP */}
      {!isAuthenticated() && (
        <section className="cta-section bg-primary text-white py-5">
          <Container className="text-center">
            <h2 className="display-5 fw-bold mb-4">
              Start Managing Your Users Today
            </h2>
            <p className="lead mb-4">
              Join thousands of companies that trust our user management system
            </p>
            <Button
              variant="light"
              size="lg"
              onClick={handleGetStarted}
              className="px-5"
            >
              Get Started Now
            </Button>
          </Container>
        </section>
      )}
    </div>
  );
};

export default HomePage;
