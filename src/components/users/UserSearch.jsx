import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

const UserSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleClear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search by username, email, or full name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="shadow-sm"
        />
        <Button type="submit" variant="primary" className="shadow-sm">
          <FaSearch className="me-2" /> Search
        </Button>
        {keyword && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            className="shadow-sm"
          >
            <FaTimes />
          </Button>
        )}
      </InputGroup>
    </Form>
  );
};

export default UserSearch;
