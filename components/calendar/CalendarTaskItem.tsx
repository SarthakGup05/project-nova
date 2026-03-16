'use client';

import React from 'react';
import { Task } from '@/store/useTaskStore';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CalendarTaskItem({ task }: { task: Task }) {
  const startTime = new Date(task.startTime!);
  const duration = task.estimatedMinutes || 30;
  
  const timeString = startTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Project colors mapping
  const projectColors: Record<string, string> = {
    'Inbox': 'bg-blue-500/10 border-blue-500/20 text-blue-500',
    'Work': 'bg-purple-500/10 border-purple-500/20 text-purple-500',
    'Personal': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    'Nova': 'bg-accent/10 border-accent/20 text-accent',
  };

  const colorStyles = projectColors[task.project || 'Inbox'] || projectColors['Inbox'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={cn(
        "group h-full flex flex-col rounded-lg border p-2 shadow-sm transition-all cursor-pointer backdrop-blur-md",
        colorStyles,
        task.isCompleted && "opacity-40 grayscale-[0.5]"
      )}
    >
      <div className="flex items-start gap-2 h-full">
        <div className="mt-0.5 shrink-0">
          {task.isCompleted ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Circle className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <p className={cn(
              "text-xs font-bold leading-tight truncate",
              task.isCompleted && "line-through"
            )}>
              {task.title}
            </p>
            
            {duration >= 45 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">
                  {timeString}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-auto">
            <div className="flex items-center gap-1 bg-background/30 px-1.5 py-0.5 rounded-full border border-current/10">
              <Hash className="w-2.5 h-2.5" />
              <span className="text-[8px] font-bold uppercase tracking-widest">{task.project || 'Inbox'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative side bar */}
      <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-current opacity-40" />
    </motion.div>
  );
}
