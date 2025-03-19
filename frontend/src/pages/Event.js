import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Card, Form, InputGroup } from "react-bootstrap";
import Participants from "../components/Event/Participants";
import Transactions from "../components/Event/Transactions";
import BalanceSummary from "../components/Event/BalanceSummary";

const API_BASE_URL = "http://localhost:5003/api";

function Event() {
  const { eventId } = useParams(); // ✅ Now correctly retrieving eventId from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({});
  const [userName] = useState(""); // Simulated "logged-in" user
  const [inviteLink, setInviteLink] = useState("");

  // ✅ Fetch event details using eventId
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${eventId}`);
      setEvent(res.data);
      setInviteLink(`${window.location.origin}/join/${res.data.inviteCode}`); // ✅ Correcting the join link
    } catch (error) {
      alert("Event not found.");
    }
}, [eventId]);

  // ✅ Fetch transactions for the event
  const fetchTransactions = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions/${eventId}`);
      setTransactions(res.data);
    } catch (error) {
      alert("Error fetching transactions.");
    }
  }, [eventId]);

  // ✅ Fetch balance summary for the event
  const fetchBalanceSummary = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions/balance/${eventId}`);
      setBalances(res.data);
    } catch (error) {
      alert("Error fetching balance summary.");
    }
  }, [eventId]);

  // ✅ Adding a transaction
  const addTransaction = async (payer, amount, splitAmong) => {
    await axios.post(`${API_BASE_URL}/transactions/add`, { eventId, payer, amount, splitAmong });
    fetchTransactions(); // Refresh transaction list
  };

  // ✅ Editing a transaction
  const editTransaction = async (transactionId, payer, amount, splitAmong) => {
    await axios.put(`${API_BASE_URL}/transactions/edit/${transactionId}`, { payer, amount, splitAmong });
    fetchTransactions(); // Refresh transaction list
  };

  // ✅ Removing a transaction
  const removeTransaction = async (transactionId) => {
    await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`);
    fetchTransactions(); // Refresh transaction list
  };

  // ✅ Add a participant to the event
  const addParticipant = async (userName) => {
    await axios.post(`${API_BASE_URL}/events/join`, { inviteCode: event.inviteCode, userName });
    fetchEvent(); // Refresh participant list
  };

  // ✅ Remove a participant from the event
  const removeParticipant = async (userName) => {
    await axios.post(`${API_BASE_URL}/events/remove-participant`, { eventId, userName });
    fetchEvent(); // Refresh participant list
  };

  // ✅ Fetch all data when eventId is available
  useEffect(() => {
    if (!eventId) {
      console.error("Error: Missing eventId in URL");
      return;
    }
    fetchEvent();
    fetchTransactions();
    fetchBalanceSummary();
  }, [eventId, fetchEvent, fetchTransactions, fetchBalanceSummary]); 

  // ✅ Copy invite link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invitation link copied!");
  };

  return (
    <Container className="mt-4">
      {event ? (
        <>
          {/* Title */}
          <h1 className="text-center">{event.name}</h1>

          {/* Invite Code Section */}
          <Card className="text-center mt-3">
            <Card.Body>
              <h5>Invite Code: <span className="text-primary">{event.inviteCode}</span></h5>
              <InputGroup className="mt-2">
                <Form.Control type="text" value={inviteLink} readOnly />
                <Button variant="primary" onClick={copyToClipboard}>📋 Copy Link</Button>
              </InputGroup>
            </Card.Body>
          </Card>

          {/* Transaction & Participants Section */}
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

          {/* Balance Summary Section */}
          <BalanceSummary balances={balances} userName={userName} />

          {/* Action Buttons */}
          <div className="text-center mt-4">
            <Button variant="danger" onClick={() => navigate("/")}>🏠 Go Home</Button>
          </div>
        </>
      ) : (
        <h1>Loading event...</h1>
      )}
    </Container>
  );
}

export default Event;
