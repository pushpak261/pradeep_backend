// password :jFHQeO0vCL9uaePn
//MONGOURL:mongodb+srv://yewalepradip77:<db_password>@cluster0.92tater.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const express = require("express");
const app = express();
const connectDB = require("./conn/conn.js"); // MongoDB connection
const auth = require("./routes/auth.js"); // Auth routes
const list = require("./routes/list.js");

const cors = require('cors');
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Hello");
});

// API routes
app.use("/api/v1", auth);
app.use("/api/v1", list);

app.listen(1000, () => {
  console.log("Server started on port 1000");
});
