# Helplytics AI - Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🆕 Analytics Endpoints

### GET `/analytics/dashboard`
Get comprehensive dashboard analytics overview.

**Query Parameters:**
- `startDate` (optional): Filter from date (ISO format)
- `endDate` (optional): Filter to date (ISO format)

**Response:**
```json
{
  "totalTickets": 150,
  "ticketsByStatus": {
    "Open": 45,
    "In Progress": 30,
    "Completed": 70,
    "Closed": 5
  },
  "ticketsByPriority": {
    "Low": 20,
    "Medium": 60,
    "High": 50,
    "Critical": 20
  },
  "ticketsByCategory": {
    "Technical Support": 80,
    "Development": 40,
    "Design": 20,
    "General": 10
  },
  "averageResolutionTime": {
    "avgResolutionTime": 24.5,
    "minResolutionTime": 2.3,
    "maxResolutionTime": 120.0
  },
  "sentimentDistribution": {
    "Positive": 30,
    "Neutral": 80,
    "Negative": 25,
    "Urgent": 15
  },
  "activeHelpersCount": 12
}
```

### GET `/analytics/ticket-volume`
Get ticket volume over time (daily breakdown).

**Query Parameters:**
- `days` (optional, default: 30): Number of days to look back

**Response:**
```json
[
  {
    "date": "2026-04-01",
    "count": 15
  },
  {
    "date": "2026-04-02",
    "count": 22
  }
]
```

### GET `/analytics/resolution-trends`
Get resolution time trends over time.

**Query Parameters:**
- `days` (optional, default: 30): Number of days to look back

**Response:**
```json
[
  {
    "date": "2026-04-01",
    "avgResolutionTime": 18.5,
    "ticketsResolved": 8
  }
]
```

### GET `/analytics/sentiment-trends`
Get sentiment analysis trends over time.

**Query Parameters:**
- `days` (optional, default: 30): Number of days to look back

**Response:**
```json
[
  {
    "date": "2026-04-01",
    "sentiment": "Positive",
    "count": 5
  },
  {
    "date": "2026-04-01",
    "sentiment": "Negative",
    "count": 3
  }
]
```

### GET `/analytics/top-performers`
Get top performing helpers by tickets resolved.

**Query Parameters:**
- `limit` (optional, default: 10): Number of top performers to return

**Response:**
```json
[
  {
    "helperId": "507f1f77bcf86cd799439011",
    "username": "john_helper",
    "ticketsResolved": 45,
    "avgResolutionTime": 12.5,
    "trustScore": 85
  }
]
```

### GET `/analytics/category-performance`
Get performance metrics by category.

**Response:**
```json
[
  {
    "category": "Technical Support",
    "totalTickets": 80,
    "completedTickets": 65,
    "completionRate": 81.25,
    "avgResolutionTime": 15.3
  }
]
```

---

## 🆕 Enhanced AI Features

### POST `/requests`
Create a new help request with AI-powered analysis.

**Request Body:**
```json
{
  "title": "React app crashing on production",
  "description": "My React application keeps crashing when users try to submit the form. This is urgent!",
  "category": "Technical Support",
  "urgencyLevel": "High"
}
```

**AI Features Applied:**
- ✅ Sentiment Analysis (Positive/Neutral/Negative/Urgent)
- ✅ Auto-categorization suggestion
- ✅ Priority/urgency suggestion
- ✅ Automatic tag generation
- ✅ AI insights generation
- ✅ Suggested response for helpers

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "React app crashing on production",
  "description": "My React application keeps crashing...",
  "category": "Technical Support",
  "urgencyLevel": "High",
  "status": "Open",
  "requester": {...},
  "aiMetadata": {
    "tags": ["technical support", "react", "debugging", "frontend"],
    "insights": "⚠️ Urgent request detected. User appears to need immediate assistance with Technical Support.",
    "autoCategory": "Development",
    "autoUrgency": "High",
    "sentiment": "Urgent",
    "sentimentScore": -0.4,
    "suggestedResponse": "Thank you for reaching out! I understand this is causing frustration. I'd be happy to help with your technical support issue. Could you please share:\n- The exact error message you're seeing\n- Steps to reproduce the issue\n- Your environment (browser/OS/versions)\n\nThis will help me diagnose the problem quickly."
  },
  "createdAt": "2026-04-30T10:00:00.000Z",
  "updatedAt": "2026-04-30T10:00:00.000Z"
}
```

### GET `/requests/:id/ai-suggestions`
Get AI-powered suggestions for a specific request (useful for helpers).

**Response:**
```json
{
  "sentiment": "Urgent",
  "sentimentScore": -0.4,
  "suggestedCategory": "Development",
  "suggestedPriority": "High",
  "tags": ["technical support", "react", "debugging", "frontend"],
  "suggestedResponse": "Thank you for reaching out! I understand this is causing frustration...",
  "insights": "⚠️ Urgent request detected. User appears to need immediate assistance with Technical Support."
}
```

---

## Existing Endpoints

### Authentication

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/auth/me`
Get current authenticated user profile.

#### PUT `/auth/profile`
Update user support role.

**Request Body:**
```json
{
  "supportRole": "Can Help"
}
```

### Help Requests

#### GET `/requests`
Get help requests (filtered by user role and query params).

**Query Parameters:**
- `status`: Filter by status (Open, In Progress, Completed, Closed)
- `category`: Filter by category
- `urgency`: Filter by urgency level
- `search`: Search in title and description

#### GET `/requests/:id`
Get a single help request by ID.

#### PUT `/requests/:id`
Update a help request (requester only).

#### POST `/requests/:id/offer-help`
Offer help on a request (marks as In Progress, assigns helper).

#### POST `/requests/:id/solve`
Mark request as solved (requester only, updates helper's trust score).

#### DELETE `/requests/:id`
Delete a help request (requester only).

### Users

#### GET `/users/me`
Get current user profile.

#### PUT `/users/me`
Update user profile.

#### GET `/users/leaderboard`
Get top users by trust score and contributions.

#### GET `/users/:id`
Get specific user profile by ID.

---

## AI Features Summary

### 1. Sentiment Analysis
Analyzes ticket title and description to determine emotional tone:
- **Positive**: Appreciative, constructive requests
- **Neutral**: Standard information requests
- **Negative**: Frustrated users, problems reported
- **Urgent**: Critical issues requiring immediate attention

### 2. Auto-Categorization
Suggests appropriate category based on content keywords:
- Technical Support
- Development
- Design
- Documentation
- General

### 3. Priority Suggestion
Recommends urgency level based on:
- Keyword analysis (critical, urgent, emergency)
- Sentiment analysis results
- Context clues

### 4. Tag Generation
Automatically generates relevant tags:
- Technology tags (react, node, database, api)
- Issue type tags (debugging, performance, security)
- Domain tags (frontend, backend)

### 5. Response Suggestions
Generates contextual response templates for helpers based on:
- Request sentiment
- Category
- Issue type (error, how-to, general)

---

## Environment Variables Required

```env
PORT=5000
MONGODB_URL=mongodb://...
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error
