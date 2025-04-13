import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  ListGroup,
  Button,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Header from "../components/Home/HomeHeader";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:5003/api";

function JoinEvent() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const fetchEventId = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/events/by-invite/${inviteCode}`);
      setEventId(res.data.eventId);
    } catch (error) {
      setError("Invalid invite code. Event not found.");
    }
  }, [inviteCode]);

  const fetchEventDetails = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${eventId}`);
      setEvent(res.data);
    } catch (error) {
      setError("Error fetching event details.");
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventId();
  }, [fetchEventId]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const joinEvent = async () => {
    const name = selectedParticipant || userName.trim();

    if (!name) {
      setError("Please select your name or enter a new one.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/events/join`, {
        inviteCode,
        userName: name,
      });

      localStorage.setItem("userName", name);
      navigate(`/event/${res.data.eventId}`);
    } catch (error) {
      setError("Error joining event. Try again.");
    }
  };

  // Auto-clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <Container className="my-5 flex-grow-1 d-flex justify-content-center">
        {event ? (
          <Card className="p-4 shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
            <h2 className="text-center mb-2">Join <strong>{event.name}</strong></h2>
            <p className="text-center text-muted">Hosted by {event.createdBy}</p>

            <h5 className="text-center mt-4">Select Your Name:</h5>
            <ListGroup className="mb-3">
              {event.participants.map((participant) => (
                <ListGroup.Item
                  key={participant}
                  action
                  active={selectedParticipant === participant}
                  onClick={() => {
                    setSelectedParticipant(participant);
                    setUserName("");
                  }}
                >
                  {participant}
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <Form.Control
                  type="text"
                  placeholder="Or enter a new name"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setSelectedParticipant("");
                  }}
                />
              </ListGroup.Item>
            </ListGroup>

            <Button variant="success" className="w-100" onClick={joinEvent}>
              ✅ Join Event
            </Button>
          </Card>
        ) : (
          <h3 className="text-center">Fetching Event Details...</h3>
        )}
      </Container>

      {/* Toast Message */}
      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          bg="danger"
          onClose={() => setError("")}
          show={!!error}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white text-center">{error}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Footer />
    </div>
  );
}

export default JoinEvent;
