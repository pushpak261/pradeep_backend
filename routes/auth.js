const router = require("express").Router();
const bcrypt = require("bcryptjs"); // ✅ Import bcrypt
const User = require('../models/user.js');

const SALT_ROUNDS = 10; // You can adjust this as needed

// SIGN UP (Register)
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Save the user with hashed password
    const user = new User({ email, username, password: hashedPassword });
    await user.save();

    res.status(200).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// ✅ LOGIN (Password verification)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;
