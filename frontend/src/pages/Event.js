import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Participants from "../components/Event/Participants";
import Transactions from "../components/Event/Transactions";
import BalanceSummary from "../components/Event/BalanceSummary";
import EventHeader from "../components/Event/EventHeader";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:5003/api";

function Event() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({});
  const [userName] = useState(localStorage.getItem("userName") || "");
  const [inviteLink, setInviteLink] = useState("");

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${eventId}`);
      setEvent(res.data);
      setInviteLink(`${window.location.origin}/join/${res.data.inviteCode}`);
    } catch (error) {
      alert("Event not found.");
    }
  }, [eventId]);

  const fetchTransactions = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions/${eventId}`);
      setTransactions(res.data);
    } catch (error) {
      alert("Error fetching transactions.");
    }
  }, [eventId]);

  const fetchBalanceSummary = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions/balance/${eventId}`);
      setBalances(res.data);
    } catch (error) {
      alert("Error fetching balance summary.");
    }
  }, [eventId]);

  const addTransaction = async (payer, amount, splitAmong) => {
    await axios.post(`${API_BASE_URL}/transactions/add`, { eventId, payer, amount, splitAmong });
    fetchTransactions();
    fetchBalanceSummary();
  };

  const editTransaction = async (transactionId, payer, amount, splitAmong) => {
    await axios.put(`${API_BASE_URL}/transactions/edit/${transactionId}`, { payer, amount, splitAmong });
    fetchTransactions();
    fetchBalanceSummary();
  };

  const removeTransaction = async (transactionId) => {
    await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`);
    fetchTransactions();
    fetchBalanceSummary();
  };

  const addParticipant = async (userName) => {
    await axios.post(`${API_BASE_URL}/events/join`, { inviteCode: event.inviteCode, userName });
    fetchEvent();
  };

  const removeParticipant = async (userName) => {
    await axios.post(`${API_BASE_URL}/events/remove-participant`, { eventId, userName });
    fetchEvent();
  };

  const deleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event and all related transactions?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
      alert("Event deleted successfully.");
      navigate("/");
    } catch (error) {
      alert("Failed to delete the event.");
    }
  };

  useEffect(() => {
    if (!eventId) {
      console.error("Error: Missing eventId in URL");
      return;
    }
    fetchEvent();
    fetchTransactions();
    fetchBalanceSummary();
  }, [eventId, fetchEvent, fetchTransactions, fetchBalanceSummary]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invitation link copied!");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {event && <EventHeader eventName={event.name} userName={userName} />}
      <Container className="mb-5 flex-grow-1">
        {event ? (
          <>
            {/* Invite Code Section */}
            <Card className="text-center mt-2">
              <Card.Body>
                <h5>
                  Invite Code: <span className="text-primary">{event.inviteCode}</span>
                </h5>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <Button variant="secondary" onClick={() => navigate("/")}>
                    🏠 Start Over
                  </Button>
                  <Button variant="primary" onClick={copyToClipboard}>
                    📋 Copy Link
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Transactions & Participants */}
            <Row className="mt-4">
              <Col md={7}>
                <Transactions
                  transactions={transactions}
                  participants={event.participants}
                  addTransaction={addTransaction}
                  editTransaction={editTransaction}
                  removeTransaction={removeTransaction}
                />
              </Col>
              <Col md={5}>
                <Participants
                  participants={event.participants}
                  addParticipant={addParticipant}
                  removeParticipant={removeParticipant}
                />
              </Col>
            </Row>

            {/* Balance Summary */}
            <BalanceSummary balances={balances} userName={userName} />

            {/* Delete Event Button */}
            <div className="text-center mt-5">
              <Button variant="danger" onClick={deleteEvent}>
                🗑️ Delete Event
              </Button>
            </div>
          </>
        ) : (
          <h1 className="text-center mt-5">Loading event...</h1>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default Event;
