import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Closed'],
    default: 'Open',
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  aiMetadata: {
    tags: {
      type: [String],
      default: [],
    },
    insights: {
      type: String,
    },
    autoCategory: {
      type: String,
    },
    autoUrgency: {
      type: String,
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative', 'Urgent'],
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
    },
    suggestedResponse: {
      type: String,
    },
  },
  completedAt: {
    type: Date,
  },
}, { timestamps: true });

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
export default HelpRequest;
