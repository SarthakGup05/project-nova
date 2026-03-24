'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X,
  Info,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationStore, Notification } from '@/store/useNotificationStore';

export function NotificationToast() {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const [activeNotifs, setActiveNotifs] = useState<Notification[]>([]);

  // Only show the 3 most recent unread notifications as toasts
  useEffect(() => {
    setActiveNotifs(notifications.filter(n => !n.isRead).slice(0, 3));
  }, [notifications]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-[400px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {activeNotifs.map((notif) => (
          <ToastItem 
            key={notif.id} 
            notification={notif} 
            onClose={() => removeNotification(notif.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'ai': return <Sparkles className="w-5 h-5 text-accent" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getGlow = () => {
    switch (notification.type) {
      case 'success': return 'rgba(16, 185, 129, 0.15)';
      case 'warning': return 'rgba(245, 158, 11, 0.15)';
      case 'achievement': return 'rgba(234, 179, 8, 0.15)';
      case 'ai': return 'rgba(59, 130, 246, 0.15)';
      default: return 'rgba(59, 130, 246, 0.15)';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      className="pointer-events-auto relative group"
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 blur-2xl rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: getGlow() }}
      />
      
      <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl p-4 shadow-2xl flex gap-4">
        {/* Border Beam Animation Effect (CSS only) */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-border shadow-inner">
            {getIcon()}
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-foreground">{notification.title}</h4>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed leading-snug">
            {notification.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
