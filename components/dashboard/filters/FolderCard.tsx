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
  Inbox,
  Sparkles
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
  const isProject = folder.type === 'project';

  // Close dropdown on Escape key
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
    <div className={cn(
      "group/folder-container relative rounded-[2rem] border transition-all duration-500 overflow-hidden",
      isExpanded 
        ? "bg-white/40 dark:bg-neutral-900/40 border-border/60 shadow-xl shadow-black/5" 
        : "bg-transparent border-transparent"
    )}>
      {/* Subtle background glow when expanded */}
      {isExpanded && (
        <div className={cn(
          "absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[80px] -z-10 opacity-20 pointer-events-none transition-colors duration-500",
          isProject ? "bg-blue-500" : "bg-accent"
        )} />
      )}

      <div className="p-2">
        <div className="flex items-center justify-between group/folder relative">
          {/* Main Folder Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 flex-1 text-left outline-none focus-visible:ring-2",
              isExpanded 
                ? "bg-white dark:bg-neutral-800 shadow-sm" 
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800/60",
              isProject ? "focus-visible:ring-blue-500/50" : "focus-visible:ring-accent/50"
            )}
          >
            <div className={cn(
              "p-2.5 rounded-xl transition-all duration-500 shadow-inner",
              isExpanded 
                ? isProject 
                  ? "bg-blue-600 text-white shadow-blue-500/20 rotate-0" 
                  : "bg-accent text-accent-foreground shadow-accent/20 rotate-0"
                : isProject
                  ? "bg-blue-500/10 text-blue-500 dark:text-blue-400 rotate-[-8deg]"
                  : "bg-accent/10 text-accent rotate-[-8deg]"
            )}>
              <motion.div
                initial={false}
                animate={{ scale: isExpanded ? 1 : 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isExpanded ? (
                  <FolderOpen className="w-4 h-5 fill-current opacity-80" />
                ) : (
                  <Folder className="w-4 h-5 fill-current opacity-40" />
                )}
              </motion.div>
            </div>
            
            <div className="flex flex-col flex-1">
              <span className={cn(
                "text-sm font-black uppercase tracking-[0.15em] transition-colors",
                isExpanded ? "text-foreground" : "text-muted-foreground"
              )}>
                {folder.name}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  {childrenCount} {childrenCount === 1 ? 'item' : 'items'}
                </span>
                {isExpanded && childrenCount > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      isProject ? "bg-blue-500" : "bg-accent"
                    )} 
                  />
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground/60 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                isExpanded ? "rotate-0" : "-rotate-90"
              )} />
            </div>
          </button>

          {/* Folder Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover/folder:opacity-100 focus-within:opacity-100 transition-all duration-300 absolute right-20">
            {onAddItem && (
              <button 
                onClick={(e) => { e.stopPropagation(); onAddItem(); }}
                className={cn(
                  "p-2 rounded-xl transition-all outline-none focus-visible:ring-2",
                  isProject 
                    ? "hover:bg-blue-500/10 text-blue-500 focus-visible:ring-blue-500/50" 
                    : "hover:bg-accent/10 text-accent focus-visible:ring-accent/50"
                )}
                title="Add item to folder"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
                className={cn(
                  "p-2 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                  showOptions 
                    ? "bg-neutral-200 dark:bg-neutral-700 text-foreground" 
                    : "hover:bg-neutral-200 dark:hover:bg-neutral-800 text-muted-foreground"
                )}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showOptions && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowOptions(false); }} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10, transformOrigin: "top right" }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-52 bg-card/90 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl p-2 z-50"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt("Rename folder", folder.name);
                          if (newName && newName.trim()) onRename(newName.trim());
                          setShowOptions(false);
                        }}
                        className="flex items-center gap-3 w-full p-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all active:scale-95"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground" /> 
                        Rename
                      </button>
                      <div className="h-px bg-border/40 my-1 mx-2" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this folder? Items inside will be moved to Uncategorized.")) {
                            onDelete();
                          }
                          setShowOptions(false);
                        }}
                        className="flex items-center gap-3 w-full p-2.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> 
                        Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
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
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <div className={cn(
                "p-6 rounded-[1.5rem] flex flex-wrap gap-4 min-h-[120px]",
                isProject 
                  ? "bg-blue-500/[0.03] border border-blue-500/10" 
                  : "bg-accent/[0.03] border border-accent/10"
              )}>
                {childrenCount > 0 ? (
                  children
                ) : (
                  <div className="w-full flex flex-col items-center justify-center gap-3 py-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                      isProject ? "bg-blue-500/10 text-blue-500/40" : "bg-accent/10 text-accent/40"
                    )}>
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                        Empty Folder
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                        Move items here to organize
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}