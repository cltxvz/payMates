import React from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const EventHeader = ({ eventName, userName }) => {
  return (
    <header className="bg-success text-white py-4 mb-4 shadow-sm">
      <Container className="text-center">
        <h2 className="fw-bold">{eventName}</h2>
        <p className="lead mb-0">
          Welcome{userName ? `, ${userName}` : ""}!
        </p>
      </Container>
    </header>
  );
};

export default EventHeader;
