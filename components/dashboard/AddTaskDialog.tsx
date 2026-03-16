'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Plus, Tag, Folder, Clock, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import { cn } from "@/lib/utils"; // Assuming you have a standard cn utility

const placeholders = [
  "Buy milk at 6pm",
  "Finish the report by Friday",
  "Call Mom this weekend",
  "Schedule dentist appointment",
  "Write unit tests for the API",
];

const PRESET_TAGS = ["Urgent", "Work", "Personal", "Deep Work", "Quick Task"];
const PRESET_PROJECTS = ["Inbox", "Frontend", "Backend", "Marketing", "Life"];
const PRESET_TIMES = [15, 30, 60, 120];

export function AddTaskDialog({ 
  userId, 
  children,
  initialTime,
  initialDate,
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: { 
  userId: string; 
  children?: React.ReactNode;
  initialTime?: string | null;
  initialDate?: Date | null;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;
  
  // Task specific state
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("Inbox");
  const [estimatedTime, setEstimatedTime] = useState(30);
  
  // UI Interaction state
  const [activeMenu, setActiveMenu] = useState<'tags' | 'project' | 'time' | null>(null);

  const addTask = useTaskStore((state) => state.addTask);

  const handleReset = () => {
    setTaskTitle("");
    setSelectedTags([]);
    setSelectedProject("Inbox");
    setEstimatedTime(30);
    setActiveMenu(null);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    let startTime = null;
    if (initialDate && initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      const startDateTime = new Date(initialDate);
      startDateTime.setHours(hours, minutes, 0, 0);
      startTime = startDateTime.toISOString();
    }

    addTask({
      title: taskTitle,
      userId: userId || "",
      isCompleted: false,
      isAiGenerated: false,
      estimatedMinutes: estimatedTime,
      project: selectedProject,
      tags: selectedTags,
      dueDate: initialDate ? initialDate.toISOString() : null,
      contextDraft: null,
      completedAt: null,
      startTime: startTime,
    });

    onSuccess?.();

    setTimeout(() => {
      setOpen(false);
      handleReset();
    }, 1000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setTimeout(handleReset, 300); // Clean up state after closing animation
    }}>
      <DialogTrigger asChild>
        {children || (
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 mt-4 py-2 px-1 w-full text-left transition-colors"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full group-hover:bg-red-500/10 transition-colors">
              <Plus className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm font-medium text-neutral-500 group-hover:text-red-500 transition-colors">
              Add task
            </span>
          </motion.button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-xl bg-background/80 backdrop-blur-xl border-accent/20 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Add New Task</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 flex flex-col gap-4">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setTaskTitle(e.target.value)}
            onSubmit={onSubmit}
          />

          {/* Interactive Toolbar */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <ToolbarButton 
                icon={<Folder className="w-4 h-4" />} 
                label={selectedProject} 
                isActive={activeMenu === 'project'}
                onClick={() => setActiveMenu(activeMenu === 'project' ? null : 'project')}
              />
              <ToolbarButton 
                icon={<Tag className="w-4 h-4" />} 
                label={selectedTags.length > 0 ? `${selectedTags.length} labels` : "Labels"} 
                isActive={activeMenu === 'tags' || selectedTags.length > 0}
                onClick={() => setActiveMenu(activeMenu === 'tags' ? null : 'tags')}
              />
              <ToolbarButton 
                icon={<Clock className="w-4 h-4" />} 
                label={`${estimatedTime}m`} 
                isActive={activeMenu === 'time'}
                onClick={() => setActiveMenu(activeMenu === 'time' ? null : 'time')}
              />
            </div>

            {/* Expandable Menus */}
            <AnimatePresence mode="wait">
              {activeMenu === 'tags' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {PRESET_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1",
                        selectedTags.includes(tag) 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {tag} {selectedTags.includes(tag) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </motion.div>
              )}

              {activeMenu === 'project' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {PRESET_PROJECTS.map(proj => (
                    <button
                      key={proj}
                      type="button"
                      onClick={() => { setSelectedProject(proj); setActiveMenu(null); }}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-all",
                        selectedProject === proj 
                          ? "bg-blue-500 text-white border-blue-500" 
                          : "bg-transparent text-muted-foreground border-border hover:border-blue-500/50"
                      )}
                    >
                      {proj}
                    </button>
                  ))}
                </motion.div>
              )}

              {activeMenu === 'time' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {PRESET_TIMES.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => { setEstimatedTime(time); setActiveMenu(null); }}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-all",
                        estimatedTime === time 
                          ? "bg-orange-500 text-white border-orange-500" 
                          : "bg-transparent text-muted-foreground border-border hover:border-orange-500/50"
                      )}
                    >
                      {time} mins
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <p className="text-xs text-center text-muted-foreground pb-2">
          Press <kbd className="px-1.5 py-0.5 rounded-md bg-muted border border-border text-[10px] font-mono">Enter</kbd> to vanish your task into the list.
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for the toolbar buttons
function ToolbarButton({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
        isActive 
          ? "bg-secondary text-secondary-foreground" 
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}