'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Flame, 
  User as UserIcon, 
  Search,
  Settings,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/useTaskStore';
import { NotificationPanel } from './NotificationPanel';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);

  // Calculate Streak (Compact version for header)
  const streak = React.useMemo(() => {
    const completedTasks = tasks.filter((t) => t.isCompleted && t.completedAt);
    if (completedTasks.length === 0) return 0;

    const completionDates = Array.from(
      new Set(
        completedTasks.map((t) => new Date(t.completedAt!).toDateString())
      )
    ).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const latestDateStr = completionDates[0].toDateString();

    if (latestDateStr !== today && latestDateStr !== yesterday) return 0;

    let count = 0;
    let currentDate = new Date(today);
    if (latestDateStr === yesterday && completionDates[0].toDateString() !== today) {
        currentDate = new Date(yesterday);
    }

    for (let i = 0; i < completionDates.length; i++) {
        if (currentDate.toDateString() === completionDates[i].toDateString()) {
            count++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else break;
    }
    return count;
  }, [tasks]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      isScrolled 
        ? "bg-background/80 backdrop-blur-xl border-border/40 py-3 shadow-sm" 
        : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Search / Context */}
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="pl-10 pr-4 py-1.5 bg-secondary/50 border border-transparent focus:border-accent/30 focus:bg-background rounded-full text-sm outline-none w-64 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* Streak Badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full cursor-default"
          >
            <Flame className={cn(
              "w-4 h-4",
              streak > 0 ? "text-orange-500 fill-orange-500/20" : "text-muted-foreground"
            )} />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {streak}
            </span>
          </motion.div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-secondary transition-colors relative"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-background" />
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-border/60">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold truncate max-w-[120px]">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Pro Member
              </p>
            </div>
            <button className="h-9 w-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden shadow-sm hover:ring-2 hover:ring-accent/20 transition-all">
               <UserIcon className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
