# 🌸 HerHealth — Full-Stack Women's Health App

A complete women's health companion app built with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB Atlas (Cluster)
- **Payment**: Razorpay Gateway
- **Auth**: JWT + bcrypt
- **AI**: Anthropic Claude API (Sakhi AI)

## 📁 Project Structure

```
herhealth/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── layout/        # Navbar, Sidebar, Layout wrappers
│   │   │   ├── auth/          # Login, Register, Onboarding
│   │   │   ├── dashboard/     # Home dashboard widgets
│   │   │   ├── cycle/         # Period tracking components
│   │   │   ├── mood/          # Mood tracker + history
│   │   │   ├── community/     # Forums, support rooms
│   │   │   ├── doctor/        # Doctor finder + booking
│   │   │   ├── diet/          # Meal plans, nutrition
│   │   │   ├── ayurveda/      # Dosha + herbal remedies
│   │   │   ├── remedies/      # Home remedies catalog
│   │   │   ├── insights/      # Charts, analytics
│   │   │   ├── payment/       # Razorpay integration
│   │   │   └── calendar/      # Cycle calendar
│   │   ├── pages/             # Top-level route pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # Auth, Theme, Cycle contexts
│   │   ├── utils/             # Helpers, date functions
│   │   ├── services/          # API service layer (axios)
│   │   └── styles/            # Global CSS + Tailwind config
│   ├── package.json
│   └── vite.config.js
│
└── backend/                   # Node.js + Express API
    ├── routes/                # Auth, cycle, mood, payment, etc.
    ├── models/                # Mongoose schemas
    ├── middleware/            # Auth guard, error handler
    ├── controllers/           # Business logic
    ├── config/                # DB connection, Razorpay config
    ├── utils/                 # Helpers, cycle calculations
    ├── server.js              # Entry point
    └── package.json
```

## 🚀 Setup

### 1. Clone & Install
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Environment Variables

**Backend `.env`**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/herhealth?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. MongoDB Atlas Cluster Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (M0 Free Tier works)
3. Add your IP to the allowlist
4. Create a database user
5. Get the connection string and paste into `MONGODB_URI`

### 4. Razorpay Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Get Test API keys from Settings → API Keys
3. Paste into both `.env` files

### 5. Run
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | JWT login/register with onboarding flow |
| 🩸 Cycle Tracking | Period logging, predictions, calendar |
| 😊 Mood Tracker | 10+ moods with history & trends |
| 🤖 Sakhi AI | Claude-powered health companion |
| 🏥 Doctor Finder | Browse & book consultations |
| 💳 Payments | Razorpay for consultations & premium |
| 🥗 Diet Plans | Phase-based Indian meal plans |
| 🌿 Ayurveda | Dosha quiz, herbal remedies |
| 📊 Insights | Charts, health score, analytics |
| 👥 Community | Support rooms, anonymous posts |
| 📅 Calendar | Visual cycle & fertility calendar |
| 💊 Reminders | Medication & appointment alerts |
