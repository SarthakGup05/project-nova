'use client';

import { useEffect, useState } from 'react';
import { useTaskStore, Task } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, Circle, Trash2, Calendar, Clock, 
  Sparkles, Flag, MessageSquare, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 1. Declare the audio instance outside the component.
let checkSound: HTMLAudioElement | null = null;

const PRIORITY_MAP = {
  'p1': { label: 'High', color: 'text-red-500', fill: 'fill-red-500' },
  'p2': { label: 'Medium', color: 'text-yellow-500', fill: 'fill-yellow-500' },
  'p3': { label: 'Low', color: 'text-blue-500', fill: 'fill-blue-500' },
};

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // 2. Pre-load the sound silently when the component mounts in the browser
  useEffect(() => {
    if (typeof window !== 'undefined' && !checkSound) {
      checkSound = new Audio('/sounds/penciil check.mp3');
      checkSound.volume = 0.6;
      checkSound.load();
    }
  }, []);

  const handleToggle = () => {
    if (!task.isCompleted) {
      try {
        if (checkSound) {
          checkSound.currentTime = 0;
          checkSound.play().catch(err => console.error("Audio playback prevented:", err));
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
    
    toggleTaskCompletion(task.id);
  };

  // Find priority tag
  const priorityTag = task.tags?.find(tag => ['p1', 'p2', 'p3'].includes(tag));
  const priorityInfo = priorityTag ? PRIORITY_MAP[priorityTag as keyof typeof PRIORITY_MAP] : null;
  const regularTags = task.tags?.filter(tag => !['p1', 'p2', 'p3'].includes(tag)) || [];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        "group flex flex-col rounded-2xl border border-border/40 bg-card/40 transition-all duration-300 hover:shadow-lg hover:border-accent/30 overflow-hidden",
        task.isCompleted && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex items-center justify-between p-4 flex-1 min-w-0">
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
            <div className="flex items-center gap-2 mb-0.5">
              {priorityInfo && (
                <Flag className={cn("w-3.5 h-3.5", priorityInfo.color, priorityInfo.fill)} />
              )}
              <div className="relative inline-flex w-fit max-w-full">
                <span className={cn(
                  "font-semibold text-sm sm:text-base truncate block transition-colors duration-300",
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
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {task.isAiGenerated && (
                <Badge variant="accent" className="h-4 px-1.5 text-[10px] gap-1 font-bold">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI
                </Badge>
              )}
              {task.project && task.project !== 'Inbox' && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500/70 bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/10">
                  {task.project}
                </span>
              )}
              {regularTags.map(tag => (
                <span key={tag} className="text-[10px] font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border/30">
                  #{tag}
                </span>
              ))}
              {task.estimatedMinutes && (
                <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {task.estimatedMinutes}m
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 ml-4">
          {task.contextDraft && (
            <Button
              size="icon"
              variant="ghost"
              className={cn("h-8 w-8", showFullDescription ? "text-accent bg-accent/10" : "text-muted-foreground")}
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFullDescription && task.contextDraft && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-12 pb-4"
          >
            <div className="bg-muted/30 rounded-xl p-3 text-xs text-muted-foreground italic border border-border/20 leading-relaxed">
              {task.contextDraft}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}