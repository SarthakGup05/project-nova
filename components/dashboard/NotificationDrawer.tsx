'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  Trash2, 
  CheckCheck,
  Calendar,
  Sparkles,
  Trophy,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationStore, Notification } from '@/store/useNotificationStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-border z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-card/30 backdrop-blur-md">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Bell className="w-6 h-6 text-primary" />
                  Alerts
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {unreadCount} unread messages
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="px-6 py-3 border-b border-border flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/20">
              <button 
                onClick={markAllAsRead}
                className="flex items-center gap-2 hover:text-primary transition-colors"
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
              <button 
                onClick={clearAll}
                className="flex items-center gap-2 hover:text-red-500 transition-colors"
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear history
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <DrawerItem 
                      key={notif.id} 
                      notification={notif} 
                      onMarkRead={() => markAsRead(notif.id)}
                      onRemove={() => removeNotification(notif.id)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Your workspace is quiet
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerItem({ 
  notification, 
  onMarkRead, 
  onRemove 
}: { 
  notification: Notification; 
  onMarkRead: () => void;
  onRemove: () => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <Info className="w-4 h-4 text-emerald-500" />;
      case 'ai': return <Sparkles className="w-4 h-4 text-accent" />;
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative p-4 rounded-2xl border transition-all duration-300 group cursor-pointer",
        notification.isRead 
          ? "border-border/40 bg-card/20" 
          : "border-primary/20 bg-primary/5 shadow-sm"
      )}
      onClick={onMarkRead}
    >
      <div className="flex gap-4">
        <div className={cn(
          "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border",
          notification.isRead ? "bg-muted border-border" : "bg-primary/10 border-primary/20"
        )}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "text-[13px] font-black uppercase tracking-wider truncate",
              notification.isRead ? "text-muted-foreground/80" : "text-foreground"
            )}>
              {notification.title}
            </h4>
            <span className="text-[10px] font-bold text-muted-foreground/60 whitespace-nowrap mt-0.5">
              {timeAgo(notification.timestamp)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>

      {/* Delete button on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded-md text-red-500"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
