'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Flame, 
  User as UserIcon, 
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/useTaskStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NotificationDrawer } from './NotificationDrawer';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { ModeToggle } from './ModeToggle';

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Calculate Streak
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
    // Listen to the specific scroll container defined in your layout
    const scrollContainer = document.getElementById('main-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Use scrollTop instead of window.scrollY because the container is scrolling, not the body
      setIsScrolled(scrollContainer.scrollTop > 10);
    };

    // Attach listener to the container
    scrollContainer.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full h-16 md:h-20 transition-colors duration-300 border-b",
      isScrolled 
        ? "bg-background/95 backdrop-blur-xl border-border/40 shadow-sm" 
        : "bg-background md:bg-transparent border-transparent"
    )}>
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        
        {/* Left: Search / Context */}
        <div className="flex items-center gap-4 flex-1">
          <div id="header-search" className="relative group hidden md:block max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="pl-10 pr-4 py-2 bg-secondary/50 border border-transparent focus:border-accent/30 focus:bg-background rounded-full text-sm outline-none w-full max-w-[260px] transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
          
          {/* Streak Badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full cursor-default"
          >
            <Flame className={cn(
              "w-3.5 h-3.5 sm:w-4 sm:h-4",
              streak > 0 ? "text-orange-500 fill-orange-500/20" : "text-muted-foreground"
            )} />
            <span className="text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400">
              {streak}
            </span>
          </motion.div>

          {/* Notifications */}
          <div className="relative flex items-center">
            <button 
              onClick={() => setShowDrawer(true)}
              className="p-2 rounded-full hover:bg-secondary transition-all relative group/bell"
              aria-label="Notifications"
            >
              <Bell className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 transition-all",
                unreadCount > 0 ? "text-primary animate-wiggle" : "text-muted-foreground group-hover/bell:text-foreground"
              )} />
              
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary border-2 border-background"></span>
                </span>
              )}
            </button>
            
            <NotificationDrawer 
              isOpen={showDrawer} 
              onClose={() => setShowDrawer(false)} 
            />
          </div>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Profile */}
          <Link 
            href="/dashboard/profile"
            className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/60 hover:opacity-80 transition-opacity active:scale-95"
          >
            <div className="hidden text-right lg:block">
              <p className="text-sm font-semibold truncate max-w-[120px]">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Pro Member
              </p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden shadow-sm hover:ring-2 hover:ring-accent/20 transition-all flex-shrink-0">
               {user?.user_metadata?.avatar_url ? (
                 <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
               )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}