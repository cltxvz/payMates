const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Transaction = require("../models/Transaction");

// ✅ Create an event
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

// ✅ Get event ID using invite code
router.get("/by-invite/:inviteCode", async (req, res) => {
    try {
        console.log("Received inviteCode for lookup:", req.params.inviteCode); // Debugging log

        // Find event by inviteCode (not event ID)
        const event = await Event.findOne({ inviteCode: req.params.inviteCode });

        if (!event) {
            console.log("Event not found for inviteCode:", req.params.inviteCode);
            return res.status(404).json({ message: "Event not found" });
        }

        console.log("Event found - ID:", event._id, "with inviteCode:", event.inviteCode);
        res.json({ eventId: event._id }); // ✅ Return the event ID

    } catch (error) {
        console.error("Error fetching event ID:", error);
        res.status(500).json({ message: "Error fetching event ID", error });
    }
});


// ✅ Join an event via invite code (using event ID)
router.post("/join", async (req, res) => {
    try {
        const { inviteCode, userName } = req.body;
        console.log("Joining Event - Invite Code:", inviteCode, "User:", userName);

        const event = await Event.findOne({ inviteCode }); // Find event by invite code
        if (!event) {
            console.log("Event not found for inviteCode:", inviteCode);
            return res.status(404).json({ message: "Event not found" });
        }

        if (!event.participants.includes(userName)) {
            event.participants.push(userName);
            await event.save();
            console.log("User added to event:", event._id, "Participants:", event.participants);
        } else {
            console.log("User already in event:", userName);
        }

        res.json({ eventId: event._id }); // ✅ Ensure response includes event ID

    } catch (error) {
        console.error("Error joining event:", error);
        res.status(500).json({ message: "Error joining event", error });
    }
});


// ✅ Get event details by event ID
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
