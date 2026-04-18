import express from 'express';
import Item from '../models/Item.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all items for a user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newItem = new Item({ title, description, user: req.user });
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
