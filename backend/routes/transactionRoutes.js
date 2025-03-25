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

// ✅ Edit a transaction
router.put("/edit/:transactionId", async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { payer, amount, splitAmong } = req.body;

        console.log("Editing transaction:", transactionId); // Debugging log

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            console.log("Transaction not found:", transactionId);
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Update transaction details
        transaction.payer = payer;
        transaction.amount = amount;
        transaction.splitAmong = splitAmong;
        await transaction.save();

        console.log("Updated transaction:", transaction);
        res.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Error updating transaction", error });
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

// Get balance summary
router.get("/balance/:eventId", async (req, res) => {
    try {
      const transactions = await Transaction.find({ eventId: req.params.eventId });
  
      const balances = {}; // { userA: { userB: amount } }
  
      transactions.forEach((tx) => {
        const share = tx.amount / tx.splitAmong.length;
  
        tx.splitAmong.forEach((participant) => {
          if (participant === tx.payer) return; // Don't owe yourself
  
          if (!balances[participant]) balances[participant] = {};
          if (!balances[participant][tx.payer]) balances[participant][tx.payer] = 0;
  
          balances[participant][tx.payer] += share;
        });
      });
  
      res.json(balances); // e.g., { "Alice": { "Bob": 25 }, "Charlie": { "Bob": 25 } }
    } catch (error) {
      res.status(500).json({ message: "Error calculating balance summary", error });
    }
  });
  

module.exports = router;
