import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table,
  Button,
  Badge,
  Card,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUser,
  FaSync,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import userService from "../../services/user.service";
import { useAuth } from "../../hooks/useAuth";
import UserSearch from "./UserSearch";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State cho sắp xếp
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === "ROLE_ADMIN";
  const isManager = user?.role === "ROLE_MANAGER";
  const showActions = isAdmin || isManager;

  // Kiểm tra xem user hiện tại có được phép thêm user mới không
  const canAddUser = () => {
    return isAdmin || isManager;
  };

  // Kiểm tra xem user hiện tại có được phép sửa user target không
  const canEditUser = (targetUser) => {
    if (isAdmin) return true;
    if (isManager) {
      return targetUser.role === "ROLE_USER";
    }
    return false;
  };

  // Kiểm tra xem user hiện tại có được phép xóa user target không
  const canDeleteUser = (targetUser) => {
    if (isAdmin) return true;
    if (isManager) {
      return targetUser.role === "ROLE_USER";
    }
    return false;
  };

  // Kiểm tra xem user hiện tại có được phép thay đổi status của user target không
  const canToggleStatus = (targetUser) => {
    if (isAdmin) return true;
    if (isManager) {
      return targetUser.role === "ROLE_USER";
    }
    return false;
  };

  // Hàm sắp xếp users
  const sortUsers = (usersToSort, key, direction) => {
    return [...usersToSort].sort((a, b) => {
      let aValue = a[key] || "";
      let bValue = b[key] || "";

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // Xử lý khi click vào cột để sắp xếp
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    // Sắp xếp users hiện tại
    const sorted = sortUsers(users, key, direction);
    setUsers(sorted);
  };

  // Hiển thị icon sắp xếp
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="ms-1" style={{ opacity: 0.3 }} />;
    }
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1 text-primary" />
    ) : (
      <FaSortDown className="ms-1 text-primary" />
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (location.state?.refresh) {
      if (
        location.state.message === "create" &&
        location.state.goToPage !== undefined
      ) {
        if (location.state.message === "create") {
          setCurrentPage(Math.max(totalPages - 1, 0));
        }
      } else {
        fetchUsers();
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await userService.getAll(currentPage, pageSize);

      if (Array.isArray(data)) {
        // Backend trả array
        setUsers(data);
        setTotalElements(data.length);
        setTotalPages(1);
      } else if (data?.content) {
        // Backend trả Page
        if (data?.content) {
          const backendPage = data.pageable?.pageNumber || 0;
          const totalPagesFromBackend = data.totalPages;

          if (
            currentPage >= totalPagesFromBackend &&
            totalPagesFromBackend > 0
          ) {
            setCurrentPage(totalPagesFromBackend - 1);
            return;
          }

          setUsers(data.content);
          setTotalElements(data.totalElements);
          setTotalPages(totalPagesFromBackend);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Mở modal xác nhận xóa
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Đóng modal xác nhận xóa
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Thực hiện xóa user
  const handleDelete = async () => {
    if (!userToDelete) return;

    if (!canDeleteUser(userToDelete)) {
      toast.error("You don't have permission to delete this user");
      closeDeleteModal();
      return;
    }

    try {
      setDeleting(true);
      await userService.delete(userToDelete.id);
      toast.success(`User ${userToDelete.username} deleted successfully`);

      // Sau khi xóa, quay về trang đầu nếu trang hiện tại không còn dữ liệu
      if (users.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers();
      }
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id, currentStatus, targetUser) => {
    if (!canToggleStatus(targetUser)) {
      toast.error("You don't have permission to change this user's status");
      return;
    }

    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const action = newStatus === "ACTIVE" ? "activate" : "deactivate";

    if (
      window.confirm(
        `Are you sure you want to ${action} user ${targetUser.username}?`,
      )
    ) {
      try {
        await userService.updateStatus(id, newStatus);
        toast.success(`User ${action}d successfully`);
        fetchUsers();
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleSearch = async (keyword) => {
    setLoading(true);
    try {
      if (keyword.trim()) {
        const results = await userService.search(keyword);
        const resultsArray = Array.isArray(results) ? results : [];

        const sorted = sortUsers(
          resultsArray,
          sortConfig.key,
          sortConfig.direction,
        );

        setUsers(sorted);
        setTotalElements(sorted.length);
        setTotalPages(Math.ceil(sorted.length / pageSize));
        setCurrentPage(0); // Về trang đầu khi tìm kiếm

        console.log(`Search results: ${sorted.length} users`);
      } else {
        await fetchUsers();
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    const backendPage = page - 1;
    console.log(
      `Changing from page ${
        currentPage + 1
      } to page ${page} (backend page ${backendPage})`,
    );
    setCurrentPage(backendPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Về trang đầu khi thay đổi kích thước
  };

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: "success",
      INACTIVE: "warning",
      LOCKED: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      ROLE_ADMIN: "danger",
      ROLE_MANAGER: "info",
      ROLE_USER: "secondary",
    };
    return (
      <Badge bg={variants[role] || "secondary"}>
        {role?.replace("ROLE_", "")}
      </Badge>
    );
  };

  // Tính toán chỉ số hiển thị
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in">
      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaExclamationTriangle className="me-2" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <>
              <p className="mb-3">Are you sure you want to delete this user?</p>
              <div className="bg-light p-3 rounded">
                <p className="mb-1">
                  <strong>Username:</strong> {userToDelete.username}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {userToDelete.email}
                </p>
                <p className="mb-1">
                  <strong>Role:</strong>{" "}
                  {userToDelete.role?.replace("ROLE_", "")}
                </p>
                <p className="mb-0">
                  <strong>Status:</strong> {getStatusBadge(userToDelete.status)}
                </p>
              </div>
              <p className="text-danger mt-3 mb-0">
                <small>This action cannot be undone!</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeDeleteModal}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Yes, Delete User"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-3 align-items-center">
        <Col>
          <h2 className="mb-0">
            <FaUser className="me-2" />
            User Management
          </h2>
          <p className="text-muted">
            Total users: <strong>{totalElements}</strong>
          </p>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={fetchUsers}
          >
            <FaSync />
          </Button>
          {canAddUser() && (
            <Button variant="success" onClick={() => navigate("/users/new")}>
              <FaPlus className="me-2" /> Add User
            </Button>
          )}
        </Col>
      </Row>

      <UserSearch onSearch={handleSearch} />

      <Card className="shadow">
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("id")}
                  >
                    ID {getSortIcon("id")}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("username")}
                  >
                    Username {getSortIcon("username")}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("fullName")}
                  >
                    Full Name {getSortIcon("fullName")}
                  </th>
                  <th>Role</th>
                  <th>Status</th>
                  {showActions && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.fullName || "-"}</td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>{getStatusBadge(u.status)}</td>
                      {showActions && (
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {canEditUser(u) && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1"
                                onClick={() => navigate(`/users/edit/${u.id}`)}
                                title="Edit user"
                              >
                                <FaEdit />
                              </Button>
                            )}

                            {canDeleteUser(u) && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="me-1"
                                onClick={() => confirmDelete(u)}
                                title="Delete user"
                              >
                                <FaTrash />
                              </Button>
                            )}

                            {canToggleStatus(u) && (
                              <Button
                                variant={
                                  u.status === "ACTIVE"
                                    ? "outline-warning"
                                    : "outline-success"
                                }
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(u.id, u.status, u)
                                }
                                title={
                                  u.status === "ACTIVE"
                                    ? "Deactivate user"
                                    : "Activate user"
                                }
                              >
                                {u.status === "ACTIVE" ? (
                                  <FaToggleOff />
                                ) : (
                                  <FaToggleOn />
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={showActions ? 7 : 6} className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalElements > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="d-flex align-items-center">
                <span className="me-2">Show</span>
                <Form.Select
                  size="sm"
                  style={{ width: "70px" }}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </Form.Select>
                <span className="ms-2">entries</span>
              </div>

              <Pagination
                currentPage={currentPage + 1} // Hiển thị page bắt đầu từ 1
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />

              <div className="text-muted small">
                Showing {startIndex} to {endIndex} of {totalElements} entries
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserList;
