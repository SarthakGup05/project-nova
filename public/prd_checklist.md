# PRD Implementation Checklist: Project Nova

## P0 (Must-Have for MVP)
- [x] **Local-First CRUD**
  - [x] Implement Zustand store
  - [x] Instant task creation, reading, updating, deletion
  - [x] Supabase backend basic setup
  - [x] Optimistic syncing via background sync queue
- [x] **The "Brain Dump" Inbox**
  - [x] Create UI component for single text input field
  - [x] Setup Vercel AI SDK with Groq (Llama 3) or Gemini API
  - [x] Implement GenAI parsing logic (extract tasks, dates, durations, tags)
- [ ] **Global Command Palette**
  - [ ] Implement keyboard listener (Cmd/Ctrl + K)
  - [ ] Build command palette UI
  - [ ] Add navigation, search, and manage task actions
- [x] **Basic Organization**
  - [x] Implement Projects structure
  - [x] Implement Tags/Labels system
  - [x] Implement basic due dates functionality
  - [x] Implement folders for projects and labels <!-- id: folder_org -->
- [x] **The "Done" Log**
  - [x] Create dedicated "Done" view UI
  - [x] Implement action to un-check accidental completions

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
  - [x] Build visual streak counter UI
  - [ ] Implement customizable daily task threshold logic
  - [x] Build streak evaluation logic (including automatic rest days) <!-- id: streak_logic -->
  - [ ] Implement AI "freeze" system

## P2 (Fast Follows / Expansion)
- [ ] **AI Auto-Drafting**
  - [ ] Integrate GenAI to auto-draft email replies or starting templates
  - [ ] Wire up auto-draft generation to task descriptions based on title/context
- [ ] **Weekly Accomplishment Summaries**
  - [ ] Build cron job for end-of-week timing
  - [ ] Prompt AI to generate reports summarizing the "Done" log, trends, wins
  - [ ] Build report UI and notification
- [x] **Unlockable Cosmetics**
  - [x] Implement system to track streak milestones and task counts <!-- id: milestones -->
  - [x] Add visual UI upgrades and custom app icons as unlockables
  - [x] Implement Achievements Page dashboard with premium animations <!-- id: achievements_page -->
  - [x] Integrate special Framer Motion completion animations at milestones
  - [x] Implement Premium Tiered Badge system (Bronze to Diamond) <!-- id: badge_system -->

## Infrastructure Setup (Prerequisites)
- [x] Verify Next.js App Router base setup
- [x] Install and configure Tailwind CSS + Framer Motion
- [x] Install and setup `@ducanh2912/next-pwa`
- [x] Setup Supabase project (Authentication, Database, RLS)
- [x] Deploy initial empty frame to Vercel (Hobby Tier)
