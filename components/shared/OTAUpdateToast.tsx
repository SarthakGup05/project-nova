'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OTAUpdateToast() {
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShow(true);
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    return () => window.removeEventListener('pwa-update-available', handleUpdateAvailable);
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // The page will reload once the new SW activates. But we can explicitly reload after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-[5.5rem] md:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-background/80 backdrop-blur-2xl border border-primary/20 p-4 rounded-3xl shadow-2xl flex items-center gap-4 overflow-hidden relative">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary relative z-10">
              <DownloadCloud className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0 relative z-10">
              <h4 className="text-sm font-bold text-foreground">Update Available</h4>
              <p className="text-xs text-muted-foreground truncate">A new version of Nova is ready.</p>
            </div>

            <div className="flex items-center gap-2 relative z-10 shrink-0">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="h-8 rounded-full px-4 bg-primary text-primary-foreground font-bold text-xs"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
              <button 
                onClick={() => setShow(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                disabled={isUpdating}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
