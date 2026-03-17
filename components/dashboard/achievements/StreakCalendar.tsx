'use client';

import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCalendarProps {
  completedDays: number[];
}

export function StreakCalendar({ completedDays }: StreakCalendarProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-neutral-200 dark:border-neutral-800/50 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Streaks</h2>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, idx) => {
          const isCompleted = completedDays.includes(idx);
          const isToday = idx === todayIdx; 

          return (
            <div key={day} className="flex flex-col items-center gap-4">
              <span className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.1em]">
                {day}
              </span>
              <div className="relative group">
                <motion.div
                  initial={false}
                  animate={isCompleted ? { scale: 1 } : { scale: 0.9 }}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isCompleted 
                      ? "bg-orange-500/10 border-orange-500 text-orange-500 shadow-lg shadow-orange-500/20" 
                      : isToday
                        ? "border-orange-500/40 border-dashed animate-pulse text-muted-foreground/30"
                        : "border-neutral-200 dark:border-neutral-800 text-muted-foreground/20"
                  )}
                >
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <Flame className="w-6 h-6 fill-orange-500" />
                    </motion.div>
                  )}
                </motion.div>
                
                {isToday && !isCompleted && (
                  <div className="absolute -inset-1 border border-orange-500/20 rounded-full animate-ping opacity-20" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
