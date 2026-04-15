import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Badge, Card, Row, Col, Form } from "react-bootstrap";
import { 
  FaEdit, FaTrash, FaPlus, FaUser, FaSync, 
  FaToggleOn, FaToggleOff, FaExclamationTriangle,
  FaSort, FaSortUp, FaSortDown
} from "react-icons/fa";
import { toast } from "react-toastify";
import userService from "../../services/user.service";
import { useAuth } from "../../context/AuthContext";
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
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission, isAdmin, isManager } = useAuth();

  // Permission checks
  const canCreateUser = hasPermission('USER_CREATE');
  const canEditUser = (targetUser) => {
    if (isAdmin) return true;
    if (isManager) return targetUser.role === 'ROLE_USER';
    return false;
  };
  const canDeleteUser = (targetUser) => {
    if (isAdmin) return true;
    return false;
  };
  const canToggleStatus = (targetUser) => {
    if (isAdmin) return true;
    if (isManager) return targetUser.role === 'ROLE_USER';
    return false;
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchUsers();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll(currentPage, pageSize);

      if (data?.content) {
        setUsers(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, targetUser) => {
    if (!canDeleteUser(targetUser)) {
      toast.error("You don't have permission to delete this user");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user ${targetUser.username}?`)) {
      try {
        await userService.delete(id);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleStatusChange = async (id, currentStatus, targetUser) => {
    if (!canToggleStatus(targetUser)) {
      toast.error("You don't have permission to change this user's status");
      return;
    }

    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const action = newStatus === "ACTIVE" ? "activate" : "deactivate";
    
    if (window.confirm(`Are you sure you want to ${action} user ${targetUser.username}?`)) {
      try {
        await userService.updateStatus(id, newStatus);
        toast.success(`User ${action}d successfully`);
        fetchUsers();
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...users].sort((a, b) => {
      let aVal = a[key] || '';
      let bVal = b[key] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      return direction === 'asc' 
        ? aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        : aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });
    setUsers(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1" style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ms-1 text-primary" />
      : <FaSortDown className="ms-1 text-primary" />;
  };

  const getStatusBadge = (status) => {
    const variants = { ACTIVE: "success", INACTIVE: "warning", LOCKED: "danger" };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = { ROLE_ADMIN: "danger", ROLE_MANAGER: "info", ROLE_USER: "secondary" };
    return <Badge bg={variants[role] || "secondary"}>{role?.replace("ROLE_", "")}</Badge>;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedUsers = users;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2 className="mb-0"><FaUser className="me-2" />User Management</h2>
          <p className="text-muted">Total users: <strong>{totalElements}</strong></p>
        </Col>
        <Col className="text-end">
          <Button variant="outline-primary" className="me-2" onClick={fetchUsers}>
            <FaSync />
          </Button>
          {canCreateUser && (
            <Button variant="success" onClick={() => navigate("/users/new")}>
              <FaPlus className="me-2" /> Add User
            </Button>
          )}
        </Col>
      </Row>

      <UserSearch onSearch={() => {}} />

      <Card className="shadow">
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('username')}>Username {getSortIcon('username')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fullName')}>Full Name {getSortIcon('fullName')}</th>
                  <th>Role</th>
                  <th>Status</th>
                  {(isAdmin || isManager) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.fullName || "-"}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>{getStatusBadge(u.status)}</td>
                    {(isAdmin || isManager) && (
                      <td>
                        {canEditUser(u) && (
                          <Button variant="outline-primary" size="sm" className="me-2"
                            onClick={() => navigate(`/users/edit/${u.id}`)}>
                            <FaEdit /> Edit
                          </Button>
                        )}
                        {canDeleteUser(u) && (
                          <Button variant="outline-danger" size="sm" className="me-2"
                            onClick={() => handleDelete(u.id, u)}>
                            <FaTrash /> Delete
                          </Button>
                        )}
                        {canToggleStatus(u) && (
                          <Button variant={u.status === "ACTIVE" ? "outline-warning" : "outline-success"} size="sm"
                            onClick={() => handleStatusChange(u.id, u.status, u)}>
                            {u.status === "ACTIVE" ? <FaToggleOff /> : <FaToggleOn />}
                            {u.status === "ACTIVE" ? " Deactivate" : " Activate"}
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {totalElements > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="d-flex align-items-center">
                <span className="me-2">Show</span>
                <Form.Select size="sm" style={{ width: "70px" }} value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </Form.Select>
                <span className="ms-2">entries</span>
              </div>

              <Pagination currentPage={currentPage + 1} totalPages={totalPages} onPageChange={handlePageChange} />

              <div className="text-muted small">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserList;