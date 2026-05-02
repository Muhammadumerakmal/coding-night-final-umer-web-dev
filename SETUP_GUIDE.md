# Helplytics AI - Complete Setup Guide

## 🎯 Project Overview

Helplytics AI is a community support platform built for SMIT Grand Coding Night 2026. It features AI-powered request analysis, sentiment detection, smart categorization, and community engagement tools.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or higher)
- **Docker Desktop** (for MongoDB)
- **Git** (for version control)

---

## 🚀 Quick Start

### Step 1: Start Docker Desktop

1. Open **Docker Desktop** application
2. Wait for Docker to fully start (the whale icon should be stable)
3. Verify Docker is running:
   ```bash
   docker --version
   ```

### Step 2: Start MongoDB

Navigate to the backend directory and start MongoDB using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start:
- **MongoDB** on port `27018`
- **Mongo Express** (database UI) on port `8082`

Verify MongoDB is running:
```bash
docker ps
```

You should see containers named `coding-night-final` and `smit-final`.

### Step 3: Start Backend Server

In the `backend` directory:

```bash
npm install  # If not already installed
npm run dev
```

The backend will start on **http://localhost:5000**

Check the health endpoint:
```bash
curl http://localhost:5000/health
```

You should see `"mongodb": "connected"` in the response.

### Step 4: Start Frontend Application

Open a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install  # If not already installed
npm run dev
```

The frontend will start on **http://localhost:3000**

### Step 5: Access the Application

Open your browser and visit:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Mongo Express:** http://localhost:8082

---

## 🔑 Environment Variables

### Backend (.env in root directory)

```env
MONGODB_URL=mongodb://umerroot:umer123@127.0.0.1:27018/smit_final_db?authSource=admin
JWT_SECRET=125
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (.env.local in frontend directory)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

---

## 🤖 AI Features

The application now uses **real OpenAI API integration** for:

### 1. Sentiment Analysis
- Analyzes request title and description
- Classifies as: Positive, Neutral, Negative, or Urgent
- Provides sentiment score (-1 to 1)

### 2. Auto-Categorization
- Suggests appropriate category based on content
- Categories: Technical Support, Development, Design, Documentation, General

### 3. Priority Detection
- Recommends urgency level: Low, Medium, High, Critical
- Based on keywords, sentiment, and context

### 4. Tag Generation
- Automatically generates 3-6 relevant tags
- Technology-specific tags (react, node, api, etc.)

### 5. Response Suggestions
- Generates empathetic response templates for helpers
- Contextual based on sentiment and category

### 6. Insights Generation
- Provides brief summaries and key highlights
- Helps helpers understand requests quickly

**Fallback Mechanism:** If OpenAI API fails, the system automatically falls back to keyword-based analysis to ensure uninterrupted service.

---

## 📱 User Journey

### For New Users

1. **Visit Homepage** - http://localhost:3000
2. **Register** - Click "Join the platform" or "Open product demo"
3. **Complete Onboarding:**
   - Step 1: Enter name, location, choose role (Need Help/Can Help/Both)
   - Step 2: Add skills and interests
   - Step 3: Review AI-generated profile suggestions
4. **Access Dashboard** - View personalized content based on your role

### For Help Seekers (Need Help)

1. **Create Request:**
   - Click "Post Request" from dashboard
   - Fill in title, description, category, urgency
   - AI automatically analyzes and suggests improvements
   - Apply AI suggestions with one click
2. **Track Progress:**
   - View your requests on dashboard
   - Get notified when helpers offer assistance
   - Mark requests as solved when complete

### For Helpers (Can Help)

1. **Browse Requests:**
   - Visit Explore page
   - Filter by category, urgency, skills, location
   - Search for specific topics
2. **Offer Help:**
   - Click on a request to view details
   - Review AI-generated insights and suggestions
   - Click "Offer Help" to get assigned
3. **Build Reputation:**
   - Earn trust score for solved requests
   - Unlock badges for achievements
   - Climb the leaderboard

---

## 🎨 Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Hero section, featured requests, statistics |
| Auth | `/auth` | Login and registration |
| Onboarding | `/onboarding` | 3-step profile setup |
| Dashboard | `/dashboard` | Personalized home with metrics |
| Explore | `/explore` | Browse and filter all requests |
| Request Detail | `/requests/[id]` | Full request information |
| Create Request | `/requests/create` | Post new help request |
| Leaderboard | `/leaderboard` | Top helpers ranking |
| AI Center | `/ai-center` | Analytics and trends |
| Profile | `/profile` | View and edit profile |
| Messages | `/messages` | Communication (UI only) |
| Notifications | `/notifications` | Activity feed (UI only) |

---

## 🔧 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27018`

**Solution:**
1. Check if Docker Desktop is running
2. Start MongoDB containers:
   ```bash
   cd backend
   docker-compose up -d
   ```
3. Verify containers are running:
   ```bash
   docker ps
   ```

### Backend Server Won't Start

**Error:** `JWT_SECRET is not defined`

**Solution:**
1. Ensure `.env` file exists in the root directory
2. Check that all environment variables are set
3. Restart the backend server

### Frontend Build Errors

**Error:** Type errors or build failures

**Solution:**
1. Clear Next.js cache:
   ```bash
   cd frontend
   rm -rf .next
   npm run build
   ```
2. Reinstall dependencies if needed:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### OpenAI API Errors

**Error:** `AI Sentiment Analysis Error: ...`

**Solution:**
- The system automatically falls back to keyword-based analysis
- Check if `OPENAI_API_KEY` is valid in `.env`
- Verify API key has sufficient credits
- The application will continue working with fallback logic

---

## 🧪 Testing the Application

### 1. Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test AI Features
Create a request and observe AI analysis:
- Sentiment detection
- Category suggestion
- Priority recommendation
- Tag generation
- Response template

### 3. Test Complete Flow
1. Register → Onboarding → Dashboard
2. Create a help request with AI suggestions
3. Browse requests in Explore page
4. Offer help on a request
5. Mark request as solved
6. Check leaderboard for updated rankings

---

## 📊 Database Access

### Mongo Express UI
- **URL:** http://localhost:8082
- **Username:** `umerroot`
- **Password:** `umer123`

### Collections
- `users` - User accounts and profiles
- `helprequests` - Help requests with AI metadata

---

## 🛑 Stopping Services

### Stop Backend
Press `Ctrl+C` in the backend terminal

### Stop Frontend
Press `Ctrl+C` in the frontend terminal

### Stop MongoDB
```bash
cd backend
docker-compose down
```

To remove volumes (delete all data):
```bash
docker-compose down -v
```

---

## 📦 Project Structure

```
coding-night-final-umer/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, validation
│   ├── services/         # AI service (OpenAI)
│   ├── index.js          # Server entry point
│   ├── docker-compose.yml
│   └── package.json
├── frontend/
│   ├── app/              # Next.js pages
│   ├── lib/              # API client, context
│   ├── public/           # Static assets
│   └── package.json
├── .env                  # Backend environment variables
└── README.md
```

---

## 🎯 Grand Coding Night Requirements

✅ **Multi-page application** - 12 pages implemented  
✅ **Authentication system** - JWT-based with protected routes  
✅ **Database integration** - MongoDB with Mongoose  
✅ **Real AI features** - OpenAI API integration with fallback  
✅ **Community features** - Trust scores, badges, leaderboard  
✅ **Premium UI/UX** - Modern design with Tailwind CSS  
✅ **Responsive design** - Mobile-first approach  
✅ **API architecture** - RESTful API with Express  
✅ **Error handling** - Comprehensive error handling  
✅ **Documentation** - Complete setup and API docs  

---

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `API_DOCUMENTATION.md` in the backend folder
3. Check `PROJECT_STATUS.md` in the frontend folder

---

## 🏆 Project Status

**Status:** ✅ COMPLETE AND READY FOR DEMO

All core features are implemented and tested. The application is production-ready with real AI integration and comprehensive error handling.

---

*Built for SMIT Grand Coding Night 2026*
