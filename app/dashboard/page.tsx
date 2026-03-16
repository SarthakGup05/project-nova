'use client';

import { motion, Variants } from 'framer-motion';
import { TodayView } from '@/components/dashboard/Todayview';
import { useTaskStore } from '@/store/useTaskStore';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  },
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const tasks = useTaskStore((state) => state.tasks);
  const activeTasksCount = tasks.filter(t => !t.isCompleted).length;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Today
        </h1>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          {activeTasksCount} active tasks
        </p>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        {user?.id && <TodayView userId={user.id} />}
      </motion.div>
    </div>
  );
}