import React, { useState } from "react";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";

const Participants = ({ participants, addParticipant, removeParticipant }) => {
  const [showModal, setShowModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");

  // Open modal
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setNewParticipant(""); // Clear input when closing
    setShowModal(false);
  };

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return alert("Enter a valid name!");
    addParticipant(newParticipant);
    closeModal();
  };

  return (
    <div className="event-section">
      <h2 className="text-center">Participants</h2>

      {/* Participants List */}
      <ListGroup className="mb-3">
        {participants.map((user) => (
          <ListGroup.Item key={user} className="d-flex justify-content-between align-items-center">
            {user}
            <Button variant="danger" size="sm" onClick={() => removeParticipant(user)}>
              ❌ Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Add Participant Button */}
      <Button variant="success" onClick={openModal}>➕ Add Participant</Button>

      {/* Add Participant Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Participant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Enter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Participant name"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddParticipant}>➕ Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Participants;
