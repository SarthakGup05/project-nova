'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Bell, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const notifications = [
    {
      id: '1',
      title: 'Daily Goal Achieved!',
      description: 'You completed all your tasks for today. Keep the streak alive!',
      time: '2h ago',
      icon: <Sparkles className="w-4 h-4 text-accent" />,
      type: 'success',
      unread: true
    },
    {
      id: '2',
      title: 'AI Insight',
      description: 'Based on your history, Friday afternoon is your most productive time.',
      time: '5h ago',
      icon: <Bell className="w-4 h-4 text-blue-500" />,
      type: 'info',
      unread: false
    }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 z-40 md:hidden" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute right-0 mt-3 w-80 md:w-96 bg-background dark:bg-neutral-900 border border-border pb-2 rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
            Notifications
            <span className="bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              2
            </span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={cn(
                "p-4 border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer group",
                notif.unread && "bg-accent/5"
              )}
            >
              <div className="flex gap-3">
                <div className="mt-1 shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-border">
                  {notif.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm leading-tight text-foreground">
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {notif.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 px-4">
          <button className="w-full py-2 text-xs font-bold text-muted-foreground hover:text-accent transition-colors flex items-center justify-center gap-2">
            View all notifications
          </button>
        </div>
      </motion.div>
    </>
  );
}
