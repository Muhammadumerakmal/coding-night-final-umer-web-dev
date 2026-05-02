# 🚀 Helplytics AI - Complete Setup Guide

## Quick Start (3 Steps)

### Step 1: Start Docker Desktop
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon should be steady)

### Step 2: Start MongoDB
```bash
cd E:\coding-night-final-umer\backend
docker-compose up -d
```

Verify it's running:
```bash
docker ps
```
You should see: `coding-night-final` container running

### Step 3: Start Backend & Frontend
```bash
# Terminal 1 - Backend
cd E:\coding-night-final-umer\backend
npm run dev

# Terminal 2 - Frontend  
cd E:\coding-night-final-umer\frontend
npm run dev
```

Open: http://localhost:3000

---

## 🎯 What to Test

### 1. Authentication Flow
- Register new account
- Login with credentials
- Complete 3-step onboarding

### 2. Create Help Request
- Click "Post a Request"
- Fill title: "Need help with React hooks"
- Fill description: "I'm stuck with useEffect"
- Click "Analyze with AI" (see AI suggestions)
- Publish request

### 3. Helper Flow
- Register second account (different email)
- Choose "Can Help" role
- Go to Explore page
- Find the request
- Click "I can help"

### 4. Complete Request
- Login as first user
- Go to request detail
- Click "Mark as solved"
- Check leaderboard - helper's score increased!

---

## 🐛 Common Issues

### Issue: MongoDB won't start
**Error:** `connect ECONNREFUSED 127.0.0.1:27018`

**Fix:**
```bash
# Check Docker Desktop is running
docker ps

# Restart MongoDB
cd backend
docker-compose down
docker-compose up -d
```

### Issue: Port 5000 already in use
**Fix:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID)
taskkill /PID <PID> /F
```

### Issue: Frontend won't build
**Fix:**
```bash
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Project Features

### ✅ Fully Implemented
- User authentication (JWT)
- Role-based onboarding
- Help request CRUD
- AI analysis (6 features)
- Trust score system
- Leaderboard
- Analytics dashboard
- Responsive UI

### 🎨 UI Pages (12 total)
1. Landing page
2. Auth (login/register)
3. Onboarding (3 steps)
4. Dashboard
5. Explore (with filters)
6. Create request
7. Request detail
8. Profile
9. Leaderboard
10. Messages
11. Notifications
12. AI Center

---

## 🔧 Environment Variables

Already configured in `.env`:
```env
MONGODB_URL=mongodb://umerroot:umer123@127.0.0.1:27018/smit_final_db?authSource=admin
JWT_SECRET=125
PORT=5000
OPENAI_API_KEY=sk-proj-...
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build  # Test build
vercel deploy --prod
```

### Backend (Railway)
1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy!

---

## 📞 Need Help?

Check these files:
- `PROJECT_STATUS.md` - Complete feature list
- `backend/API_DOCUMENTATION.md` - API reference
- Browser console - Frontend errors
- Backend terminal - Server logs

---

**Ready to demo? Start Docker Desktop and run the 3 commands above!** 🎉
