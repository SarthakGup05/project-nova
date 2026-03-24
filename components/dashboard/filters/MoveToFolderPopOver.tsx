'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderInput, Check, ChevronRight, Hash, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterFolder } from '@/store/useTaskStore';

interface MoveToFolderPopOverProps {
  currentFolderId?: string;
  folders: FilterFolder[];
  onMove: (folderId: string | 'none') => void;
  type: 'tag' | 'project';
  itemName: string;
}

export function MoveToFolderPopOver({ 
  currentFolderId, 
  folders, 
  onMove, 
  type,
  itemName 
}: MoveToFolderPopOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredFolders = folders.filter(f => f.type === type);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
          isOpen 
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-110" 
            : "bg-blue-500/5 hover:bg-blue-500/10 text-blue-500"
        )}
        title="Move to folder"
      >
        <FolderInput className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, transformOrigin: 'top center' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 z-[100]"
          >
            {/* Arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-card border-t border-l border-border/40 rotate-45 z-0" />
            
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-10">
              <div className="p-3 border-b border-border/40 bg-muted/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  {type === 'tag' ? <Hash className="w-3 h-3" /> : <Folder className="w-3 h-3" />}
                  Move {itemName}
                </p>
              </div>

              <div className="p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => {
                    onMove('none');
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 group",
                    !currentFolderId 
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-muted-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    Uncategorized
                  </span>
                  {!currentFolderId && <Check className="w-3 h-3" />}
                </button>

                {filteredFolders.length > 0 && (
                  <>
                    <div className="h-px bg-border/40 my-1.5 mx-2" />
                    {filteredFolders.map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => {
                          onMove(folder.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 group",
                          currentFolderId === folder.id
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-foreground/80"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight className={cn(
                            "w-3 h-3 transition-transform",
                            currentFolderId === folder.id ? "rotate-90 text-blue-500" : "text-muted-foreground group-hover:translate-x-0.5"
                          )} />
                          {folder.name}
                        </span>
                        {currentFolderId === folder.id && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
