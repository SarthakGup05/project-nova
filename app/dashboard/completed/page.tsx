'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { CheckCircle2, Inbox } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';

export default function CompletedTasksPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          Completed
        </h1>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          {completedTasks.length} tasks finished
        </p>
      </div>

      <div className="relative">
        <AnimatePresence mode="popLayout">
          {completedTasks.length > 0 ? (
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.ul>
          ) : (
            <EmptyState 
              title="No completions yet" 
              description="Tasks you finish will magically appear here. Time to get productive!"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
