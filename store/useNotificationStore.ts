import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NotificationType = 'info' | 'success' | 'warning' | 'achievement' | 'ai';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: 'welcome',
          type: 'achievement',
          title: 'Welcome to Project Nova!',
          message: 'Start by creating your first project and check off some tasks.',
          timestamp: new Date().toISOString(),
          isRead: false
        }
      ],
      addNotification: (notif) => set((state) => ({
        notifications: [
          {
            ...notif,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            isRead: false
          },
          ...state.notifications
        ]
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearAll: () => set({ notifications: [] })
    }),
    {
      name: 'nova-notifications-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
