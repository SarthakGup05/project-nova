# PRD: Project Nova (Next-Gen AI Task Manager)

## 1. Product Vision & Objective
To build a zero-latency, AI-augmented task manager that shifts the burden of organization from the user to the system. Project Nova serves as a direct upgrade to traditional task managers by eliminating loading times through a local-first PWA architecture. It utilizes GenAI to reduce the cognitive load of planning, enforces execution via calendar time-blocking, and drives daily retention through smart gamification and high-personality, witty push notifications.

## 2. Target Audience
- **Productivity Power Users & Developers**: Professionals who find standard task managers too slow, rigid, or boring and prefer keyboard-first navigation.
- **Knowledge Workers**: People juggling multiple projects, unstructured requests, and high context switching.
- **Individuals Prone to Task Paralysis**: Users who need AI assistance to break down overwhelming projects into actionable steps and realistic time blocks.

## 3. Core Value Propositions
- **Zero Latency (PWA)**: Local state management ensures instant rendering and full offline capability, installable on mobile and desktop via Next.js PWA.
- **Frictionless Capture**: The AI "Brain Dump" organizes messy thoughts into structured tasks automatically.
- **Execution over Hoarding**: The Calendar view and AI time estimations force realistic planning rather than building impossible wishlists.
- **High-Personality Engagement**: Witty, context-aware push notifications (Zomato-style) replace robotic, nagging reminders.
- **Forgiving Gamification**: A smart streak system that rewards consistency without punishing necessary rest days.

## 4. Feature Requirements & Prioritization

### P0 (Must-Have for MVP)
- **Local-First CRUD**: Instant task creation, reading, updating, and deletion using local state (Zustand) that optimistic-syncs to the backend.
- **The "Brain Dump" Inbox**: A single text input field where users paste unstructured thoughts. GenAI parses this text to extract specific tasks, dates, estimated durations, and project tags.
- **Global Command Palette**: A keyboard-centric interface triggered by Cmd/Ctrl + K to navigate, search, and manage tasks without a mouse.
- **Basic Organization**: Projects, Tags/Labels, and basic due dates.
- **The "Done" Log**: A dedicated, visually satisfying view for completed tasks, allowing users to review their accomplishments or un-check accidental completions.

### P1 (Important for Launch)
- **Calendar View & Time-Blocking**: A visual daily/weekly calendar interface where users drag and drop tasks from their backlog directly into specific time slots.
- **AI Task Decomposition & Estimation**: A "Break it down" action on complex tasks that generates actionable sub-tasks. AI assigns an estimated minute count to tasks to visually size them on the calendar.
- **The "Zomato-Style" Notification Engine**: A background cron job that evaluates user state (overdue tasks, current streaks, time of day) and prompts an LLM to generate witty, contextual, and slightly cheeky push notifications via the Web Push API.
- **Smart Streaks**: A visual daily streak counter based on a customizable daily task threshold, featuring an AI-awarded "freeze" system and automatic rest days (e.g., weekends) to prevent streak fatigue.

### P2 (Fast Follows / Expansion)
- **AI Auto-Drafting**: GenAI automatically drafts email replies or starting templates in the task description based on the task title and context.
- **Weekly Accomplishment Summaries**: An automated end-of-week AI report summarizing the "Done" log, highlighting trends and major wins.
- **Unlockable Cosmetics**: Visual UI upgrades, custom app icons, and special Framer Motion completion animations unlocked at 7, 30, and 100-day streak milestones.

## 5. Technical Architecture & Tech Stack (The $0 MVP Stack)
- **Core Framework (Full-Stack)**: Next.js (App Router, no src directory) serving as the unified foundation for both desktop and mobile web.
- **PWA Infrastructure**: `@ducanh2912/next-pwa` to auto-generate the Service Worker for offline caching and manifest.json.
- **Database & Authentication**: Supabase (Free Tier) providing PostgreSQL, Row Level Security (RLS), and seamless user Auth.
- **State Management & Sync**: Zustand for instant local UI updates, paired with Supabase real-time subscriptions for optimistic syncing. (Expandable to WatermelonDB/PowerSync later for complex offline CRDTs).
- **UI & Animation**: Tailwind CSS for styling, coupled with Framer Motion and GSAP for fluid, high-performance interactions (swipe-to-complete, streak popups).
- **AI Integration**: Vercel AI SDK paired with Groq (Llama 3) or Google Gemini API for free, ultra-fast structured JSON outputs and generative text.
- **Deployment & Hosting**: Vercel (Hobby Tier) for zero-cost edge caching, Serverless API routes, and CI/CD.
