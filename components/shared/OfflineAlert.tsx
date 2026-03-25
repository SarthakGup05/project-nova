'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineAlert = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setShowBackOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-destructive/20 backdrop-blur-md">
            <WifiOff className="w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm font-bold">Offline Mode</p>
              <p className="text-xs opacity-90">Changes will sync when you&apos;re back.</p>
            </div>
          </div>
        </motion.div>
      )}

      {showBackOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-emerald-500 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/20 backdrop-blur-md">
            <Wifi className="w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm font-bold">Back Online</p>
              <p className="text-xs opacity-90">Synchronizing your workspace...</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
