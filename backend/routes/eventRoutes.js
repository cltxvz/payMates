const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Transaction = require("../models/Transaction");

// Create an event
router.post("/create", async (req, res) => {
    try {
        const { name, createdBy } = req.body;
        const inviteCode = Math.random().toString(36).substr(2, 6); // Generate a random 6-char code
        const newEvent = new Event({ name, createdBy, inviteCode, participants: [createdBy] });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error });
    }
});

// Join an event via invite code
router.post("/join", async (req, res) => {
    try {
        const { inviteCode, userName } = req.body;
        const event = await Event.findOne({ inviteCode });

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (!event.participants.includes(userName)) {
            event.participants.push(userName);
            await event.save();
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error joining event", error });
    }
});

// Get event details
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

module.exports = router;
