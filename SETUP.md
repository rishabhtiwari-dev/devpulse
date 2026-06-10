# DevPulse — Setup Guide

## Step 1 — Install dependencies

Open two terminals.

**Terminal 1 (backend):**
```
cd devpulse/backend
npm install
```

**Terminal 2 (frontend):**
```
cd devpulse/frontend
npm install
```

## Step 2 — Add your API keys

Edit `backend/.env`:

```
OPENAI_API_KEY=sk-...     ← get from platform.openai.com
GITHUB_TOKEN=ghp_...      ← get from github.com/settings/tokens (no scopes needed for public repos)
PORT=5000
```

GitHub token is optional — without it you get 60 requests/hour (enough for development).

## Step 3 — Run the project

**Terminal 1:**
```
cd devpulse/backend
npm run dev
```

**Terminal 2:**
```
cd devpulse/frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 4 — Try it

Type any GitHub username (e.g., `torvalds`, `gaearon`, or your own) and click Analyze.

## Project Structure

```
devpulse/
├── backend/
│   ├── server.js              ← Express server entry point
│   ├── routes/
│   │   ├── github.js          ← GitHub API routes (user, repos, languages, activity)
│   │   └── insights.js        ← OpenAI analysis route
│   └── .env                   ← Your API keys (never commit this)
└── frontend/
    └── src/
        ├── App.jsx             ← Main app, search bar, screen routing
        ├── api/client.js       ← Axios API calls
        └── components/
            ├── Sidebar.jsx     ← Left nav
            ├── Dashboard.jsx   ← Stats + top repos
            ├── HeatMap.jsx     ← GitHub-style contribution heatmap
            ├── LanguageChart.jsx ← Pie + bar charts for languages
            └── AIInsights.jsx  ← GPT-4o-mini generated insights
```

## Resume talking points

- Built a full-stack GitHub analytics dashboard with React, Node.js, and OpenAI API
- Integrated GitHub REST API to aggregate user stats, language usage, and commit activity
- Used GPT-4o-mini to generate personalized AI insights from developer activity data
- Rendered interactive data visualizations with Recharts (heatmap, pie chart, bar chart)
