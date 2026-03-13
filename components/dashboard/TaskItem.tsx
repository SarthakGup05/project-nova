'use client';

import { Task, useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Trash2, Calendar, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className={cn(
        "group flex items-center justify-between rounded-xl border border-border/40 bg-card/40 p-4 transition-all hover:shadow-md hover:border-accent/30",
        task.isCompleted && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={() => toggleTaskCompletion(task.id)}
          className="flex-shrink-0 transition-transform active:scale-95"
        >
          {task.isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-accent fill-accent/10" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
          )}
        </button>
        
        <div className="flex flex-col min-w-0">
          <span className={cn(
            "font-medium text-sm sm:text-base truncate",
            task.isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </span>
          
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

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
