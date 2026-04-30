import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
      const user = await User.findById(req.user).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Get users for leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
      const users = await User.find()
        .select('-password -email') // Do not leak emails
        .sort({ 'engagementMetrics.trustScore': -1, 'engagementMetrics.contributions': -1 })
        .limit(20);
      res.json(users);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
      const { supportRole, username, skills, interests, location } = req.body;
      const update = {};
      if (supportRole && ['Need Help', 'Can Help', 'Both'].includes(supportRole)) {
          update.supportRole = supportRole;
      }
      if (username) update.username = username;
      if (skills)    update.skills = skills;
      if (interests) update.interests = interests;
      if (location)  update.location = location;

      const user = await User.findByIdAndUpdate(
          req.user,
          { $set: update },
          { new: true }
      ).select('-password');

      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Get specific user by ID (for profile view of helpers)
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
