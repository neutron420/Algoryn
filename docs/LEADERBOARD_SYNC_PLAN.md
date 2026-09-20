# Multi-Platform Coding Leaderboard & Synchronization System

A comprehensive, production-ready system to link, automatically synchronize, score, and rank users across major competitive programming and interview preparation platforms: **LeetCode, Codeforces, CodeChef, GeeksforGeeks, AtCoder, and HackerRank**.

---

## 1. System Architecture

```
                                      [User Profile / Dashboard]
                                                   │
                                                   ▼
                                    [Connect Platforms Interface]
                         (User inputs handles for LC, CF, CC, GFG, AC, HR)
                                                   │
                                                   ▼
                                      POST /api/user/platforms
                                                   │
                                                   ▼
                                    [Unified Sync Orchestrator]
                                  (lib/services/platform-sync.ts)
                                                   │
                ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
                ▼                  ▼                               ▼                  ▼
       [LeetCode Fetcher] [Codeforces Fetcher]           [CodeChef Fetcher]     [GFG / AtCoder / HR]
        - GraphQL API      - Official REST API            - Profile Parser       - Dedicated APIs
        - Solved + Rating  - Submissions + Rating         - Stars + Solved       - Badges + Scores
                └──────────────────┬───────────────────────────────┬──────────────────┘
                                   │
                                   ▼
                       [Score Normalization Engine]
                    - Balanced multi-platform weights
                    - Platform-specific sub-scores
                    - Combined Total Score calculation
                                   │
                                   ▼
                         [Database Updates (Prisma)]
                    ├── UserPlatformAccount (saved credentials & status)
                    ├── UserPlatformStats (detailed solve breakdowns)
                    └── LeaderboardEntry (global ranks, scores, cached stats)
                                   │
                                   ▼
                      [Redis Cache Invalidation & TTL]
                                   │
                                   ▼
                     [Interactive Leaderboard UI]
                    ├── Global Top 3 Podium (Gold, Silver, Bronze)
                    ├── Platform Tab Filtering (Overall, LC, CF, CC, GFG)
                    ├── User Self-Standing Card ("Your Rank: #14")
                    └── Paginated Table with Badges & Real-time Search
```

---

## 2. Supported Platforms & Scraping / API Strategies

| Platform | Protocol / Strategy | Endpoint / Source | Data Extracted |
| :--- | :--- | :--- | :--- |
| **LeetCode** | Public GraphQL | `https://leetcode.com/graphql` | Easy/Med/Hard solved, Contest Rating, Global Ranking, Contests Attended |
| **Codeforces** | Official REST API | `https://codeforces.com/api/user.info` & `user.status` | Rating, Max Rating, Rank Title, Unique Accepted Submissions |
| **CodeChef** | Profile Scraper & Unofficial API | `https://www.codechef.com/users/{handle}` | Global Rank, Stars, Rating, Fully Solved Problems Count |
| **GeeksforGeeks** | Practice Profile API | `https://www.geeksforgeeks.org/user/{handle}/` | Overall Coding Score, Total Solved, Difficulty Breakdown |
| **AtCoder** | Kenkoooo Open API | `https://kenkoooo.com/atcoder/atcoder-api/v3/user/info` | Total Solved (AC count), Contest Rating, Highest Rating |
| **HackerRank** | Public Profile REST API | `https://www.hackerrank.com/rest/hackers/{handle}/` | Badges, Stars in Problem Solving / Algorithms, Scores |

---

## 3. Standardized Scoring & Normalization Formula

To provide an equitable global ranking that rewards both problem-solving volume and contest performance across platforms:

1. **LeetCode Score**:
   $$\text{Score}_{\text{LC}} = (\text{Easy} \times 1) + (\text{Medium} \times 3) + (\text{Hard} \times 5) + \max(0, \lfloor(\text{Rating} - 1200) \times 0.5\rfloor)$$

2. **Codeforces Score**:
   $$\text{Score}_{\text{CF}} = (\text{Unique Solved} \times 4) + \max(0, \lfloor(\text{Rating} - 800) \times 0.6\rfloor)$$

3. **CodeChef Score**:
   $$\text{Score}_{\text{CC}} = (\text{Solved} \times 3) + \max(0, \lfloor(\text{Rating} - 1000) \times 0.5\rfloor)$$

4. **GeeksforGeeks Score**:
   $$\text{Score}_{\text{GFG}} = (\text{Solved} \times 2) + \lfloor\text{CodingScore} \times 0.4\rfloor$$

5. **AtCoder Score**:
   $$\text{Score}_{\text{AC}} = (\text{Accepted} \times 5) + \max(0, \lfloor\text{Rating} \times 0.7\rfloor)$$

6. **HackerRank Score**:
   $$\text{Score}_{\text{HR}} = (\text{Badges} \times 15) + \lfloor\text{EloScore} \times 0.2\rfloor$$

7. **Composite Global Score**:
   $$\text{Total Score} = \text{Score}_{\text{LC}} + \text{Score}_{\text{CF}} + \text{Score}_{\text{CC}} + \text{Score}_{\text{GFG}} + \text{Score}_{\text{AC}} + \text{Score}_{\text{HR}}$$

---

## 4. API Routes Specifications

### 4.1. Link Platform
- **Route**: `POST /api/user/platforms`
- **Body**: `{ userId: string, platform: CodingPlatform, username: string }`
- **Action**: Verifies handle with platform fetcher immediately, saves to `UserPlatformAccount`, creates `UserPlatformStats`, updates `LeaderboardEntry`.

### 4.2. Synchronize Single or All Platforms
- **Route**: `POST /api/user/platforms/sync`
- **Body**: `{ userId: string, platform?: CodingPlatform }`
- **Action**: Checks cooldown (minimum 5 minutes between manual syncs), fetches fresh stats, updates stats and recalculates global rank.

### 4.3. Fetch User Platforms
- **Route**: `GET /api/user/platforms?userId={userId}`
- **Returns**: Array of linked platform accounts with verified status, last synced time, and stats.

### 4.4. Fetch Leaderboard Data
- **Route**: `GET /api/leaderboard?platform={ALL|LEETCODE|...}&page=1&limit=50&search=`
- **Returns**:
  - `topThree`: Top 3 rankers for Podium display.
  - `entries`: Paginated list of users with ranks, scores, solve counts, and platform badges.
  - `userStanding`: Current logged-in user's rank and relative standing.
  - `meta`: Total participants, last global sync timestamp.

---

## 5. User Interface & Experience

1. **Top 3 Podium**:
   - 1st Place: Gold crown, glowing amber border, largest avatar.
   - 2nd Place: Silver medal, slate border.
   - 3rd Place: Bronze medal, amber-brown border.
   - Displays combined score, top platforms, and primary badge.

2. **Multi-Platform Tabs**:
   - `Overall (Combined)` | `LeetCode` | `Codeforces` | `CodeChef` | `GeeksforGeeks` | `AtCoder`
   - Dynamic sorting: Tab switches re-rank by that specific platform's score or total solves!

3. **Current User Sticky Standing Bar**:
   - When logged in, displays user's global rank, distance to next rank, and one-click "Sync Stats" button.

4. **Connect Platforms Dialog**:
   - Responsive modal with input fields for each platform username, auto-detecting invalid handles and displaying instant verify checkmarks.
