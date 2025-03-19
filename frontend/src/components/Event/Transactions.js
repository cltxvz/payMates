import React, { useState } from "react";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";

const Transactions = ({ transactions, participants, addTransaction, editTransaction, removeTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Open modal for adding or editing
  const openModal = (transaction = null) => {
    if (transaction) {
      // Editing an existing transaction
      setIsEditing(true);
      setTransactionId(transaction._id);
      setPayer(transaction.payer);
      setAmount(transaction.amount);
      setSelectedParticipants(transaction.splitAmong);
    } else {
      // Adding a new transaction
      setIsEditing(false);
      setTransactionId(null);
      setPayer("");
      setAmount("");
      setSelectedParticipants([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Handle adding or editing a transaction
  const handleSubmit = () => {
    if (!payer || !amount || selectedParticipants.length === 0) {
      alert("Please fill all fields and select participants!");
      return;
    }

    if (isEditing) {
      editTransaction(transactionId, payer, amount, selectedParticipants);
    } else {
      addTransaction(payer, amount, selectedParticipants);
    }
    closeModal();
  };

  // Handle selecting/deselecting participants
  const toggleParticipant = (participant) => {
    if (selectedParticipants.includes(participant)) {
      setSelectedParticipants(selectedParticipants.filter((p) => p !== participant));
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  return (
    <div className="event-section">
      <h2 className="text-center">Transactions</h2>

      {/* Transactions List */}
      <ListGroup className="mb-3">
        {transactions.map((tx) => (
          <ListGroup.Item key={tx._id} className="d-flex justify-content-between align-items-center">
            <div>
              {tx.payer} paid ${tx.amount} - Split among: {tx.splitAmong.join(", ")}
            </div>
            <div>
              <Button variant="warning" size="sm" className="me-2" onClick={() => openModal(tx)}>
                ✏️ Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => removeTransaction(tx._id)}>
                ❌ Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Add Transaction Button */}
      <Button variant="success" onClick={() => openModal()}>➕ Add Transaction</Button>

      {/* Add/Edit Transaction Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Transaction" : "Add Transaction"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Payer</Form.Label>
              <Form.Control
                as="select"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              >
                <option value="">Select a payer</option>
                {participants.map((participant) => (
                  <option key={participant} value={participant}>
                    {participant}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Split Among</Form.Label>
              {participants.map((participant) => (
                <Form.Check
                  key={participant}
                  type="checkbox"
                  label={participant}
                  checked={selectedParticipants.includes(participant)}
                  onChange={() => toggleParticipant(participant)}
                />
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEditing ? "Save Changes" : "Add Transaction"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;
