import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all items based on user role
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let query = {};
    if (user.supportRole === 'Can Help') {
      // Show all open requests from others
      query = { status: 'Open', user: { $ne: req.user } };
    } else if (user.supportRole === 'Need Help') {
      // Show only their own requests
      query = { user: req.user };
    } else {
      // Both: Show their own requests OR other open requests
      query = {
        $or: [
          { user: req.user },
          { status: 'Open', user: { $ne: req.user } }
        ]
      };
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create an item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, urgencyLevel } = req.body;
    
    // Simple AI Tag generation simulation
    const tags = [category.toLowerCase()];
    if (title.toLowerCase().includes('react')) tags.push('react');
    if (title.toLowerCase().includes('debug')) tags.push('debugging');
    
    const newItem = new Item({ 
      title, 
      description, 
      category, 
      urgencyLevel,
      user: req.user,
      aiMetadata: { tags }
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, description },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
