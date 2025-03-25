import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:5003/api";

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [eventName, setEventName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const createEvent = async () => {
    if (!eventName.trim() || !userName.trim()) {
      setErrorMessage("Please enter your name and event name.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/events/create`, {
        name: eventName,
        createdBy: userName,
      });

      localStorage.setItem("userName", userName.trim());
      navigate(`/event/${res.data._id}`);
    } catch (error) {
      setErrorMessage("Error creating event. Try again.");
    }
  };

  const fetchEventDetails = async () => {
    if (!inviteCode.trim()) {
      setErrorMessage("Please enter an invite code.");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/events/by-invite/${inviteCode.trim()}`);
      if (res.data.eventId) {
        navigate(`/join/${inviteCode.trim()}`);
      } else {
        setErrorMessage("Event not found.");
      }
    } catch (error) {
      setErrorMessage("Event not found.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <Container className="mt-4 mb-5">
        <h2 className="text-center fw-bold mb-4">Welcome to PayMates</h2>

        <Row className="gy-4">
          {/* Create Event Section */}
          <Col md={6}>
            <p className="text-center mb-3">
              Organizing the trip? Start by creating an event and naming your group.
            </p>
            <Card className="p-4 shadow-sm bg-light rounded-4 h-100">
              <h4 className="text-center mb-3">Create an Event</h4>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" className="mt-2 w-100" onClick={createEvent}>
                ➕ Create Event
              </Button>
            </Card>
          </Col>

          {/* Join Event Section */}
          <Col md={6}>
            <p className="text-center mb-3">
              Got an invite code? Join your group to view and add expenses.
            </p>
            <Card className="p-4 shadow-sm bg-light rounded-4 h-100">
              <h4 className="text-center mb-3">Join an Event</h4>
              <Form.Group className="mb-1">
                <Form.Label>Invite Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </Form.Group>

              {/* Inline red error message below input */}
              {errorMessage && (
                <div className="text-danger small mt-1">{errorMessage}</div>
              )}

              <Button variant="primary" className="mt-3 w-100" onClick={fetchEventDetails}>
                🔍 Find Event
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}

export default Home;
