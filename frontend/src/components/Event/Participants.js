import React, { useState } from "react";
import { Button, ListGroup, Modal, Form} from "react-bootstrap";

const Participants = ({ participants, addParticipant, removeParticipant }) => {
  const [showModal, setShowModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState("");

  // Open modal for add or edit
  const openAddModal = () => {
    setIsEditing(false);
    setNewParticipant("");
    setShowModal(true);
  };

  const openEditModal = (name) => {
    setIsEditing(true);
    setOriginalName(name);
    setNewParticipant(name);
    setShowModal(true);
  };

  const closeModal = () => {
    setNewParticipant("");
    setOriginalName("");
    setIsEditing(false);
    setShowModal(false);
  };

  const handleSubmit = () => {
    const trimmed = newParticipant.trim();
    if (!trimmed) return alert("Enter a valid name!");

    if (isEditing) {
      if (trimmed === originalName) {
        alert("No changes made.");
        return;
      }

      removeParticipant(originalName); // Remove old name
      addParticipant(trimmed); // Add updated name
    } else {
      addParticipant(trimmed);
    }

    closeModal();
  };

  return (
    <div className="event-section">
      <h2 className="text-center">Participants</h2>

      {/* Participants List */}
      <ListGroup className="mb-3">
        {participants.map((user) => (
          <ListGroup.Item key={user} className="d-flex justify-content-between align-items-center">
            <span>{user}</span>
            <div>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => openEditModal(user)}
              >
                ✏️ Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeParticipant(user)}
              >
                ❌ Remove
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Add Participant Button */}
      <Button variant="success" onClick={openAddModal}>
        ➕ Add Participant
      </Button>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Participant" : "Add Participant"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{isEditing ? "Update Name" : "Enter Name"}</Form.Label>
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
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Save" : "➕ Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Participants;
