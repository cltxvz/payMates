const mongoose = require("mongoose");
const Transaction = require("./Transaction");

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
    participants: [{ type: String }], // List of user names
    inviteCode: { type: String, unique: true, required: true},
    createdAt: { type: Date, default: Date.now, expires: '7d' } // Auto-delete after 7 days
}, { timestamps: true });

// Middleware: Delete transactions when an event is deleted
EventSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        await Transaction.deleteMany({ eventId: this._id });
        console.log(`Deleted all transactions for event ${this._id}`);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Event", EventSchema);
