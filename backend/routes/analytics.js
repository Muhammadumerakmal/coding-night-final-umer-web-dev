import express from 'express';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics overview
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Total tickets
    const totalTickets = await HelpRequest.countDocuments(dateFilter);

    // Tickets by status
    const ticketsByStatus = await HelpRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Tickets by priority
    const ticketsByPriority = await HelpRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$urgencyLevel', count: { $sum: 1 } } }
    ]);

    // Tickets by category
    const ticketsByCategory = await HelpRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Average resolution time (for completed tickets)
    const resolutionTimeData = await HelpRequest.aggregate([
      {
        $match: {
          ...dateFilter,
          status: 'Completed',
          completedAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionTime: {
            $divide: [
              { $subtract: ['$completedAt', '$createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: '$resolutionTime' },
          minResolutionTime: { $min: '$resolutionTime' },
          maxResolutionTime: { $max: '$resolutionTime' }
        }
      }
    ]);

    // Sentiment distribution
    const sentimentDistribution = await HelpRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$aiMetadata.sentiment', count: { $sum: 1 } } }
    ]);

    // Active helpers count
    const activeHelpers = await HelpRequest.distinct('helper', {
      ...dateFilter,
      helper: { $exists: true, $ne: null }
    });

    res.json({
      totalTickets,
      ticketsByStatus: ticketsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ticketsByPriority: ticketsByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ticketsByCategory: ticketsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      averageResolutionTime: resolutionTimeData[0] || {
        avgResolutionTime: 0,
        minResolutionTime: 0,
        maxResolutionTime: 0
      },
      sentimentDistribution: sentimentDistribution.reduce((acc, item) => {
        acc[item._id || 'Unknown'] = item.count;
        return acc;
      }, {}),
      activeHelpersCount: activeHelpers.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ticket volume over time (daily breakdown)
router.get('/ticket-volume', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const volumeData = await HelpRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(volumeData.map(item => ({
      date: item._id,
      count: item.count
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get resolution time trends
router.get('/resolution-trends', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await HelpRequest.aggregate([
      {
        $match: {
          status: 'Completed',
          completedAt: { $exists: true, $gte: startDate }
        }
      },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          resolutionTime: {
            $divide: [
              { $subtract: ['$completedAt', '$createdAt'] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: '$date',
          avgResolutionTime: { $avg: '$resolutionTime' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trends.map(item => ({
      date: item._id,
      avgResolutionTime: item.avgResolutionTime,
      ticketsResolved: item.count
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sentiment analysis over time
router.get('/sentiment-trends', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const sentimentTrends = await HelpRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            sentiment: '$aiMetadata.sentiment'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json(sentimentTrends.map(item => ({
      date: item._id.date,
      sentiment: item._id.sentiment || 'Unknown',
      count: item.count
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top performers (helpers with most resolved tickets)
router.get('/top-performers', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topPerformers = await HelpRequest.aggregate([
      {
        $match: {
          status: 'Completed',
          helper: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$helper',
          ticketsResolved: { $sum: 1 },
          avgResolutionTime: {
            $avg: {
              $divide: [
                { $subtract: ['$completedAt', '$createdAt'] },
                1000 * 60 * 60
              ]
            }
          }
        }
      },
      { $sort: { ticketsResolved: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'helperInfo'
        }
      },
      { $unwind: '$helperInfo' },
      {
        $project: {
          helperId: '$_id',
          username: '$helperInfo.username',
          ticketsResolved: 1,
          avgResolutionTime: 1,
          trustScore: '$helperInfo.engagementMetrics.trustScore'
        }
      }
    ]);

    res.json(topPerformers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get category performance metrics
router.get('/category-performance', auth, async (req, res) => {
  try {
    const categoryMetrics = await HelpRequest.aggregate([
      {
        $group: {
          _id: '$category',
          totalTickets: { $sum: 1 },
          completedTickets: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'Completed'] },
                {
                  $divide: [
                    { $subtract: ['$completedAt', '$createdAt'] },
                    1000 * 60 * 60
                  ]
                },
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          totalTickets: 1,
          completedTickets: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedTickets', '$totalTickets'] },
              100
            ]
          },
          avgResolutionTime: 1
        }
      },
      { $sort: { totalTickets: -1 } }
    ]);

    res.json(categoryMetrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
