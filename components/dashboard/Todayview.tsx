'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Hash,
  MoreHorizontal,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/useTaskStore';
import { AddTaskDialog } from './AddTaskDialog';
import { EmptyState } from './EmptyState';

// 1. Shared audio instance for TodayView tasks
let checkSound: HTMLAudioElement | null = null;

// --- Types ---
type Task = {
  id: string;
  title: React.ReactNode; 
  description?: string;
  projectName: string;
  projectColor?: string;
  isCompleted: boolean;
};

export function TodayView({ userId }: { userId: string }) {
  const tasks = useTaskStore((state) => state.tasks);
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const [recentlyCompletedIds, setRecentlyCompletedIds] = useState<Set<string>>(new Set());

  const activeTasks = tasks.filter((t) => !t.isCompleted || recentlyCompletedIds.has(t.id));

  const handleToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.isCompleted) {
      setRecentlyCompletedIds(prev => new Set(prev).add(id));
      setTimeout(() => {
        setRecentlyCompletedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 1000);
    }
    toggleTaskCompletion(id);
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-8 px-4 sm:px-8">
      {/* Task List Section */}
      <div className="space-y-1">
        <AnimatePresence initial={false} mode="wait">
          {activeTasks.length > 0 ? (
            <>
              {activeTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={{
                    id: task.id,
                    title: task.title,
                    projectName: task.project || 'Inbox',
                    isCompleted: task.isCompleted || false,
                    projectColor: 'text-accent'
                  }} 
                  onToggle={() => handleToggle(task.id)} 
                />
              ))}
              {/* Add Task Button wrapped in Dialog at the bottom of the list */}
              <div className="mt-6">
                <AddTaskDialog userId={userId} />
              </div>
            </>
          ) : (
            <EmptyState 
              title="All caught up!" 
              description="Your day looks clear. Enjoy the peace or start something new!"
              action={
                <AddTaskDialog userId={userId}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-2xl bg-red-500 text-white font-bold shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center gap-2 mx-auto"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create First Task
                  </motion.button>
                </AddTaskDialog>
              }
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Individual Task Component ---
function TaskItem({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  // 2. Pre-load sound silently
  useEffect(() => {
    if (typeof window !== 'undefined' && !checkSound) {
      checkSound = new Audio('/sounds/penciil check.mp3');
      checkSound.volume = 0.6;
      checkSound.load();
    }
  }, []);

  // 3. Handle click, sound, and haptics synchronously
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!task.isCompleted) {
      try {
        if (checkSound) {
          checkSound.currentTime = 0;
          checkSound.play().catch(err => console.error("Audio playback prevented:", err));
        }
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
    
    onToggle();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-start gap-4 py-4 px-3 -mx-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all duration-300 border-b border-neutral-100 dark:border-neutral-800 last:border-none"
    >
      {/* Improved Checkmark Button */}
      <button
        onClick={handleToggle}
        className="mt-1 shrink-0 outline-none relative group/check"
      >
        <motion.div 
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={cn(
            "w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center overflow-hidden relative",
            task.isCompleted 
              ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20" 
              : "border-neutral-300 dark:border-neutral-600 group-hover/check:border-neutral-400 dark:group-hover/check:border-neutral-500"
          )}
        >
          <motion.div
            initial={false}
            animate={task.isCompleted ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
          </motion.div>
          
          {!task.isCompleted && isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center text-neutral-400"
            >
              <Circle className="w-5 h-5 stroke-[1.5]" />
            </motion.div>
          )}
        </motion.div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Left Side: Title & Description */}
        <div className="space-y-1 pr-4">
          {/* Switched to inline-flex w-fit for perfect strikethrough alignment */}
          <div className="relative inline-flex w-fit max-w-full">
            <p className={cn(
              "text-[15px] font-medium leading-snug transition-all duration-300 block truncate",
              task.isCompleted ? "text-neutral-400" : "text-neutral-800 dark:text-neutral-200"
            )}>
              {task.title}
            </p>
            <AnimatePresence initial={false}>
              {task.isCompleted && (
                <motion.div
                  key="strikethrough"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute left-0 top-1/2 mt-[1px] h-[2px] bg-neutral-400/50 origin-left"
                />
              )}
            </AnimatePresence>
          </div>
          {task.description && (
            <p className="text-[13px] text-neutral-500 line-clamp-2 text-balance leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Right Side: Metadata (Project & Actions) */}
        <div className="flex items-center gap-4 shrink-0 sm:pt-0.5">
          {/* Project Tag */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 px-2.5 py-1 rounded-lg transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700">
            <span className="truncate max-w-[100px]">{task.projectName}</span>
            <Hash className={cn("w-3.5 h-3.5 shrink-0", task.projectColor || "text-neutral-400")} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
            <button 
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-all outline-none focus:ring-2 focus:ring-red-500/50"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all outline-none focus:ring-2 focus:ring-neutral-400/50">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}