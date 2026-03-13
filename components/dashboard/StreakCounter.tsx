'use client';

import { useTaskStore, Task } from '@/store/useTaskStore';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function StreakCounter() {
  const tasks = useTaskStore((state) => state.tasks);

  const streak = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.isCompleted && t.completedAt);
    if (completedTasks.length === 0) return 0;

    // Get unique completion dates (sorted descendently)
    const completionDates = Array.from(
      new Set(
        completedTasks.map((t) => new Date(t.completedAt!).toDateString())
      )
    ).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const latestDateStr = completionDates[0].toDateString();

    // If no completion today or yesterday, streak is broken
    if (latestDateStr !== today && latestDateStr !== yesterday) {
      return 0;
    }

    let count = 0;
    let currentDate = new Date(today);

    // If today is not completed, check from yesterday
    if (latestDateStr === yesterday && completionDates[0].toDateString() !== today) {
        currentDate = new Date(yesterday);
    }

    for (let i = 0; i < completionDates.length; i++) {
        const expectedDateStr = currentDate.toDateString();
        const actualDateStr = completionDates[i].toDateString();

        if (expectedDateStr === actualDateStr) {
            count++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return count;
  }, [tasks]);

  return (
    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 flex items-center justify-center gap-4">
        <motion.div
           animate={{ 
             scale: [1, 1.1, 1],
             rotate: streak > 0 ? [-2, 2, -2] : 0 
           }}
           transition={{ 
             repeat: Infinity, 
             duration: 2,
             ease: "easeInOut"
           }}
           className="relative"
        >
          <Flame className={`w-12 h-12 ${streak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-muted-foreground'}`} />
          {streak > 0 && (
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            >
                {streak}
            </motion.div>
          )}
        </motion.div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tighter">
            {streak} DAY{streak !== 1 ? 'S' : ''}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            Current Streak
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
