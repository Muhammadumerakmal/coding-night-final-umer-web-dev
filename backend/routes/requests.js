import express from 'express';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { validateHelpRequest, validateUpdateRequest, sanitizeInput } from '../middleware/validation.js';
import * as aiService from '../services/aiService.js';

const router = express.Router();

// Get requests based on role or filters
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let query = {};
    const { status, category, urgency, search } = req.query;

    // Apply explicit filters if provided (mostly for Explore page)
    if (status) query.status = status;
    if (category && category !== 'All') query.category = category;
    if (urgency && urgency !== 'All') query.urgencyLevel = urgency;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Default dashboard filtering if no specific search/filter is applied
    if (Object.keys(req.query).length === 0) {
      if (user.supportRole === 'Can Help') {
        // Show all open requests from others
        query = { status: 'Open', requester: { $ne: req.user } };
      } else if (user.supportRole === 'Need Help') {
        // Show only their own requests
        query = { requester: req.user };
      } else {
        // Both: Show their own requests OR other open requests
        query = {
          $or: [
            { requester: req.user },
            { status: 'Open', requester: { $ne: req.user } }
          ]
        };
      }
    }

    const requests = await HelpRequest.find(query)
      .populate('requester', 'username email engagementMetrics')
      .populate('helper', 'username')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single request
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id)
      .populate('requester', 'username email engagementMetrics')
      .populate('helper', 'username email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AI functions are now in services/aiService.js

// Create a request
router.post('/', auth, sanitizeInput, validateHelpRequest, async (req, res) => {
  try {
    const { title, description, category, urgencyLevel, aiSuggestedTags } = req.body;

    // AI Sentiment Analysis (using OpenAI)
    const { sentiment, sentimentScore } = await aiService.analyzeSentiment(title, description);

    // AI Category Suggestion (if not provided or to validate)
    const suggestedCategory = await aiService.suggestCategory(title, description);

    // AI Priority Suggestion
    const suggestedPriority = await aiService.suggestPriority(title, description, sentiment);

    // AI Tag Generation
    let tags = aiSuggestedTags || await aiService.generateTags(title, description, category || suggestedCategory);

    // AI Insights
    const insight = await aiService.generateInsights(title, description, category || suggestedCategory, sentiment);

    // AI Suggested Response for helpers
    const suggestedResponse = await aiService.generateSuggestedResponse(title, description, category || suggestedCategory, sentiment);

    const newRequest = new HelpRequest({
      title,
      description,
      category: category || suggestedCategory,
      urgencyLevel: urgencyLevel || suggestedPriority,
      requester: req.user,
      aiMetadata: {
        tags: [...new Set(tags)],
        insights: insight,
        autoCategory: suggestedCategory,
        autoUrgency: suggestedPriority,
        sentiment,
        sentimentScore,
        suggestedResponse
      }
    });

    await newRequest.save();

    // Auto-populate for return
    await newRequest.populate('requester', 'username email engagementMetrics');

    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update a request
router.put('/:id', auth, sanitizeInput, validateUpdateRequest, async (req, res) => {
  try {
    const { title, description, category, urgencyLevel, status } = req.body;
    const item = await HelpRequest.findOneAndUpdate(
      { _id: req.params.id, requester: req.user },
      { title, description, category, urgencyLevel, status },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Request not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Offer help (marks request as in progress, assigns helper)
router.post('/:id/offer-help', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'Open') return res.status(400).json({ message: 'Request is no longer open' });
    if (request.requester.toString() === req.user) return res.status(400).json({ message: 'Cannot offer help to your own request' });

    request.status = 'In Progress';
    request.helper = req.user;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark as solved
router.post('/:id/solve', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    // Only requester can mark as solved
    if (request.requester.toString() !== req.user) {
      return res.status(403).json({ message: 'Only the requester can mark this solved' });
    }

    request.status = 'Completed';
    request.completedAt = new Date();
    await request.save();

    // Update Helper's trust score (capped at 100) and contributions
    if (request.helper) {
      await User.findByIdAndUpdate(request.helper, [
        {
          $set: {
            'engagementMetrics.contributions': { $add: ['$engagementMetrics.contributions', 1] },
            'engagementMetrics.trustScore': {
              $min: [{ $add: ['$engagementMetrics.trustScore', 10] }, 100]
            }
          }
        }
      ]);
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get AI suggestions for a specific request (for helpers)
router.get('/:id/ai-suggestions', auth, async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Re-analyze or return existing AI metadata
    const { sentiment, sentimentScore } = analyzeSentiment(request.title, request.description);
    const suggestedCategory = suggestCategory(request.title, request.description);
    const suggestedPriority = suggestPriority(request.title, request.description, sentiment);
    const tags = generateTags(request.title, request.description, request.category);
    const suggestedResponse = generateSuggestedResponse(request.title, request.description, request.category, sentiment);

    res.json({
      sentiment,
      sentimentScore,
      suggestedCategory,
      suggestedPriority,
      tags,
      suggestedResponse,
      insights: request.aiMetadata.insights
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a request
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await HelpRequest.findOneAndDelete({ _id: req.params.id, requester: req.user });
    if (!item) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
