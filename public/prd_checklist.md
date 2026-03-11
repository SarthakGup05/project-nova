# PRD Implementation Checklist: Project Nova

## P0 (Must-Have for MVP)
- [x] **Local-First CRUD**
  - [ ] Implement Zustand store
  - [ ] Instant task creation, reading, updating, deletion
  - [x] Supabase backend basic setup
  - [ ] Optimistic syncing via Supabase real-time subscriptions
- [ ] **The "Brain Dump" Inbox**
  - [ ] Create UI component for single text input field
  - [ ] Setup Vercel AI SDK with Groq (Llama 3) or Gemini API
  - [ ] Implement GenAI parsing logic (extract tasks, dates, durations, tags)
- [ ] **Global Command Palette**
  - [ ] Implement keyboard listener (Cmd/Ctrl + K)
  - [ ] Build command palette UI
  - [ ] Add navigation, search, and manage task actions
- [ ] **Basic Organization**
  - [ ] Implement Projects structure
  - [ ] Implement Tags/Labels system
  - [ ] Implement basic due dates functionality
- [ ] **The "Done" Log**
  - [ ] Create dedicated "Done" view UI
  - [ ] Implement action to un-check accidental completions

## P1 (Important for Launch)
- [ ] **Calendar View & Time-Blocking**
  - [ ] Build daily/weekly calendar interface
  - [ ] Implement drag-and-drop from backlog to calendar slots
- [ ] **AI Task Decomposition & Estimation**
  - [ ] Implement "Break it down" UI action
  - [ ] Add AI generation for sub-tasks
  - [ ] Add AI time estimation (minute count) and map to visual calendar sizing
- [ ] **The "Zomato-Style" Notification Engine**
  - [ ] Setup background cron job infrastructure
  - [ ] Implement logic to evaluate user state (overdue, streaks, time)
  - [ ] Integrate LLM to generate witty/cheeky notifications
  - [ ] Implement Web Push API delivery
- [ ] **Smart Streaks**
  - [ ] Build visual streak counter UI
  - [ ] Implement customizable daily task threshold logic
  - [ ] Build streak evaluation logic (including automatic rest days)
  - [ ] Implement AI "freeze" system

## P2 (Fast Follows / Expansion)
- [ ] **AI Auto-Drafting**
  - [ ] Integrate GenAI to auto-draft email replies or starting templates
  - [ ] Wire up auto-draft generation to task descriptions based on title/context
- [ ] **Weekly Accomplishment Summaries**
  - [ ] Build cron job for end-of-week timing
  - [ ] Prompt AI to generate reports summarizing the "Done" log, trends, wins
  - [ ] Build report UI and notification
- [ ] **Unlockable Cosmetics**
  - [ ] Implement system to track streak milestones (7, 30, 100 days)
  - [ ] Add visual UI upgrades and custom app icons as unlockables
  - [ ] Integrate special Framer Motion completion animations at milestones

## Infrastructure Setup (Prerequisites)
- [ ] Verify Next.js App Router base setup
- [ ] Install and configure Tailwind CSS + Framer Motion
- [ ] Install and setup `@ducanh2912/next-pwa`
- [x] Setup Supabase project (Authentication, Database, RLS)
- [ ] Deploy initial empty frame to Vercel (Hobby Tier)
