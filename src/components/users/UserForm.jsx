import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import userService from "../../services/user.service";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Theo dõi giá trị password để so sánh với confirm password
  const password = watch("password", "");

  const isAdmin = currentUser?.role === "ROLE_ADMIN";
  const isManager = currentUser?.role === "ROLE_MANAGER";

  useEffect(() => {
    if (id) {
      fetchUser();
    } else {
      // Khi tạo mới, set role mặc định
      if (isManager) {
        setValue("role", "ROLE_USER");
      }
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await userService.getById(id);

      // Kiểm tra quyền edit: Manager chỉ được edit user ROLE_USER
      if (isManager && userData.role !== "ROLE_USER") {
        toast.error("You don't have permission to edit this user");
        navigate("/users");
        return;
      }

      reset(userData);
    } catch (error) {
      toast.error("Failed to fetch user");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      if (id) {
        // UPDATE
        const updateData = {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          address: data.address,
        };

        // Chỉ Admin mới được update role
        if (isAdmin) {
          updateData.role = data.role;
        }

        await userService.update(id, updateData);
        toast.success("User updated successfully");

        navigate("/users", {
          state: { refresh: true, message: "update" },
          replace: true,
        });
      } else {
        // CREATE - Kiểm tra mật khẩu và xác nhận mật khẩu
        if (data.password !== data.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        // Kiểm tra quyền tạo user
        if (isManager && data.role && data.role !== "ROLE_USER") {
          toast.error("Managers can only create regular users");
          return;
        }

        const createData = {
          username: data.username,
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          address: data.address,
          role: isAdmin ? data.role : "ROLE_USER", // Manager luôn tạo user
        };

        await userService.create(createData);
        toast.success("User created successfully");

        const totalResponse = await userService.getAll(0, 1);
        const lastPage = Math.max(0, totalResponse.totalPages - 1);

        navigate("/users", {
          state: {
            refresh: true,
            message: "create",
            goToPage: lastPage,
          },
          replace: true,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Card className="shadow fade-in">
      <Card.Header className="bg-white">
        <h4 className="mb-0">{id ? "Edit User" : "Create New User"}</h4>
        {isManager && !id && (
          <p className="text-muted mt-2 mb-0">
            <small>You can only create regular user accounts</small>
          </p>
        )}
      </Card.Header>
      <Card.Body>
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
                    required: !id ? "Username is required" : false,
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  disabled={!!id}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username?.message}
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
                    required: !id ? "Email is required" : false,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  disabled={!!id}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {!id && (
            <>
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
                          message: "Password must be at least 6 characters",
                        },
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                          message:
                            "Password must contain at least one letter and one number",
                        },
                      })}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Password must be at least 6 characters with at least one
                      letter and one number
                    </Form.Text>
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
                        required: "Please confirm your password",
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
              <hr className="my-3" />
            </>
          )}

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
                  {...register("phoneNumber", {
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Phone number must be 10-11 digits",
                    },
                  })}
                  isInvalid={!!errors.phoneNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber?.message}
                </Form.Control.Feedback>
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

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              {...register("role")}
              disabled={isManager} // Manager không thể chọn role khác
            >
              <option value="ROLE_USER">User</option>
              {/* Admin mới thấy các option khác */}
              {isAdmin && (
                <>
                  <option value="ROLE_MANAGER">Manager</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </>
              )}
            </Form.Select>
            {isManager && !id && (
              <Form.Text className="text-muted">
                You can only create user accounts
              </Form.Text>
            )}
          </Form.Group>

          <div className="d-flex gap-2 mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="px-4"
            >
              <FaSave className="me-2" />
              {submitting ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/users")}
              className="px-4"
            >
              <FaTimes className="me-2" /> Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserForm;
