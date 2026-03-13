import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 1. Initialize the Groq provider
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// 2. Define the strict JSON structure
const TaskSchema = z.object({
  tasks: z.array(z.object({
    title: z.string().describe('A clear, actionable task title.'),
    estimatedMinutes: z.number().describe('Estimated time to complete in minutes.'),
    project: z.string().describe('Categorize into: Work, Personal, Errands, or Inbox.'),
    tags: z.array(z.string()).describe('1-2 relevant tags.'),
    dueDate: z.string().optional().describe('ISO date string if a timeline is mentioned.'),
  }))
});

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json({ error: 'Prompt and userId are required' }, { status: 400 });
    }

    // Ensure profile exists (Lazy Creation to fix FK constraint violation)
    const existingProfile = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    if (existingProfile.length === 0) {
      await db.insert(profiles).values({
        id: userId,
        username: `User_${userId.slice(0, 4)}`, 
      });
    }

    // 3. Hit Groq using generateText (to avoid json_schema errors)
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `
        You are a highly efficient productivity assistant. 
        Today's date is ${new Date().toISOString()}.
        Take the following unstructured brain dump from the user and extract the actionable tasks.
        Assign realistic time estimates and categorize them logically.
        
        Return the result as a raw JSON object matching this schema: ${JSON.stringify(TaskSchema.shape)}
        For dueDate, USE ONLY strict ISO 8601 date strings. If the year is not specified, assume the current year is ${new Date().getFullYear()}.
        DO NOT include markdown code blocks or any other explanatory text.

        User Brain Dump: "${prompt}"
      `,
    });

    // 4. Extract and parse JSON (stripping markdown if model includes it anyway)
    const jsonString = text.replace(/```json\n?|```/g, "").trim();
    const object = TaskSchema.parse(JSON.parse(jsonString));

    // 5. Format the output to match Drizzle ORM schema
    const newTasks = object.tasks.map(task => ({
      userId,
      title: task.title,
      estimatedMinutes: task.estimatedMinutes,
      project: task.project,
      tags: task.tags,
      dueDate: task.dueDate && !isNaN(new Date(task.dueDate).getTime()) 
        ? new Date(task.dueDate).toISOString() 
        : null,
      isAiGenerated: true,
    }));

    // 5. Insert into Supabase via Drizzle
    const insertedTasks = await db.insert(tasks).values(newTasks).returning();

    return NextResponse.json({ success: true, data: insertedTasks });

  } catch (error) {
    console.error('Groq/Drizzle Error:', error);
    return NextResponse.json({ error: 'Failed to process and save tasks' }, { status: 500 });
  }
}