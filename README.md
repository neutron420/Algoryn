<div align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logos/algoryn-logo-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="public/logos/algoryn-logo-light.png" />
    <img src="public/logos/algoryn-logo-dark.png" alt="Algoryn Logo" width="280" />
  </picture>

  <p><strong>The Modern Technical Interview Preparation & Developer Community Platform</strong></p>

  <p>
    <a href="https://www.algoryn.me"><strong>Explore Live Platform (algoryn.me)</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="https://github.com/neutron420/Algoryn/issues"><strong>Report Bug</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="https://github.com/neutron420/Algoryn/issues"><strong>Request Feature</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Neon_PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon PostgreSQL" />
    <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
    <img src="https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Auth" />
    <img src="https://img.shields.io/badge/Upstash_Redis-00E599?style=for-the-badge&logo=redis&logoColor=white" alt="Upstash Redis" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>

</div>

---

## About Algoryn

**Algoryn** is a high-performance, company-targeted technical interview preparation platform engineered for software engineers targeting top-tier tech companies. Instead of practicing randomly on disconnected platforms, Algoryn curates **15,000+ verified interview questions** across **690+ companies** categorized into **18 industry verticals** — including FAANG, High-Frequency Trading (HFT), Artificial Intelligence & Machine Learning, FinTech, and Cloud Infrastructure.

Beyond problem curation, Algoryn features an active **Community Hub** with interactive discussions, verified candidate interview experiences, multi-photo posts, threaded replies, and an automated background synchronization engine that keeps user coding stats up to date every minute.

**Production Platform**: [https://www.algoryn.me](https://www.algoryn.me)

---

## Implemented Features (Done Till Date)

### 1. Interactive TakeUForward-Style Curved Tree Sidebar
* **Hierarchical Tree Branch Connectors:** Built-in connecting lines with curved quarter-circle arcs linking parent categories to child navigation items.
* **Collapsible Practice Tracks:** Quick access to structured practice modules:
  * **DSA Track:** Blind 75, NeetCode 150, and Striver A2Z DSA sheet.
  * **SQL Track:** Core database queries, aggregations, window functions, and join patterns.
  * **Aptitude Track:** Quantitative aptitude and logical reasoning problems.
* **Company Preparation Directory:** 690+ companies classified into 18 industry verticals with real-time drill-down search and category problem counters.
* **System Design Tracks:** Dedicated tracks for Low-Level Design (LLD) and High-Level Design (HLD).
* **Profile Footer Card:** Account card featuring user avatar, display name, unclipped email text, and quick sign-out action.

### 2. Company Problem Explorer (690+ Companies)
* **15,000+ Real Interview Questions:** Company-specific questions gathered from actual technical interview loops.
* **18 Industry Categories:** FAANG, Quant / HFT, FinTech, AI & ML, Cloud Infrastructure, Security, E-Commerce, Enterprise SaaS, and more.
* **Multi-Filter Query Engine:** Filter questions in real time by Difficulty (*Easy*, *Medium*, *Hard*), Timeframe (*Last 30 Days*, *3 Months*, *6 Months*, *All Time*), and Topic Tags.
* **Two-Way Bookmark Synchronization:** One-click problem bookmarking with bi-directional URL parameter state (`/dashboard?status=BOOKMARKED`) and cloud database persistence.
* **Solved Tracking:** Persistent problem solved toggling with optimistic UI updates.
* **Direct Platform Links:** Quick navigation to LeetCode, Codeforces, GeeksforGeeks, and HackerRank.

### 3. Community Discussion Board & Forum
* **Mobile-First Collapsible Composer:** Compact 48px composer pill that expands into a full rich-text editor on tap.
* **Rich Markdown Editor & Live Preview:** Full formatting toolbar for bold, italic, code blocks, lists, quotes, and instant live preview tab toggle.
* **LinkedIn-Style Sliding Photo Carousel:**
  * Clean presentation for single images and horizontal sliding gallery for multi-photo uploads (up to 10 photos).
  * Counter badge (`1/5`), navigation arrows, touch-swipe support on mobile, and subtle pagination dots.
  * Full-resolution Lightbox modal on image click with keyboard arrow navigation.
* **Threaded Commenting & Nested Replies:** Multi-level threaded comment discussions with formatting and real-time reply counts.
* **Likes & Bookmarks:** Instant optimistic like counters and discussion bookmarking with a dedicated "Saved" filter.
* **Topic & Category Filtering:** Categorized browsing across *Discussion*, *Study Guide*, *Interview Experience*, *System Design*, *DSA Tips*, *Career*, *Showcase*, and *Events*.

### 4. Interview Experiences Hub
* **Verified Candidate Debriefs:** Real interview experiences categorized by company, role/level, round type, difficulty, and verdict (*Offer*, *Accepted*, *Rejected*, *In Progress*).
* **Pre-Populated Structured Templates:**
  * **Google Full-Loop Template:** OA + 2 Technical Rounds + Complexity and Approach Breakdown.
  * **Amazon Loop Template:** OA + Technical Round + Leadership Principles Preparation.
  * **Blank Post Template:** Clean structured scaffold for customized debriefs.
* **Algoryn Problem Linker:** Search and insert verified Algoryn catalog problems directly into interview round tables with automated difficulty badges.
* **Anonymous Publishing Toggle:** Allows candidates to share detailed salary, round questions, and feedback privately.
* **Detail Experience View:** Upvotes, downvotes, threaded comment discussions, unique view tracking, and related reading recommendations.

### 5. Automated 1-Minute Platform Stats Sync Engine
* **Dedicated Cron Architecture (`cron/`):** Autonomous background scheduler executing every 1 minute without blocking application response cycles.
* **Multi-Platform Handle Discovery:** Automatically detects and validates user profiles across LeetCode, Codeforces, CodeChef, GeeksforGeeks, and HackerRank.
* **Real-Time Stat Ingestion:** Fetches total solved count, easy/medium/hard breakdown, contest ratings, and global rankings.
* **Global Leaderboard Computation:** Automatically recalculates platform-wide ranking scores (`recalculateAllRanks()`) on each cycle.
* **Cache Management:** Invalidates and updates Upstash Redis cache layers automatically.
* **Process Concurrency Lock:** Mutex lock prevents overlapping cron runs; includes graceful shutdown handlers for `SIGINT` and `SIGTERM`.
* **Webhook Trigger (`/api/cron/sync-profiles`):** Secured endpoint with `CRON_SECRET` for free external scheduler triggers (Vercel, cron-job.org).

### 6. Cloud Storage & Media Pipeline
* **Cloudflare R2 Object Storage:** S3-compatible cloud storage for community images and media attachments.
* **Multi-Photo Batch Uploading:** Automated client and server-side file validation for MIME types and file sizes.
* **Zero Egress Fees:** Global CDN distribution via Cloudflare edge network.

### 7. Authentication & Security
* **Firebase Authentication:** Google and GitHub OAuth providers.
* **Automated Profile Sync:** Automatic synchronization of OAuth identities with Neon PostgreSQL user tables.
* **Session Persistence:** 7-day token persistence with secure background token refresh.

### 8. Performance Architecture
* **Multi-Tier Caching:** In-memory LRU cache coupled with Upstash Redis REST API.
* **Hover Prefetching:** Sub-millisecond page transitions and instant category browsing.
* **Next.js 16 Turbopack:** Optimized compilation with minimal runtime overhead.

---

## Roadmap & Upcoming Features

The following features are currently planned and in active development:

- [ ] **In-Browser Code Execution Sandbox:**
  * Embedded Monaco Editor (VS Code engine) with syntax highlighting, auto-complete, and dark mode.
  * Multi-language execution engine (Python, JavaScript, TypeScript, C++, Java, Go) with custom test case runner.
- [ ] **AI Interview Coach & Code Reviewer:**
  * LLM-powered feedback analyzing Big-O time and space complexity.
  * Progressive hints and nudges without revealing full answers.
  * Automated code readability and edge-case validation.
- [ ] **Peer-to-Peer Mock Interviews:**
  * 1-on-1 collaborative mock interview matching between candidates.
  * Integrated WebRTC audio/video calling with synchronized whiteboard and shared code editor.
- [ ] **Application & Interview Pipeline Tracker (Kanban):**
  * Personal interview pipeline manager (*Wishlist* -> *Applied* -> *Online Assessment* -> *Technical Screen* -> *System Design* -> *Offer*).
  * Compensation, notes, and question logging per application.
- [ ] **Global Solver Streaks & Heatmaps:**
  * Daily problem challenges with streak tracking.
  * GitHub-style contribution heatmaps and ranking leaderboards.
- [ ] **Offline-First Progressive Web App (PWA):**
  * Offline question caching for study on the go.
  * Native desktop and mobile home-screen install support.

---

## Tech Stack

<table>
  <tr>
    <th align="center" width="130">Frontend</th>
    <th align="center" width="130">Backend & DB</th>
    <th align="center" width="130">Storage & Cache</th>
    <th align="center" width="130">Auth & Infra</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.simpleicons.org/nextdotjs/white" width="32" /><br /><sub><b>Next.js 16</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="32" /><br /><sub><b>Neon Postgres</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/cloudflare" width="32" /><br /><sub><b>Cloudflare R2</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg" width="32" /><br /><sub><b>Firebase Auth</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="32" /><br /><sub><b>React 19</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" width="32" /><br /><sub><b>Prisma 7 ORM</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/upstash" width="32" /><br /><sub><b>Upstash Redis</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/vercel/white" width="32" /><br /><sub><b>Vercel</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="32" /><br /><sub><b>TypeScript 5</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/bun" width="32" /><br /><sub><b>Bun Runtime</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/amazonwebservices" width="32" /><br /><sub><b>AWS S3 SDK</b></sub>
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/githubactions" width="32" /><br /><sub><b>GitHub Actions CI</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="32" /><br /><sub><b>Tailwind CSS 4</b></sub>
    </td>
    <td align="center" colspan="3">
      <sub><b>UI & Ecosystem:</b> Lucide Icons &middot; Radix UI &middot; Sonner &middot; Motion &middot; Recharts &middot; GSAP</sub>
    </td>
  </tr>
</table>

---

## Database Architecture

```
                                    ┌──────────────────────┐
                                    │       Company        │
                                    └──────────┬───────────┘
                                               │ 1
                                               │
                                               │ *
                                    ┌──────────┴───────────┐
                                    │    CompanyProblem    │
                                    └──────────┬───────────┘
                                               │ *
                                               │
                                               │ 1
┌──────────────────────┐            ┌──────────┴───────────┐            ┌──────────────────────┐
│        Topic         ├────────────┤       Problem        ├────────────┤  UserSolvedProblem   │
└──────────────────────┘ *        * └──────────┬───────────┘ 1        * └──────────┬───────────┘
                                               │ 1                                 │ *
                                               │                                   │
                                               │ *                                 │ 1
                                    ┌──────────┴───────────┐            ┌──────────┴───────────┐
                                    │ UserBookmarkProblem  ├────────────┤         User         │
                                    └──────────────────────┘ *        1 └──────────┬───────────┘
                                                                                   │ 1
                                                                                   │
                 ┌─────────────────────────────────────────────────────────────────┼─────────────────────────┐
                 │ *                                                               │ *                       │ *
      ┌──────────┴───────────┐                                          ┌──────────┴───────────┐  ┌──────────┴───────────┐
      │    DiscussionPost    │                                          │  DiscussionComment   │  │ UserPlatformAccount  │
      └──────────┬───────────┘                                          └──────────────────────┘  └──────────┬───────────┘
                 │ 1                                                                                         │ 1
   ┌─────────────┴─────────────┐                                                                             │
   │ *                         │ *                                                                ┌──────────┴───────────┐
┌──┴───────────────────┐    ┌──┴───────────────────┐                                              │  LeaderboardEntry    │
│    DiscussionLike    │    │  DiscussionBookmark  │                                              └──────────────────────┘
└──────────────────────┘    └──────────────────────┘
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/discussions` | Fetch paginated discussions feed (filterable by category, tag, author, search) |
| `POST` | `/api/discussions` | Create a new community discussion post with photo attachments |
| `GET` | `/api/discussions/[id]` | Get single discussion post details with full comment thread |
| `POST` | `/api/discussions/[id]/like` | Toggle upvote/like on a discussion post |
| `POST` | `/api/discussions/[id]/bookmark` | Toggle save/bookmark on a discussion post |
| `GET` | `/api/discussions/[id]/comments` | Fetch threaded comments for a post |
| `POST` | `/api/discussions/[id]/comments` | Post a new comment or reply to an existing comment |
| `GET` | `/api/discussions/sidebar` | Get trending posts, active categories, and top topic tags |
| `GET` | `/api/interview-experiences` | List verified candidate interview debriefs with filters |
| `POST` | `/api/interview-experiences` | Submit a structured interview experience |
| `GET` | `/api/cron/sync-profiles` | Trigger 1-minute coding platform stats sync (protected by CRON_SECRET) |
| `POST` | `/api/cron/sync-profiles` | POST trigger for automated webhook cron services |
| `POST` | `/api/upload` | Upload photos to Cloudflare R2 bucket (returns public CDN URLs) |
| `GET` | `/api/companies` | List companies by category with problem counts |
| `GET` | `/api/companies/[slug]/problems` | Fetch company questions with difficulty and timeframe filters |
| `GET` | `/api/problems` | Search global problems catalog |
| `POST` | `/api/user/bookmarks` | Sync and fetch user saved problems |
| `POST` | `/api/user/solved` | Mark problem as solved / retrieve solved status |
| `POST` | `/api/auth/sync` | Sync Firebase authenticated user record with PostgreSQL |

---

## Background Profile Sync Cron Engine

Algoryn includes a standalone cron system in the `cron/` directory:

```bash
# Run one-off profile synchronization across all registered users
bun run cron/sync-profiles.cron.ts --once

# Run continuous 1-minute background daemon
bun run cron/sync-profiles.cron.ts
```

For serverless deployments (such as Vercel), external cron schedulers (e.g., [cron-job.org](https://cron-job.org)) can trigger `/api/cron/sync-profiles` every 1 minute with the optional `CRON_SECRET` authorization header.

---

## Quick Start

### Prerequisites
* **Node.js 20+** or **Bun 1.3+**
* **PostgreSQL Database** (e.g., [Neon Serverless Postgres](https://neon.tech))
* **Firebase Project** (Authentication with Google & GitHub OAuth)
* **Cloudflare R2 Bucket** (for media attachments)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/neutron420/Algoryn.git
cd Algoryn

# Install dependencies (bun or npm)
bun install
# or
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-host.region.neon.tech/neondb?sslmode=require"

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Admin SDK (Server)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"

# Cloudflare R2 Object Storage
CLOUDFLARE_R2_ACCOUNT_ID="your-r2-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-r2-access-key-id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
CLOUDFLARE_R2_BUCKET_NAME="algoryn"
CLOUDFLARE_R2_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
CLOUDFLARE_R2_PUBLIC_URL="https://pub-<hash>.r2.dev"

# Upstash Redis Cache (Optional - in-memory fallback enabled by default)
UPSTASH_REDIS_REST_URL="https://your-upstash-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Cron Security Secret (Optional for external webhook callers)
CRON_SECRET="your-cron-secret-token"
```

### 3. Database Migration & Prisma Generation
```bash
# Generate Prisma client
npx prisma generate

# Apply migrations to your database
npx prisma db push
```

### 4. Run Development Server
```bash
bun run dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Directory Structure

```
algoryn/
├── app/
│   ├── api/                              # Route Handlers (discussions, upload, cron, auth, companies)
│   │   ├── cron/sync-profiles/           # Webhook endpoint for profile sync engine
│   │   ├── discussions/                  # Discussion feeds, likes, comments, attachments
│   │   └── interview-experiences/        # Candidate interview debrief endpoints
│   ├── dashboard/
│   │   ├── discussions/                  # Community discussions board & forum
│   │   ├── interview-experiences/        # Candidate interview loop reports & sharing
│   │   ├── page.tsx                      # Company problem explorer dashboard
│   │   └── layout.tsx                    # Dashboard layout with TakeUForward-style sidebar
│   ├── login/                            # OAuth authentication page
│   ├── layout.tsx                        # Root layout, typography, and metadata
│   └── page.tsx                          # Landing page
├── components/
│   ├── app-sidebar.tsx                   # Collapsible sidebar with curved tree branch connectors
│   ├── company-problem-grid/             # Problem filtering, difficulty badges, and pagination
│   ├── interview-experiences/            # Markdown preview and experience components
│   └── ui/                               # Primitives (dialogs, buttons, toolbars, badges)
├── cron/
│   ├── sync-engine.ts                    # Core profile fetcher, scoring, and ranking engine
│   ├── sync-profiles.cron.ts             # 1-minute node-cron background daemon
│   └── index.ts                          # Public engine API exports
├── lib/
│   ├── context/                          # AuthContext and global session state
│   ├── hooks/                            # Custom React hooks (bookmarks, solved)
│   ├── services/platform-fetchers/       # LeetCode, Codeforces, and platform scrapers
│   ├── r2.ts                             # Cloudflare R2 S3 client
│   ├── redis.ts                          # Upstash Redis & in-memory caching pipeline
│   └── prisma.ts                         # Prisma ORM singleton client
├── prisma/
│   └── schema.prisma                     # PostgreSQL schema definitions
└── public/
    └── logos/
        ├── algoryn-logo-dark.png         # Algoryn brand logo (white text for dark theme)
        ├── algoryn-logo-light.png        # Algoryn brand logo (dark text for light theme)
        └── algoryn-logo.png              # High-resolution official brand logo
```

---

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `bun run dev` | Start Next.js Turbopack dev server on port 3000 |
| `build` | `bun run build` | Build Prisma client & compile optimized production bundle |
| `lint` | `bun run lint` | Run ESLint validation |
| `start` | `bun run start` | Start production server |
| `prisma:generate` | `npx prisma generate` | Generate Prisma Client types |
| `prisma:studio` | `npx prisma studio` | Open Prisma visual database browser GUI |

---

## Production Deployment

* **Platform:** [Vercel](https://vercel.com)
* **Custom Domain:** [https://www.algoryn.me](https://www.algoryn.me) & [https://algoryn.me](https://algoryn.me)
* **CI/CD:** Automated GitHub Actions pipeline validating schema integrity, type safety, and production compilation on every push to `master`.

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Engineered by <a href="https://github.com/neutron420">neutron420</a> &middot; Built for engineers, by engineers</sub>
</div>
