import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields (username, email, password) are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      if (user.email === email) {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(409).json({ error: "Username already exists" });
    }

    user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Internal server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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
    console.error("Login error:", err.message);
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
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Fetch profile error:", err.message);
    res.status(500).json({ error: "Internal server error while fetching profile" });
  }
});

// Update authenticated user profile / support role
router.put("/profile", auth, async (req, res) => {
  try {
    const { supportRole } = req.body;
    if (!supportRole || !["Need Help", "Can Help", "Both"].includes(supportRole)) {
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
    console.error("Update profile error:", err.message);
    res.status(500).json({ error: "Internal server error while updating profile" });
  }
});

export default router;
