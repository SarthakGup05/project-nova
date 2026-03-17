'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FolderOpen,
  ChevronDown, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  PlusCircle,
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterFolder } from '@/store/useTaskStore';

interface FolderCardProps {
  folder: FilterFolder;
  children: React.ReactNode;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onAddItem?: () => void;
}

export function FolderCard({ folder, children, onDelete, onRename, onAddItem }: FolderCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  
  const childrenCount = React.Children.count(children);

  // Close dropdown on Escape key for better accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowOptions(false);
    };
    if (showOptions) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOptions]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between group/folder relative">
        {/* Main Folder Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300 shadow-sm",
            isExpanded 
              ? "bg-blue-500 text-white shadow-blue-500/20" 
              : "bg-blue-500/10 text-blue-500 dark:text-blue-400"
          )}>
            <motion.div
              initial={false}
              animate={{ scale: isExpanded ? 1 : 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 fill-white/20" />
              ) : (
                <Folder className="w-4 h-4 fill-current opacity-20" />
              )}
            </motion.div>
          </div>
          
          <span className={cn(
            "text-sm font-bold uppercase tracking-widest flex-1 transition-colors",
            isExpanded ? "text-foreground" : "text-muted-foreground"
          )}>
            {folder.name}
          </span>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors",
              isExpanded 
                ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300" 
                : "bg-neutral-100 dark:bg-neutral-800/50 text-muted-foreground"
            )}>
              {childrenCount} {childrenCount === 1 ? 'item' : 'items'}
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]",
              isExpanded ? "rotate-0" : "-rotate-90"
            )} />
          </div>
        </button>

        {/* Folder Actions (Add & More Options) */}
        <div className="flex items-center gap-1 opacity-0 group-hover/folder:opacity-100 focus-within:opacity-100 transition-opacity absolute right-24">
          {onAddItem && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddItem(); }}
              className="p-1.5 hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              title="Add item to folder"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          )}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
              className={cn(
                "p-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                showOptions 
                  ? "bg-neutral-200 dark:bg-neutral-700 text-foreground" 
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-800 text-muted-foreground"
              )}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              {showOptions && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={(e) => { e.stopPropagation(); setShowOptions(false); }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5, transformOrigin: "top right" }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border/50 shadow-xl shadow-black/5 rounded-2xl p-1.5 z-50 overflow-hidden"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt("Rename folder", folder.name);
                        if (newName && newName.trim()) onRename(newName.trim());
                        setShowOptions(false);
                      }}
                      className="flex items-center gap-3 w-full p-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800/80 rounded-xl transition-colors active:scale-95 outline-none focus-visible:bg-neutral-100 dark:focus-visible:bg-neutral-800"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" /> 
                      Rename Folder
                    </button>
                    <div className="h-px bg-border/50 my-1 mx-2" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this folder? Items inside will be moved to Uncategorized.")) {
                          onDelete();
                        }
                        setShowOptions(false);
                      }}
                      className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors active:scale-95 outline-none focus-visible:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" /> 
                      Delete Folder
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Expandable Content Area */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            {/* Left border guideline connecting folder to items */}
            <div className="pl-5 pt-2 pb-4 ml-5 border-l-2 border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-4">
              {childrenCount > 0 ? (
                children
              ) : (
                <div className="w-full py-10 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-neutral-100 dark:border-neutral-800/60 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    Folder is empty
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}