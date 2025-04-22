const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Transaction = require("../models/Transaction");

// Create an event
router.post("/create", async (req, res) => {
    try {
        const { name, createdBy } = req.body;
        const inviteCode = Math.random().toString(36).substr(2, 6); // Generate a random 6-character code
        const newEvent = new Event({ name, createdBy, inviteCode, participants: [createdBy] });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error });
    }
});

// Get event ID using invite code
router.get("/by-invite/:inviteCode", async (req, res) => {
    try {

        // Find event by inviteCode
        const event = await Event.findOne({ inviteCode: req.params.inviteCode });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ eventId: event._id }); // Return the event ID

    } catch (error) {
        console.error("Error fetching event ID:", error);
        res.status(500).json({ message: "Error fetching event ID", error });
    }
});

// Join an event via invite code (using event ID)
router.post("/join", async (req, res) => {
    try {
        const { inviteCode, userName } = req.body;

        const event = await Event.findOne({ inviteCode }); // Find event by invite code
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (!event.participants.includes(userName)) {
            event.participants.push(userName);
            await event.save();
        }

        res.json({ eventId: event._id }); // Ensure response includes event ID

    } catch (error) {
        console.error("Error joining event:", error);
        res.status(500).json({ message: "Error joining event", error });
    }
});


// Get event details by event ID
router.get("/:eventId", async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
});

// Delete an event manually
router.delete("/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId.trim(); // Trim extra spaces or newline characters

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        await Transaction.deleteMany({ eventId: event._id }); // Delete related transactions
        await event.deleteOne(); // Delete the event

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
});

// Remove a participant from an event
router.post("/remove-participant", async (req, res) => {
    try {
        const { eventId, userName } = req.body;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        event.participants = event.participants.filter(participant => participant !== userName);
        await event.save();

        res.json({ message: "Participant removed", event });
    } catch (error) {
        res.status(500).json({ message: "Error removing participant", error });
    }
});

// Update (rename) a participant
router.post("/update-participant", async (req, res) => {
    try {
      const { eventId, originalName, updatedName } = req.body;
  
      if (!eventId || !originalName || !updatedName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check if the updated name already exists
      if (event.participants.includes(updatedName)) {
        return res.status(409).json({ message: "Name already exists in the event" });
      }
  
      const index = event.participants.indexOf(originalName);
      if (index === -1) {
        return res.status(404).json({ message: "Original participant not found" });
      }
  
      // Replace old name with updated one
      event.participants[index] = updatedName;
      await event.save();
  
      res.json({ message: "Participant updated", participants: event.participants });
    } catch (error) {
      console.error("Error updating participant:", error);
      res.status(500).json({ message: "Error updating participant", error });
    }
  });  

module.exports = router;
