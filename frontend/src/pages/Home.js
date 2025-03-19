import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const API_BASE_URL = "http://localhost:5003/api";

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [eventName, setEventName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  // Create an event
  const createEvent = async () => {
    if (!eventName.trim() || !userName.trim()) {
      setError("Please enter your name and event name.");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/events/create`, {
        name: eventName,
        createdBy: userName,
      });
      navigate(`/event/${res.data._id}`);
    } catch (error) {
      setError("Error creating event. Try again.");
    }
  };

  // Redirect to Join Event Page
  const fetchEventDetails = () => {
    if (!inviteCode.trim()) {
      setError("Please enter an invite code.");
      return;
    }
    navigate(`/join/${inviteCode}`); // ✅ Redirect user to Join Event page
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Welcome to PayMates</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {/* Create Event Section */}
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center">Create an Event</h2>
            <Form.Group className="mt-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" className="mt-3 w-100" onClick={createEvent}>
              ➕ Create Event
            </Button>
          </Card>
        </Col>

        {/* Join Event Section */}
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center">Join an Event</h2>
            <Form.Group className="mt-3">
              <Form.Label>Invite Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3 w-100" onClick={fetchEventDetails}>
              🔍 Find Event
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
