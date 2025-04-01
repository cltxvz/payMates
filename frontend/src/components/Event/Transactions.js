import React, { useState } from "react";
import { Button, ListGroup, Modal, Form, Row, Col } from "react-bootstrap";

const Transactions = ({ transactions, participants, addTransaction, editTransaction, removeTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [customAmounts, setCustomAmounts] = useState({});
  const [splitEvenly, setSplitEvenly] = useState(true);

  const openModal = (transaction = null) => {
    if (transaction) {
      setIsEditing(true);
      setTransactionId(transaction._id);
      setPayer(transaction.payer);
      setAmount(transaction.amount);
      setSelectedParticipants(Object.keys(transaction.splitAmong));
      setCustomAmounts(transaction.splitAmong);
      setSplitEvenly(false); // assume custom on edit
    } else {
      setIsEditing(false);
      setTransactionId(null);
      setPayer("");
      setAmount("");
      setSelectedParticipants([]);
      setCustomAmounts({});
      setSplitEvenly(true);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const toggleParticipant = (participant) => {
    let updated = [...selectedParticipants];
    let updatedAmounts = { ...customAmounts };

    if (updated.includes(participant)) {
      updated = updated.filter((p) => p !== participant);
      delete updatedAmounts[participant];
    } else {
      updated.push(participant);
      updatedAmounts[participant] = splitEvenly ? "" : "";
    }

    setSelectedParticipants(updated);
    setCustomAmounts(updatedAmounts);
  };

  const handleCustomAmount = (participant, value) => {
    setCustomAmounts((prev) => ({
      ...prev,
      [participant]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = () => {
    const total = parseFloat(amount);
    if (!payer || !total || selectedParticipants.length === 0) {
      alert("Please complete all fields and select participants.");
      return;
    }

    let finalSplit = {};

    if (splitEvenly) {
      const share = parseFloat((total / selectedParticipants.length).toFixed(2));
      selectedParticipants.forEach((p) => {
        finalSplit[p] = share;
      });
    } else {
      const totalSplit = selectedParticipants.reduce(
        (sum, p) => sum + (customAmounts[p] || 0),
        0
      );
      if (parseFloat(totalSplit.toFixed(2)) !== total) {
        alert(`Split total ($${totalSplit.toFixed(2)}) must match total amount ($${total.toFixed(2)})`);
        return;
      }
      selectedParticipants.forEach((p) => {
        finalSplit[p] = customAmounts[p] || 0;
      });
    }

    if (isEditing) {
      editTransaction(transactionId, payer, total, finalSplit);
    } else {
      addTransaction(payer, total, finalSplit);
    }

    closeModal();
  };

  return (
    <div className="event-section">
      <h2 className="text-center">Transactions</h2>

      <ListGroup className="mb-3">
        {transactions.map((tx) => (
          <ListGroup.Item key={tx._id} className="d-flex justify-content-between align-items-center">
            <div>
              {tx.payer} paid ${tx.amount} – Split among:{" "}
              {Object.entries(tx.splitAmong)
                .map(([name, amt]) => `${name}: $${amt.toFixed(2)}`)
                .join(", ")}
            </div>
            <div>
              <Button variant="warning" size="sm" className="me-2" onClick={() => openModal(tx)}>✏️ Edit</Button>
              <Button variant="danger" size="sm" onClick={() => removeTransaction(tx._id)}>❌ Delete</Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Button variant="success" onClick={() => openModal()}>➕ Add Transaction</Button>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Transaction" : "Add Transaction"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Payer */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Payer:</strong></Form.Label>
              <Form.Control
                as="select"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              >
                <option value="">Select a payer</option>
                {participants.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Participants */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Participants:</strong></Form.Label>
              {participants.map((p) => (
                <Form.Check
                  key={p}
                  type="checkbox"
                  label={p}
                  checked={selectedParticipants.includes(p)}
                  onChange={() => toggleParticipant(p)}
                />
              ))}
            </Form.Group>

            {/* Total Amount */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Amount:</strong></Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            {/* Split Evenly Toggle */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Split Evenly"
                checked={splitEvenly}
                onChange={() => setSplitEvenly(!splitEvenly)}
              />
            </Form.Group>

            {/* Custom Inputs per Participant */}
            {!splitEvenly && selectedParticipants.length > 0 && (
              <Form.Group>
                <Form.Label><strong>Custom Amounts:</strong></Form.Label>
                {selectedParticipants.map((p) => (
                  <Row key={p} className="align-items-center mb-2">
                    <Col xs={6}>{p}</Col>
                    <Col xs={6}>
                      <Form.Control
                        type="number"
                        placeholder="0.00"
                        value={customAmounts[p] || ""}
                        onChange={(e) => handleCustomAmount(p, e.target.value)}
                      />
                    </Col>
                  </Row>
                ))}
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Transaction"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;
