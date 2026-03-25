'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after components are mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/20 border border-border/40 animate-pulse" />
    );
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      id="theme-toggle"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        "relative p-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300",
        "bg-secondary/40 hover:bg-secondary border border-border/40 shadow-sm overflow-hidden group"
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-accent fill-accent/10" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500/10" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative background glow */}
      <span className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
