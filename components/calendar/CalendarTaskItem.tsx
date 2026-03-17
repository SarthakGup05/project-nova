'use client';

import React, { useEffect } from 'react';
import { Task, useTaskStore } from '@/store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. Shared audio instance for all Calendar tasks
let checkSound: HTMLAudioElement | null = null;

export function CalendarTaskItem({ task }: { task: Task }) {
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);

  // 2. Pre-load the sound silently when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !checkSound) {
      checkSound = new Audio('/sounds/penciil check.mp3');
      checkSound.volume = 0.6;
      checkSound.load();
    }
  }, []);

  // 3. Handle the toggle and sound on click
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the click from bubbling up if the whole card is clickable later
    
    if (!task.isCompleted) {
      try {
        if (checkSound) {
          checkSound.currentTime = 0;
          checkSound.play().catch(err => console.error("Audio playback prevented:", err));
        }
        
        // Bonus: Add a subtle haptic vibration for mobile users
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
    
    toggleTaskCompletion(task.id);
  };

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
        {/* Made the checkmark interactive with an onClick and spring animation */}
        <button 
          onClick={handleToggle}
          className="mt-0.5 shrink-0 outline-none"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {task.isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Circle className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            )}
          </motion.div>
        </button>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            {/* Switched to inline-flex w-fit to fix the strikethrough width issue */}
            <div className="relative inline-flex w-fit max-w-full">
              <p className={cn(
                "text-xs font-bold leading-tight truncate block transition-colors duration-300",
                task.isCompleted && "text-current"
              )}>
                {task.title}
              </p>
              
              {/* Removed mode="wait" for snappier animation */}
              <AnimatePresence initial={false}>
                {task.isCompleted && (
                  <motion.div
                    key="strikethrough"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 0.6 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute left-0 top-1/2 mt-[0.5px] h-[2px] bg-current origin-left opacity-60"
                  />
                )}
              </AnimatePresence>
            </div>
            
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