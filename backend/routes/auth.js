import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  console.log("=== REGISTRATION START ===");
  console.log("Registration attempt:", { ...req.body, password: "****" });
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "All fields (username, email, password) are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    let user = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (user) {
      if (user.email === email) {
        console.log("Registration failed: Email already exists", email);
        return res.status(409).json({ error: "Email already exists" });
      }
      if (user.username === username) {
        console.log("Registration failed: Username already exists", username);
        return res.status(409).json({ error: "Username already exists" });
      }
    }

    console.log("Creating new user...");
    user = new User({ username, email, password });
    console.log("User object created:", { username, email, password: "****" });
    console.log("Saving user to database...");
    await user.save();
    console.log("User saved successfully, ID:", user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Registration successful:", email);
    console.log("=== REGISTRATION END ===");
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username,
        email,
        supportRole: user.supportRole,
        engagementMetrics: user.engagementMetrics,
      },
    });
  } catch (err) {
    console.error("=== REGISTRATION ERROR ===");
    console.error("Registration error:", err);
    console.log("=== REGISTRATION END ===");
    res
      .status(500)
      .json({ error: "Internal server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("Login attempt:", { email: req.body.email });
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: Invalid credentials", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Login failed: Password mismatch", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Login successful:", email);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email,
        supportRole: user.supportRole,
        engagementMetrics: user.engagementMetrics,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

// Fetch authenticated user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        supportRole: user.supportRole,
        engagementMetrics: user.engagementMetrics,
      },
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res
      .status(500)
      .json({ error: "Internal server error while fetching profile" });
  }
});

// Update authenticated user profile / support role
router.put("/profile", auth, async (req, res) => {
  try {
    const { supportRole } = req.body;
    if (
      !supportRole ||
      !["Need Help", "Can Help", "Both"].includes(supportRole)
    ) {
      return res.status(400).json({ error: "Invalid supportRole value" });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.supportRole = supportRole;
    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        supportRole: user.supportRole,
        engagementMetrics: user.engagementMetrics,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res
      .status(500)
      .json({ error: "Internal server error while updating profile" });
  }
});

export default router;
