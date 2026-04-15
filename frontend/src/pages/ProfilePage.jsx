import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FaUser className="me-2" /> User Profile
              </h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted">Username</label>
                    <p className="fw-bold">{user?.username}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted">Email</label>
                    <p className="fw-bold">
                      <FaEnvelope className="me-2 text-primary" />
                      {user?.email}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted">Role</label>
                    <p>
                      <Badge bg={user?.role === 'ROLE_ADMIN' ? 'danger' : user?.role === 'ROLE_MANAGER' ? 'info' : 'secondary'}>
                        {user?.role?.replace('ROLE_', '')}
                      </Badge>
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted">Full Name</label>
                    <p className="fw-bold">{user?.fullName || 'Not provided'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted">Phone Number</label>
                    <p className="fw-bold">
                      <FaPhone className="me-2 text-primary" />
                      {user?.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted">Address</label>
                    <p className="fw-bold">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      {user?.address || 'Not provided'}
                    </p>
                  </div>
                </Col>
              </Row>
              <hr />
              <div className="text-muted small">
                <FaCalendarAlt className="me-1" />
                Member since: {new Date(user?.createdAt).toLocaleDateString()}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;