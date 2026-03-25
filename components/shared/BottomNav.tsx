'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  LayoutGrid, 
  User, 
  Plus,
  CalendarDays,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Today',
    href: '/dashboard',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    label: 'Filters',
    href: '/dashboard/filters',
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    label: 'Completed',
    href: '/dashboard/completed',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: <User className="w-5 h-5" />,
  },
  {
    label: 'Awards',
    href: '/dashboard/achievements',
    icon: <Trophy className="w-5 h-5" />,
  },
];

export const BottomNav = ({ onAddTask }: { onAddTask: () => void }) => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/40 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.1)]" />
      
      <div className="relative flex items-center px-1 pb-safe pt-2 h-16 w-full max-w-lg mx-auto">
        {/* Scrollable Links Container */}
        <nav className="flex-1 flex flex-row items-center gap-1 overflow-x-auto no-scrollbar px-2" style={{ scrollSnapType: 'x mandatory' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ scrollSnapAlign: 'start' }}
                className={cn(
                  "relative flex flex-col items-center justify-center min-w-[4rem] py-1 transition-all duration-300",
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative z-10"
                >
                  {item.icon}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute -inset-2 bg-accent/10 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className="text-[10px] font-medium mt-1 transition-opacity duration-300">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Fixed Action Button */}
        <div className="shrink-0 relative -top-4 pr-3 pl-1 bg-gradient-to-l from-background/80 via-background/80 to-transparent">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddTask();
            }}
            className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg shadow-accent/40 active:scale-95 transition-transform"
          >
            <Plus className="w-7 h-7" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-2xl bg-white/20 blur-md -z-10"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
