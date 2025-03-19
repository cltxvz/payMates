import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, ListGroup, Button, Form, Alert } from "react-bootstrap";

const API_BASE_URL = "http://localhost:5003/api";

function JoinEvent() {
  const { inviteCode } = useParams(); // Get invite code from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  // ✅ Step 1: Fetch event ID using invite code
  const fetchEventId = useCallback(async () => {
    try {
        console.log("Requesting event ID for inviteCode:", inviteCode); // Debugging log

        const res = await axios.get(`${API_BASE_URL}/events/by-invite/${inviteCode}`); 
        setEventId(res.data.eventId); // ✅ Use the correct event ID

        console.log("Fetched Event ID:", res.data.eventId); // Debugging log
    } catch (error) {
        console.error("Failed to fetch event ID:", error);
        alert("Invalid invite code. Event not found.");
    }
}, [inviteCode]);



  // ✅ Step 2: Fetch event details using event ID
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
  }, [fetchEventDetails, eventId]);

  // ✅ Join the event and redirect to event ID
  const joinEvent = async () => {
    if (!selectedParticipant && !userName.trim()) {
        setError("Please select your name or enter a new one.");
        return;
    }

    console.log("Joining event with inviteCode:", inviteCode, "User:", selectedParticipant || userName);

    try {
        const res = await axios.post(`${API_BASE_URL}/events/join`, {
            inviteCode,
            userName: selectedParticipant || userName,
        });

        console.log("Redirecting to event:", res.data.eventId); // Debugging log
        if (!res.data.eventId) {
            throw new Error("Event ID not returned from API");
        }

        navigate(`/event/${res.data.eventId}`); // ✅ Redirect using event ID
    } catch (error) {
        setError("Error joining event. Try again.");
    }
};



  return (
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>}

      {event ? (
        <Card className="p-4 shadow-sm">
          <h2 className="text-center">Join {event.name}</h2>
          <p className="text-center">Hosted by: {event.createdBy}</p>

          <h5 className="text-center">Select Your Name</h5>
          <ListGroup>
            {event.participants.map((participant) => (
              <ListGroup.Item
                key={participant}
                action
                active={selectedParticipant === participant}
                onClick={() => setSelectedParticipant(participant)}
              >
                {participant}
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </ListGroup.Item>
          </ListGroup>

          <Button variant="success" className="mt-3 w-100" onClick={joinEvent}>
            ✅ Join Event
          </Button>
        </Card>
      ) : (
        <h2 className="text-center">Fetching Event Details...</h2>
      )}
    </Container>
  );
}

export default JoinEvent;
