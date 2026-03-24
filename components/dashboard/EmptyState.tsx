'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  imagePath?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, imagePath = '/notes.png', action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="relative w-48 h-48 mb-8 group">
        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-[60px] group-hover:bg-red-500/20 transition-all duration-700" />
        <motion.div
           whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
           transition={{ duration: 0.5 }}
        >
          <Image 
            src={imagePath} 
            alt="Empty state" 
            width={192} 
            height={192} 
            className="relative z-10 drop-shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
            priority
          />
        </motion.div>
      </div>
      
      <div className="space-y-4 relative z-10 px-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-foreground uppercase tracking-wider">{title}</h3>
          <p className="text-sm text-muted-foreground/80 max-w-[300px] mx-auto font-medium leading-relaxed">
            {description}
          </p>
        </div>
        
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
