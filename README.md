# CupPulse AI

### Real-time World Cup Insights, AI Predictions & Fan Rewards Powered by Injective

CupPulse AI is a football intelligence platform built for the Injective Global Cup Hackathon. It provides real-time World Cup match insights, AI-powered match predictions, fan engagement rewards, and demonstrates Injective ecosystem integrations in a simple and user-friendly application.

---

## Problem

World Cup fans often need multiple platforms to:

- Track match schedules and scores
- Analyze team performance
- Get match predictions
- Participate in fan engagement activities
- Receive rewards for participation

There is no single platform that combines AI insights, fan rewards, and blockchain-powered experiences.

---

## Solution

CupPulse AI provides:

- Real-time World Cup match dashboard
- AI-powered match predictions
- Fan points and rewards system
- Simulated Injective reward distribution
- Simple and modern user experience

---

## Features

### World Cup Dashboard

- Upcoming matches
- Team information
- Match status
- Live-ready architecture

### AI Match Predictions

Ask questions such as:

```text
Who is likely to win Argentina vs Brazil?
```

Receive:

- Predicted winner
- Confidence score
- AI reasoning

### Fan Rewards

Users can:

- Earn fan points
- Track reward eligibility
- Claim rewards

### Injective Integration

Demonstrates:

- MCP Server concept
- Agent Skills
- x402 premium access concept
- CCTP reward distribution concept

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- TailwindCSS

### Backend

- Next.js API Routes

### AI

- Groq API
- Llama 3.3 70B

### Database

- SQLite
- better-sqlite3

### Football Data

- Football-Data.org API

### Blockchain

- Injective SDK (Demo Integration)

---

## Injective Technology Mapping

| Injective Technology | Usage |
|----------------------|--------|
| MCP Server | AI access to football match data |
| Agent Skills | Match Prediction Agent |
| x402 | Premium AI insights concept |
| CCTP | Cross-chain reward distribution simulation |

---

## Project Structure

```text
cup-pulse-ai/

├── app/
│   ├── dashboard/
│   ├── predictions/
│   ├── rewards/
│   ├── injective/
│   └── api/
│
├── components/
│
├── lib/
│
├── database/
│
├── docs/
│
├── public/
│
└── README.md
```

---

## Architecture

```text
User
 │
 ▼
Next.js Frontend
 │
 ▼
API Routes
 │
 ├── Football Data API
 │
 ├── Groq AI
 │
 ├── SQLite
 │
 └── Injective Integration
        │
        ├── MCP
        ├── Agent Skills
        ├── x402
        └── CCTP
```

---

## Demo Flow

### 1. Open Dashboard

View:

- Upcoming matches
- Match schedules
- Team details

### 2. AI Prediction

Ask:

```text
Who is likely to win France vs England?
```

Receive:

- Winner prediction
- Confidence score
- AI analysis

### 3. Fan Rewards

- View earned points
- Check reward eligibility

### 4. Claim Reward

- Simulate reward distribution
- Generate Injective transaction hash

### 5. Injective Showcase

Explore:

- MCP Server
- Agent Skills
- x402
- CCTP

---

## Environment Variables

Create:

```bash
.env.local
```

Add:

```env
FOOTBALL_API_KEY=your_football_data_api_key
GROQ_API_KEY=your_groq_api_key
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Screenshots

Add screenshots inside:

```text
docs/screenshots/
```

Suggested screenshots:

- Home Page
- Dashboard
- AI Prediction
- Rewards
- Injective Integration

---

## Future Scope

- Live World Cup match updates
- Wallet authentication
- Real Injective transactions
- Real CCTP integration
- Prediction leaderboard
- NFT fan achievements
- Premium AI insights using x402

---

## Built For

### Injective Global Cup Hackathon

CupPulse AI demonstrates how AI, football analytics, fan engagement, and Injective ecosystem technologies can create a modern World Cup experience.

---

## Team

Built with ❤️ for the Injective Global Cup Hackathon.