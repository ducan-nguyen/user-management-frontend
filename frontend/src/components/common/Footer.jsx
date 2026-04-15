import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light py-3 mt-auto border-top">
      <Container className="text-center">
        <p className="text-muted mb-0">
          © {currentYear} User Management System. All rights reserved.
        </p>
        <p className="text-muted small mb-0">Built with Spring Boot & React</p>
      </Container>
    </footer>
  );
};

export default Footer;
