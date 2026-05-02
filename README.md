# Helplytics AI - Community Support Platform

A modern, AI-powered community support platform built for SMIT Grand Coding Night 2026.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker Desktop (for MongoDB)

### 1. Start Docker Desktop
Open Docker Desktop and wait for it to fully start.

### 2. Start MongoDB
```bash
cd backend
docker-compose up -d
```

### 3. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:5000

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

Visit http://localhost:3000 to access the application.

## 🤖 AI Features

This project uses **real OpenAI API integration** for:
- **Sentiment Analysis** - Detects emotional tone (Positive/Neutral/Negative/Urgent)
- **Auto-Categorization** - Suggests appropriate categories
- **Priority Detection** - Recommends urgency levels
- **Tag Generation** - Creates relevant tags automatically
- **Response Suggestions** - Generates helper response templates
- **Insights** - Provides request summaries

All AI features have fallback mechanisms for reliability.

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and troubleshooting guide
- **[backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - API endpoints reference
- **[frontend/PROJECT_STATUS.md](./frontend/PROJECT_STATUS.md)** - Feature implementation status

## 🎯 Key Features

- JWT-based authentication
- Role-based dashboards (Need Help / Can Help / Both)
- AI-powered request analysis
- Trust score and badge system
- Community leaderboard
- Real-time filtering and search
- Responsive design (mobile-first)

## 🛠️ Tech Stack

**Frontend:** Next.js 16, React 19, Tailwind CSS v4, TypeScript  
**Backend:** Express 5, MongoDB, Mongoose, JWT  
**AI:** OpenAI API (GPT-4o-mini)  
**Infrastructure:** Docker, Docker Compose

## 📦 Project Structure

```
├── backend/          # Express API server
├── frontend/         # Next.js application
├── .env              # Backend environment variables
└── SETUP_GUIDE.md    # Detailed setup instructions
```

## 🏆 Status

✅ **COMPLETE AND READY FOR DEMO**

All core features implemented with real AI integration.

---

*Built for SMIT Grand Coding Night 2026*
