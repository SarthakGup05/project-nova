'use client';

import { Task } from '@/store/useTaskStore';
import { TaskItem } from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

export function TaskList({ tasks, emptyMessage = "Nothing here yet." }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-sm text-muted-foreground italic border-2 border-dashed border-border/20 rounded-xl"
        >
          {emptyMessage}
        </motion.p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
