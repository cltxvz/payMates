import React, { useState } from "react";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Participants = ({ participants, addParticipant, removeParticipant, eventId, refreshEvent }) => {
  const [showModal, setShowModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState("");
  const [error, setError] = useState("");

  const openAddModal = () => {
    setIsEditing(false);
    setNewParticipant("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (name) => {
    setIsEditing(true);
    setOriginalName(name);
    setNewParticipant(name);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setNewParticipant("");
    setOriginalName("");
    setIsEditing(false);
    setError("");
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const trimmed = newParticipant.trim();

    if (!trimmed) {
      setError("Please enter a valid name.");
      return;
    }

    if (participants.includes(trimmed) && trimmed !== originalName) {
      setError("That name already exists.");
      return;
    }

    try {
      if (isEditing) {
        if (trimmed === originalName) {
          setError("No changes made.");
          return;
        }

        await axios.post(`${API_BASE_URL}/events/update-participant`, {
          eventId,
          originalName,
          updatedName: trimmed,
        });
        await refreshEvent();
      } else {
        await addParticipant(trimmed);
      }

      closeModal();
    } catch (err) {
      console.error("Error editing participant:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="event-section">
      <h2 className="text-center">Participants</h2>

      <ListGroup className="mb-3">
        {participants.map((user) => (
          <ListGroup.Item
            key={user}
            className="d-flex justify-content-between align-items-center"
          >
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

      <Button variant="success" onClick={openAddModal}>
        ➕ Add Participant
      </Button>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Participant" : "Add Participant"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{isEditing ? "Update Name" : "Enter Name"}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
              />
              {error && (
                <div className="text-danger mt-2" style={{ fontSize: "0.9rem" }}>
                  {error}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "➕ Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Participants;
