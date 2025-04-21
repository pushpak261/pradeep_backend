const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config(); // Load .env variables

const connectDB = require("./conn/conn.js"); // MongoDB connection
const auth = require("./routes/auth.js");    // Auth routes
const list = require("./routes/list.js");    // List routes

// Enable CORS (restrict to specific origins if needed)
const corsOptions = {
  origin: ['http://localhost:3000'], // Add frontend domain(s) here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Parse JSON request body

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1", auth);
app.use("/api/v1", list);

// Start server
app.listen(1000, () => {
  console.log("Server started on port 1000");
});
