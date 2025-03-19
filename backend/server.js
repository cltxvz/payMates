const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Import routes
const eventRoutes = require("./routes/eventRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Use routes
app.use("/api/events", eventRoutes);
app.use("/api/transactions", transactionRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
