<div align="center">

<img src="public/logos/algorynlog.png" alt="Algoryn" height="64" />

# Algoryn

**The Modern Technical Interview Preparation & Developer Community Platform**

<p>
  <a href="https://www.algoryn.me"><strong>🌐 Explore Live Platform (algoryn.me)</strong></a>
  &nbsp;&middot;&nbsp;
  <a href="https://github.com/neutron420/Algoryn/issues"><strong>🐛 Report Bug</strong></a>
  &nbsp;&middot;&nbsp;
  <a href="https://github.com/neutron420/Algoryn/issues"><strong>✨ Request Feature</strong></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Neon_PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
  <img src="https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

</div>

---

## 📖 About Algoryn

**Algoryn** is a high-performance, company-targeted technical interview preparation platform designed for engineers aiming for top-tier tech firms. Instead of practicing randomly on disconnected platforms, Algoryn curates **15,000+ verified interview questions** across **690+ companies** categorized into **18 industry verticals** — including FAANG, High-Frequency Trading (HFT), Artificial Intelligence & Machine Learning, FinTech, and Cloud Infrastructure.

Beyond problem curation, Algoryn features an active **Community Hub** with interactive discussions, verified interview experiences, multi-photo posts, and threaded discussions.

🌐 **Production Website**: [https://algoryn.me](https://algoryn.me)

---

## ⚡ What Is Done (Current Implemented Features)

### 1. 💬 Community Discussion Board & Forum
* **LinkedIn-Style Sliding Photo Carousel:**
  * Displays single photos cleanly, and multi-photo uploads (up to 10 photos) in an interactive horizontal sliding gallery.
  * Frosted glass counter badge (`1/5`, `4/5`), navigation arrows (`<` and `>`), touch-swipe support on mobile, and subtle pagination dots.
  * Full-resolution Lightbox modal on image click with keyboard arrow navigation.
* **Mobile-First Collapsible Composer:**
  * Sleek 48px composer pill when collapsed (`"Share your experience, guide, or ask a question..."`) to maximize feed visibility.
  * Tapping smoothly expands into a full rich-text composer with Title, Category, Tags, Photo Uploader, Write/Preview tabs, Cancel, and Post.
* **Rich Markdown Editor & Live Preview:**
  * Full formatting toolbar: Bold, Italic, Underline, Strikethrough, Headings (H1/H2), Inline Code, Codeblocks, Quotes, Bullet & Numbered lists, Links.
  * Instant tab toggle between Write and live Markdown Preview.
* **Threaded Commenting & Nested Replies:**
  * Multi-level threaded comment discussions with formatting and preview.
* **Likes, Views, & Bookmarks:**
  * Instant optimistic like toggling with like counters.
  * Post view counter tracking.
  * Discussion bookmarking with a dedicated **"Saved"** filter tab to view bookmarked posts anytime.
* **Topic & Category Filtering:**
  * Filter discussions by category: *Discussion*, *Study Guide*, *Interview Experience*, *System Design*, *DSA Tips*, *Career*, *Showcase*, *Events*.
  * Tag navigation and real-time search with instant keyboard shortcut (`Shift + S` on desktop).
* **Trending Sidebar & Leaderboards:**
  * Pinned trending posts and active community discussions.

### 2. 🏢 Company Problem Explorer (690+ Companies)
* **15,000+ Real Interview Questions:** Company-specific questions gathered from real technical interview rounds.
* **18 Industry Categories:** FAANG, Quant / HFT, FinTech, AI & ML, Cloud Infrastructure, E-Commerce, Security, and more.
* **Advanced Multi-Filter Engine:** Filter questions in real time by Difficulty (*Easy*, *Medium*, *Hard*), Timeframe (*30 Days*, *3 Months*, *6 Months*, *All Time*), and Topic Tags.
* **Instant Two-Way Bookmarks:** Save problems with one click; bi-directional URL parameter synchronization (`/dashboard?status=BOOKMARKED`) and cloud sync across devices.
* **Direct Coding Platform Links:** Quick navigation to LeetCode, Codeforces, GeeksforGeeks, and HackerRank.

### 3. ☁️ Cloudflare R2 Media Storage
* High-performance, S3-compatible cloud object storage for image uploads.
* Multi-photo batch uploading with automated file validation (size, MIME type).
* Zero egress fees and ultra-fast global CDN delivery.

### 4. 🔐 Authentication & Session Persistence
* Google & GitHub OAuth powered by Firebase Authentication.
* Automatic user profile synchronization to Neon PostgreSQL.
* 7-day session persistence with secure token refresh.

### 5. ⚡ Performance & Caching Architecture
* **Multi-Tier Caching:** In-memory LRU cache coupled with Upstash Redis.
* **Hover Prefetching:** Sub-millisecond page transitions and instant category browsing.
* **Next.js 16 & Turbopack:** Blazing-fast compilation and static generation with zero runtime overhead.

---

## 🔮 What Is To Be Made (Roadmap)

The following features are currently planned and in active development:

- [ ] **💻 In-Browser Code Execution Sandbox:**
  * Embedded Monaco Editor (VS Code engine) with syntax highlighting, auto-complete, and dark mode.
  * Multi-language execution engine (Python, JavaScript, TypeScript, C++, Java, Go) with custom test case runner.
- [ ] **🤖 AI Interview Coach & Code Reviewer:**
  * LLM-powered feedback analyzing Big-O time and space complexity.
  * Hints and progressive solution nudges without giving away full answers.
  * Automated code quality, readability, and edge-case reviews.
- [ ] **👥 Peer-to-Peer Mock Interviews:**
  * 1-on-1 collaborative mock interview matching between peers.
  * Integrated WebRTC audio/video calling with synchronized whiteboard and shared code editor.
- [ ] **📊 Application & Interview Tracker (Kanban Board):**
  * Personal interview pipeline manager (*Wishlist* ➔ *Applied* ➔ *Online Assessment* ➔ *Technical Screen* ➔ *System Design* ➔ *Offer*).
  * Compensation, notes, and question logging per application.
- [ ] **🏆 Global Solver Streaks & Leaderboards:**
  * Daily problem challenges with streak tracking.
  * Verified submission badges, GitHub-style contribution heatmaps, and ranking leaderboards.
- [ ] **📱 Offline-First Progressive Web App (PWA):**
  * Offline question caching for study on the go.
  * Native desktop and mobile home-screen install support.

---

## 🛠️ Tech Stack

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
      <sub><b>UI & Ecosystem:</b> Lucide Icons &middot; Radix UI &middot; Sonner &middot; Motion &middot; Recharts</sub>
    </td>
  </tr>
</table>

---

## 🗄️ Database Architecture

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
                                     ┌─────────────────────────────────────────────┼─────────────────────────┐
                                     │ *                                           │ *                       │ *
                          ┌──────────┴───────────┐                      ┌──────────┴───────────┐  ┌──────────┴───────────┐
                          │    DiscussionPost    │                      │  DiscussionComment   │  │   CommunityProblem   │
                          └──────────┬───────────┘                      └──────────────────────┘  └──────────────────────┘
                                     │ 1
                       ┌─────────────┴─────────────┐
                       │ *                         │ *
            ┌──────────┴───────────┐    ┌──────────┴───────────┐
            │    DiscussionLike    │    │  DiscussionBookmark  │
            └──────────────────────┘    └──────────────────────┘
```

---

## 🌐 API Reference

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
| `POST` | `/api/upload` | Upload photos to Cloudflare R2 bucket (returns public CDN URLs) |
| `GET` | `/api/companies` | List companies by category with problem counts |
| `GET` | `/api/companies/[slug]/problems` | Fetch company questions with difficulty and timeframe filters |
| `GET` | `/api/problems` | Search global problems catalog |
| `POST` | `/api/user/bookmarks` | Sync and fetch user's saved problems |
| `POST` | `/api/user/solved` | Mark problem as solved / retrieve solved status |
| `POST` | `/api/auth/sync` | Sync Firebase authenticated user record with PostgreSQL |

---

## 🚀 Quick Start

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

# Install dependencies (npm or bun)
npm install
# or
bun install
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
npm run dev
# or
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Directory Structure

```
algoryn/
├── app/
│   ├── api/                    # API Route Handlers (discussions, upload, auth, companies)
│   ├── dashboard/
│   │   ├── discussions/        # Community discussions board & forum
│   │   ├── page.tsx            # Main problem explorer dashboard
│   │   └── layout.tsx          # Dashboard layout & navigation
│   ├── login/                  # OAuth authentication page
│   ├── layout.tsx              # Root layout, fonts, and theme providers
│   └── page.tsx                # High-converting landing page
├── components/
│   ├── company-problem-grid    # Problem filtering, search, and pagination
│   ├── kodeprep-sidebar        # Navigation, categories, and bookmarks
│   ├── kibo-ui/                # Announcement badges and UI micro-interactions
│   └── ui/                     # Primitives (buttons, modals, toolbars)
├── lib/
│   ├── context/                # AuthContext & global state providers
│   ├── hooks/                  # Custom React hooks (bookmarks, solved)
│   ├── r2.ts                   # Cloudflare R2 S3 client & upload handlers
│   ├── redis.ts                # Upstash Redis & in-memory caching pipeline
│   └── prisma.ts               # Prisma ORM singleton client
├── prisma/
│   └── schema.prisma           # Full PostgreSQL data model schema
└── public/
    └── logos/algorynlog.png    # Official Algoryn brand logo
```

---

## 📜 Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `npm run dev` | Start Next.js Turbopack dev server on port 3000 |
| `build` | `npm run build` | Build Prisma client & compile optimized production bundle |
| `lint` | `npm run lint` | Run ESLint with zero tolerance for errors or warnings |
| `start` | `npm run start` | Start production server |
| `prisma:generate` | `npx prisma generate` | Generate Prisma Client types |
| `prisma:studio` | `npx prisma studio` | Open Prisma visual database browser GUI |

---

## 🌍 Production Deployment

* **Platform:** [Vercel](https://vercel.com)
* **Custom Domain:** [https://algoryn.me](https://algoryn.me) & [https://www.algoryn.me](https://www.algoryn.me)
* **CI/CD:** Automated GitHub Actions pipeline validating schema integrity, type safety, and production compilation on every push to `master`.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Engineered with ❤️ by <a href="https://github.com/neutron420">neutron420</a> &middot; Built for engineers, by engineers</sub>
</div>
