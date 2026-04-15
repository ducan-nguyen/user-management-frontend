import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import authService from "../../services/auth.service";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setFieldErrors({});

      // Loại bỏ confirmPassword
      const { confirmPassword, ...userData } = data;

      console.log("Sending registration data:", userData);

      const response = await authService.register(userData);

      console.log("Registration success:", response);

      setSuccess(true);
      toast.success("Registration successful! Please login.");

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);

      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Lỗi 409 - Conflict (Username/Email already exists)
        if (status === 409) {
          setError(data.message || "User already exists");

          // Xác định field bị lỗi dựa vào message
          if (data.message?.includes("Username")) {
            setFieldErrors({ username: "Username already taken" });
          } else if (data.message?.includes("Email")) {
            setFieldErrors({ email: "Email already registered" });
          }

          toast.error(data.message || "Registration failed");
        }
        // Lỗi 400 - Validation errors
        else if (status === 400) {
          if (typeof data === "object") {
            // Hiển thị từng lỗi field
            setFieldErrors(data);
            Object.keys(data).forEach((key) => {
              toast.error(`${key}: ${data[key]}`);
            });
          } else {
            setError(data.message || "Validation error");
            toast.error(data.message || "Validation error");
          }
        }
        // Lỗi khác
        else {
          const errorMessage = data?.message || "Registration failed";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else if (error.request) {
        setError(
          "Cannot connect to server. Please check if backend is running."
        );
        toast.error("Connection error");
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <Card className="shadow">
              <Card.Body className="text-center p-5">
                <div className="text-success mb-3">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Registration Successful!</h3>
                <p className="text-muted">Redirecting to login page...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="text-center bg-white">
              <h4 className="mb-0">Create New Account</h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  <Alert.Heading>Registration Failed</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Username <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        {...register("username", {
                          required: "Username is required",
                          minLength: {
                            value: 3,
                            message: "Minimum 3 characters",
                          },
                        })}
                        isInvalid={!!errors.username || !!fieldErrors.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username?.message || fieldErrors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Email <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email format",
                          },
                        })}
                        isInvalid={!!errors.email || !!fieldErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message || fieldErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Password <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                          },
                        })}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Confirm Password <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword", {
                          required: "Please confirm password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        {...register("fullName")}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        {...register("phoneNumber")}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter address"
                    {...register("address")}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">
                  Already have an account? Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
