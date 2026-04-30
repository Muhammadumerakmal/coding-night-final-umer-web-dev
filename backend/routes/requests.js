import express from 'express';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { validateHelpRequest, validateUpdateRequest, sanitizeInput } from '../middleware/validation.js';

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

// AI Helper Functions
function analyzeSentiment(title, description) {
  const text = (title + ' ' + description).toLowerCase();

  // Negative sentiment indicators
  const negativeWords = ['urgent', 'critical', 'broken', 'error', 'crash', 'fail', 'bug', 'issue', 'problem', 'help', 'stuck', 'frustrated', 'not working', 'please help'];
  const urgentWords = ['asap', 'immediately', 'urgent', 'critical', 'emergency', 'now'];
  const positiveWords = ['thanks', 'appreciate', 'great', 'awesome', 'working', 'solved'];

  let score = 0;
  let sentiment = 'Neutral';

  // Count sentiment indicators
  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 0.1;
  });

  urgentWords.forEach(word => {
    if (text.includes(word)) {
      score -= 0.2;
      sentiment = 'Urgent';
    }
  });

  positiveWords.forEach(word => {
    if (text.includes(word)) score += 0.1;
  });

  // Determine sentiment
  if (sentiment !== 'Urgent') {
    if (score < -0.3) sentiment = 'Negative';
    else if (score > 0.1) sentiment = 'Positive';
    else sentiment = 'Neutral';
  }

  return { sentiment, sentimentScore: Math.max(-1, Math.min(1, score)) };
}

function suggestCategory(title, description) {
  const text = (title + ' ' + description).toLowerCase();

  const categoryKeywords = {
    'Technical Support': ['bug', 'error', 'crash', 'not working', 'broken', 'issue', 'problem'],
    'Development': ['code', 'function', 'api', 'database', 'backend', 'frontend', 'react', 'node'],
    'Design': ['ui', 'ux', 'design', 'layout', 'css', 'style', 'interface'],
    'Documentation': ['docs', 'documentation', 'guide', 'tutorial', 'readme'],
    'General': []
  };

  let bestMatch = 'General';
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category;
    }
  }

  return bestMatch;
}

function suggestPriority(title, description, sentiment) {
  const text = (title + ' ' + description).toLowerCase();

  const criticalWords = ['critical', 'emergency', 'production', 'down', 'crash', 'data loss'];
  const highWords = ['urgent', 'asap', 'immediately', 'broken', 'not working'];

  if (criticalWords.some(word => text.includes(word))) return 'Critical';
  if (highWords.some(word => text.includes(word)) || sentiment === 'Urgent') return 'High';
  if (sentiment === 'Negative') return 'Medium';

  return 'Low';
}

function generateTags(title, description, category) {
  const text = (title + ' ' + description).toLowerCase();
  const tags = [category.toLowerCase()];

  const techTags = {
    'react': ['react', 'jsx', 'component'],
    'node': ['node', 'nodejs', 'express'],
    'database': ['database', 'sql', 'mongodb', 'postgres'],
    'api': ['api', 'rest', 'endpoint'],
    'frontend': ['frontend', 'ui', 'css', 'html'],
    'backend': ['backend', 'server'],
    'debugging': ['bug', 'error', 'debug', 'issue'],
    'performance': ['slow', 'performance', 'optimization'],
    'security': ['security', 'auth', 'authentication', 'authorization']
  };

  for (const [tag, keywords] of Object.entries(techTags)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  }

  return [...new Set(tags)];
}

function generateSuggestedResponse(title, description, category, sentiment) {
  let response = `Thank you for reaching out! `;

  if (sentiment === 'Urgent' || sentiment === 'Negative') {
    response += `I understand this is causing frustration. `;
  }

  response += `I'd be happy to help with your ${category.toLowerCase()} issue. `;

  const text = (title + ' ' + description).toLowerCase();

  if (text.includes('error') || text.includes('bug')) {
    response += `Could you please share:\n- The exact error message you're seeing\n- Steps to reproduce the issue\n- Your environment (browser/OS/versions)\n\nThis will help me diagnose the problem quickly.`;
  } else if (text.includes('how to') || text.includes('how do')) {
    response += `I can guide you through this. Let me know if you need step-by-step instructions or code examples.`;
  } else {
    response += `Could you provide more details about what you're trying to accomplish? This will help me give you the best solution.`;
  }

  return response;
}

// Create a request
router.post('/', auth, sanitizeInput, validateHelpRequest, async (req, res) => {
  try {
    const { title, description, category, urgencyLevel, aiSuggestedTags } = req.body;

    // AI Sentiment Analysis
    const { sentiment, sentimentScore } = analyzeSentiment(title, description);

    // AI Category Suggestion (if not provided or to validate)
    const suggestedCategory = suggestCategory(title, description);

    // AI Priority Suggestion
    const suggestedPriority = suggestPriority(title, description, sentiment);

    // AI Tag Generation
    let tags = aiSuggestedTags || generateTags(title, description, category || suggestedCategory);

    // AI Insights
    let insight = "Standard request.";
    if (sentiment === 'Urgent') {
      insight = `⚠️ Urgent request detected. User appears to need immediate assistance with ${category || suggestedCategory}.`;
    } else if (sentiment === 'Negative') {
      insight = `User is experiencing frustration. Quick response recommended for ${category || suggestedCategory} issue.`;
    } else if (sentimentScore > 0) {
      insight = `Positive tone detected. User is seeking guidance on ${category || suggestedCategory}.`;
    }

    // AI Suggested Response for helpers
    const suggestedResponse = generateSuggestedResponse(title, description, category || suggestedCategory, sentiment);

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
