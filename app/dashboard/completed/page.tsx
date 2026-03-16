'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { CheckCircle2, Inbox } from 'lucide-react';

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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No completed tasks yet</h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-1">
                Tasks you finish will magically appear here for your records.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
