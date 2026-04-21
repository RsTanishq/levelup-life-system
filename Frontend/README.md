# LevelUp Life System - Frontend

LevelUp Life System is a gamified self-improvement platform inspired by RPG progression systems like Solo Leveling.

Users track real-life activities such as studying, workouts, and habits, and convert them into XP, levels, streaks, achievements, and rewards.

This frontend provides the interactive UI for character progression, quests, guild collaboration, and performance analytics.

---

## Features

### Core Progression System

- Character stats dashboard
- XP progression bar
- Level and rank system
- Streak tracking system
- Skill tree visualization

### Quest Engine

- Daily quest checklist
- Weekly challenges
- Boss battle challenges
- Quest completion animations

### Social Features

- Guild system interface
- Guild leaderboard
- Direct messaging UI
- Friends system
- Progress comparison panel

### Identity System

- Achievement unlock interface
- Title unlock system
- Avatar customization
- Badge display slots
- Character profile panel

### Reward Economy

- Reward store
- Coin tracking
- Merch unlock interface
- Digital badge rewards

### Retention Features

- Seasonal events page
- Event leaderboard
- Notification center
- Activity feed

### Analytics

- Weekly XP charts
- Stat progression graphs
- Streak performance tracking

---

## Tech Stack

Frontend built using:

- React (Vite)
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router

---

## Folder Structure

```text
src/
|
|-- components/
|   |-- stats/
|   |-- quests/
|   |-- guild/
|   |-- rewards/
|   |-- achievements/
|   `-- ui/
|
|-- pages/
|   |-- Dashboard.jsx
|   |-- Quests.jsx
|   |-- SkillTree.jsx
|   |-- BossBattles.jsx
|   |-- Rewards.jsx
|   |-- Guild.jsx
|   |-- Messages.jsx
|   |-- Achievements.jsx
|   |-- Events.jsx
|   `-- Profile.jsx
|
|-- services/
|   `-- api.js
|
|-- context/
|   `-- AuthContext.jsx
|
|-- hooks/
|
|-- utils/
|
`-- App.jsx
```

---

## Installation

Clone repository:

```bash
git clone <repo-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

App runs on:

```text
http://localhost:5173
```

---

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

This connects frontend to backend server.

---

## Pages Overview

| Page | Description |
|------|-------------|
| Dashboard | Character stats, XP bar, streak widget |
| Quests | Daily and weekly missions |
| Skill Tree | Unlockable progression paths |
| Boss Battles | Weekly challenge system |
| Rewards | Unlock badges, themes, merch |
| Guild | Team progress and leaderboard |
| Messages | Direct and guild chat |
| Achievements | Badge progression tracking |
| Events | Seasonal challenges |
| Profile | Avatar and identity customization |

---

## UI Design Philosophy

The interface is designed as a **Life Operating System** instead of a traditional productivity dashboard.

Inspired by:

- RPG character stat panels
- Solo Leveling system UI
- Gamified learning platforms

Key UI elements include:

- Glowing stat cards
- Animated level-up overlays
- Holographic notifications
- Progress-based unlock panels

---

## Future Improvements

Upcoming enhancements:

- Real-time chat using Socket.io
- AI habit recommendation engine
- Mobile version (React Native)
- Leaderboard filtering
- Guild mission tracking UI

---

## Backend Repository

Backend handles:

- Authentication
- XP engine
- Streak logic
- Rewards validation
- Guild progression
- Achievements unlocking

Backend repo:

`<backend-repo-link>`

---

## Author

Developed by:

**Tanishq Bhartwal**

Full-stack developer focused on AI-driven productivity systems and gamified user experiences.
