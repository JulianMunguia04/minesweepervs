# MinesweeperVs

**MinesweeperVs** is an exciting multiplayer spin on the classic Minesweeper game. Players compete head-to-head in real time, using unique power-ups and strategic moves to outsmart their opponent. Matches are point-based and time-driven, rewarding both speed and accuracy. Beyond the gameplay, MinesweeperVs includes a rich social experience: challenge friends, climb global and friends-only leaderboards, and track your progress and ranking over time.

---

## 🧰 Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white&style=for-the-badge)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white&style=for-the-badge)
![Google Auth](https://img.shields.io/badge/Google%20Auth-4285F4?logo=google&logoColor=white&style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white&style=for-the-badge)
![bcrypt](https://img.shields.io/badge/bcrypt-3388FF?logo=lock&logoColor=white&style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge)

---

## 🛠️ Local Setup

Redis Download
https://github.com/microsoftarchive/redis/releases?utm_source=chatgpt.com

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/minesweepervs.git
cd minesweepervs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the root of your project and add the following:

```env
PG_HOST
PG_PORT
PG_PASSWORD
PG_DATABASE
JWT_SECRET

FRONTENDURL
NEXT_PUBLIC_API_URL

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

REDIS_URL
```

### 4. Start server: next.js + server to handle socket connections

```bash
npm run devStart
# or
yarn devStart
# or
pnpm devStart
# or
bun devStart
```

### 5. Open the app

Visit:

```
http://localhost:3000
```


