'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconClassName,
  className 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
      className={cn(
        "bg-white dark:bg-[#1a1f2e] border border-neutral-200 dark:border-neutral-800/50 p-5 rounded-2xl shadow-sm transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400",
          iconClassName
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
          {subtitle && (
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              {subtitle}
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
    </motion.div>
  );
}
