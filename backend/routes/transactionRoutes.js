const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Add a transaction
router.post("/add", async (req, res) => {
    try {
        const { eventId, payer, amount, splitAmong } = req.body;
        const newTransaction = new Transaction({ eventId, payer, amount, splitAmong, paidBy: [] });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: "Error adding transaction", error });
    }
});

// Delete a transaction
router.delete("/:transactionId", async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        await transaction.deleteOne();
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
});


// Get transactions for an event
router.get("/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId.trim(); // Remove any newline characters or spaces
        const transactions = await Transaction.find({ eventId });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
});

// Mark transaction as paid
router.post("/mark-paid", async (req, res) => {
    try {
        const { transactionId, userName } = req.body;
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (!transaction.paidBy.includes(userName)) {
            transaction.paidBy.push(userName);
            await transaction.save();
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error marking payment", error });
    }
});

module.exports = router;
