const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    payer: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    splitAmong: {
      type: Map,
      of: Number,
      required: true,
    },

    paidBy: [
      {
        type: String, // Array of users who marked this as paid
      },
    ],

    // Auto-delete based on event expiration
    expiresAt: {
      type: Date,
      expires: 0, // Will be based on parent event
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
