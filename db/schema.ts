// db/schema.ts
import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(), // Links to Supabase Auth user.id
  username: text('username'),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  freezeTokens: integer('freeze_tokens').default(0),
  notificationPersonality: text('notification_personality').default('cheeky'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  isCompleted: boolean('is_completed').default(false),
  isAiGenerated: boolean('is_ai_generated').default(false),
  estimatedMinutes: integer('estimated_minutes').default(15),
  project: text('project').default('Inbox'),
  tags: text('tags').array().default(sql`'{}'::text[]`),
  dueDate: timestamp('due_date', { withTimezone: true, mode: 'string' }),
  contextDraft: text('context_draft'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
});