'use client';

import { useEffect } from 'react';
import { useTaskStore, Task } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Trash2, Calendar, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 1. Declare the audio instance outside the component.
// This acts as a shared global variable for this file. 
// No matter how many tasks you render, they all share this one audio object.
let checkSound: HTMLAudioElement | null = null;

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  // 2. Pre-load the sound silently when the component mounts in the browser
  useEffect(() => {
    // Check that we are on the client-side and the sound hasn't been initialized yet
    if (typeof window !== 'undefined' && !checkSound) {
      checkSound = new Audio('/sounds/penciil check.mp3');
      checkSound.volume = 0.6; // Optional: set a default volume
      checkSound.load(); // Forces the browser to fetch the file immediately
    }
  }, []);

  const handleToggle = () => {
    if (!task.isCompleted) {
      try {
        if (checkSound) {
          // 3. Reset the playback time to 0. 
          // This ensures the sound plays from the beginning even if 
          // the user rapidly clicks multiple tasks in a row.
          checkSound.currentTime = 0;
          checkSound.play().catch(err => console.error("Audio playback prevented:", err));
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
    
    toggleTaskCompletion(task.id);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        "group flex items-center justify-between rounded-xl border border-border/40 bg-card/40 p-4 transition-all duration-300 hover:shadow-md hover:border-accent/30",
        task.isCompleted && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={handleToggle}
          className="flex-shrink-0 outline-none"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {task.isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-accent fill-accent/10" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
            )}
          </motion.div>
        </button>
        
        <div className="flex flex-col min-w-0">
          <div className="relative inline-flex w-fit max-w-full">
            <span className={cn(
              "font-medium text-sm sm:text-base truncate block transition-colors duration-300",
              task.isCompleted && "text-muted-foreground"
            )}>
              {task.title}
            </span>
            
            <AnimatePresence initial={false}>
              {task.isCompleted && (
                <motion.div
                  key="strikethrough"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute left-0 top-1/2 mt-[1px] h-[2px] bg-muted-foreground origin-left"
                />
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {task.isAiGenerated && (
              <Badge variant="accent" className="h-4 px-1.5 text-[10px] gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </Badge>
            )}
            {task.project && task.project !== 'Inbox' && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {task.project}
              </span>
            )}
            {task.estimatedMinutes && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {task.estimatedMinutes}m
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.li>
  );
}