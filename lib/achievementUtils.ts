import { Task } from '@/store/useTaskStore';

export function calculateXP(tasks: Task[]): number {
  const completedTasks = tasks.filter(t => t.isCompleted);
  return completedTasks.length * 10;
}

export function calculateStreaks(tasks: Task[]): { current: number; longest: number } {
  const completedDates = tasks
    .filter(t => t.isCompleted && t.completedAt)
    .map(t => new Date(t.completedAt!).toLocaleDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (completedDates.length === 0) return { current: 0, longest: 0 };

  const uniqueDates = Array.from(new Set(completedDates));
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

  // Check current streak
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = new Date(uniqueDates[i]);
      const d2 = new Date(uniqueDates[i + 1]);
      const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const d1 = new Date(uniqueDates[i]);
    const d2 = new Date(uniqueDates[i + 1]);
    const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
}

export function getWeeklyCompletionData(tasks: Task[]): number[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now.setDate(now.getDate() + mondayOffset));
  monday.setHours(0, 0, 0, 0);

  const completedDays: number[] = [];
  const taskDates = tasks
    .filter(t => t.isCompleted && t.completedAt)
    .map(t => {
      const d = new Date(t.completedAt!);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(monday.getTime() + i * 86400000).getTime();
    if (taskDates.includes(checkDate)) {
      completedDays.push(i);
    }
  }

  return completedDays;
}
