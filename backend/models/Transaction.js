const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  payer: { type: String, required: true },
  amount: { type: Number, required: true },

  splitAmong: {
    type: Map,
    of: Number,
    required: true,
  },

  paidBy: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
