import { createGroq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';

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

    // 3. Hit Groq for blazing-fast inference
    const { object } = await generateObject({
      model: groq('llama-3.3-70b-versatile'), // Swapped to Groq's Llama model
      schema: TaskSchema,
      prompt: `
        You are a highly efficient productivity assistant. 
        Take the following unstructured brain dump from the user and extract the actionable tasks.
        Assign realistic time estimates and categorize them logically.
        
        User Brain Dump: "${prompt}"
      `,
    });

    // 4. Format the output to match Drizzle ORM schema
    const newTasks = object.tasks.map(task => ({
      userId,
      title: task.title,
      estimatedMinutes: task.estimatedMinutes,
      project: task.project,
      tags: task.tags,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
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