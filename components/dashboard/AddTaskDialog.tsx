'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { 
  Plus, Tag, Folder, Clock, Check, X, 
  MessageSquare, Flag, Sparkles, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import { cn } from "@/lib/utils";

const placeholders = [
  "Buy milk at 6pm",
  "Finish the report by Friday",
  "Call Mom this weekend",
  "Schedule dentist appointment",
  "Write unit tests for the API",
];

const PRESET_TAGS = ["Work", "Personal", "Deep Work", "Quick Task", "Health", "Social"];
const PRESET_PROJECTS = ["Inbox", "Frontend", "Backend", "Marketing", "Life"];
const PRESET_TIMES = [15, 30, 60, 120];
const PRESET_PRIORITIES = [
  { label: "Low", value: "p3", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Medium", value: "p2", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { label: "High", value: "p1", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
];

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
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("Inbox");
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [priority, setPriority] = useState<string>("p2"); // Default medium
  
  // UI Interaction state
  const [activeMenu, setActiveMenu] = useState<'tags' | 'project' | 'time' | 'priority' | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addTask = useTaskStore((state) => state.addTask);

  const handleReset = () => {
    setTaskTitle("");
    setDescription("");
    setSelectedTags([]);
    setSelectedProject("Inbox");
    setEstimatedTime(15);
    setPriority("p2");
    setActiveMenu(null);
    setShowDescription(false);
    setIsSubmitted(false);
  };

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!taskTitle.trim() || isSubmitted) return;

    setIsSubmitted(true);

    let startTime = null;
    if (initialDate && initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      const startDateTime = new Date(initialDate);
      startDateTime.setHours(hours, minutes, 0, 0);
      startTime = startDateTime.toISOString();
    }

    // Include priority as a tag for now (p1, p2, p3)
    const finalTags = [...selectedTags];
    if (priority && !finalTags.includes(priority)) {
      finalTags.push(priority);
    }

    addTask({
      title: taskTitle,
      userId: userId || "",
      isCompleted: false,
      isAiGenerated: false,
      estimatedMinutes: estimatedTime,
      project: selectedProject,
      tags: finalTags,
      dueDate: initialDate ? initialDate.toISOString() : null,
      contextDraft: description || null,
      completedAt: null,
      startTime: startTime,
    });

    onSuccess?.();

    setTimeout(() => {
      setOpen(false);
      // Reset is handled by Dialog's onOpenChange cleanup logic
    }, 1500);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const currentPriorityObj = PRESET_PRIORITIES.find(p => p.value === priority) || PRESET_PRIORITIES[1];

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setTimeout(handleReset, 300); // Clean up state after closing animation
    }}>
      <DialogTrigger asChild>
        {children || (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 mt-4 py-2.5 px-4 w-full text-left bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-red-500/50 transition-all shadow-sm"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <Plus className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-red-500 transition-colors">
              Add new task
            </span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </motion.button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-xl bg-background/95 backdrop-blur-2xl border-accent/20 overflow-hidden rounded-3xl shadow-2xl p-0">
        <AnimatePresence>
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center p-12 text-center h-[350px]"
            >
              <div className="relative">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                >
                  <Check className="w-10 h-10 text-green-500" />
                </motion.div>
                <motion.div 
                  className="absolute inset-0"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="w-full h-full rounded-full border-2 border-green-500/30" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Task Created!</h2>
              <p className="text-muted-foreground">Successfully vanished "{taskTitle}" into your list.</p>
            </motion.div>
          ) : (
            <>
              <DialogHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    New Spirit Task
                  </DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="px-6 py-6 flex flex-col gap-4">
                <div className="relative">
                  <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    onSubmit={() => onSubmit()}
                  />
                </div>

                {/* Description & Priority Fields */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDescription(!showDescription)}
                    className={cn(
                      "flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-all border",
                      showDescription 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-secondary/50 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {showDescription ? "Hide Notes" : "Add Notes"}
                  </button>
                  
                  <div className="h-4 w-px bg-border/50 mx-1" />
                  
                  {PRESET_PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-3 py-2 rounded-lg transition-all border",
                        priority === p.value 
                          ? `${p.bg} ${p.border} ${p.color}` 
                          : "bg-transparent border-transparent text-muted-foreground/50 hover:text-muted-foreground"
                      )}
                    >
                      <Flag className={cn("w-3.5 h-3.5", priority === p.value ? p.color : "text-muted-foreground/30")} fill={priority === p.value ? "currentColor" : "none"} />
                      {p.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {showDescription && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        autoFocus
                        placeholder="Add more details, links, or context..."
                        className="w-full min-h-[100px] p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-red-500/20 focus:ring-0 text-sm resize-none transition-all outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interactive Toolbar */}
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <ToolbarButton 
                      icon={<Folder className="w-4 h-4 text-blue-500" />} 
                      label={selectedProject} 
                      isActive={activeMenu === 'project'}
                      onClick={() => setActiveMenu(activeMenu === 'project' ? null : 'project')}
                    />
                    <ToolbarButton 
                      icon={<Tag className="w-4 h-4 text-purple-500" />} 
                      label={selectedTags.length > 0 ? `${selectedTags.length} labels` : "Labels"} 
                      isActive={activeMenu === 'tags' || selectedTags.length > 0}
                      onClick={() => setActiveMenu(activeMenu === 'tags' ? null : 'tags')}
                    />
                    <ToolbarButton 
                      icon={<Clock className="w-4 h-4 text-orange-500" />} 
                      label={`${estimatedTime}m`} 
                      isActive={activeMenu === 'time'}
                      onClick={() => setActiveMenu(activeMenu === 'time' ? null : 'time')}
                    />
                  </div>

                  {/* Expandable Menus */}
                  <AnimatePresence mode="wait">
                    {activeMenu === 'tags' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-xl border border-border/20"
                      >
                        {PRESET_TAGS.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5",
                              selectedTags.includes(tag) 
                                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                : "bg-background/50 text-muted-foreground border-border hover:border-primary/50"
                            )}
                          >
                            {tag} {selectedTags.includes(tag) && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {activeMenu === 'project' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-xl border border-border/20"
                      >
                        {PRESET_PROJECTS.map(proj => (
                          <button
                            key={proj}
                            type="button"
                            onClick={() => { setSelectedProject(proj); setActiveMenu(null); }}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-full border transition-all",
                              selectedProject === proj 
                                ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20" 
                                : "bg-background/50 text-muted-foreground border-border hover:border-blue-500/50"
                            )}
                          >
                            {proj}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {activeMenu === 'time' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-xl border border-border/20"
                      >
                        {PRESET_TIMES.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => { setEstimatedTime(time); setActiveMenu(null); }}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-full border transition-all",
                              estimatedTime === time 
                                ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20" 
                                : "bg-background/50 text-muted-foreground border-border hover:border-orange-500/50"
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
              
              <div className="px-6 py-4 bg-secondary/10 flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-red-500/50" />
                  Press <kbd className="px-1.5 py-0.5 rounded-md bg-muted border border-border text-[9px] font-mono">Enter</kbd> to save
                </p>
                <button
                  type="button"
                  onClick={() => onSubmit()}
                  disabled={!taskTitle.trim() || isSubmitted}
                  className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:bg-neutral-400 text-white text-sm font-bold transition-all shadow-lg shadow-red-500/20"
                >
                  Create Task
                </button>
              </div>
            </>
          )}
        </AnimatePresence>
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
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all border",
        isActive 
          ? "bg-foreground text-background border-foreground shadow-lg" 
          : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}