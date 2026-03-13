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
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";

const placeholders = [
  "Buy milk at 6pm",
  "Finish the report by Friday",
  "Call Mom this weekend",
  "Schedule dentist appointment",
  "Write unit tests for the API",
];

export function AddTaskDialog({ userId, children }: { userId: string, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const addTask = useTaskStore((state) => state.addTask);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    // Call the store action
    addTask({
      title: taskTitle,
      userId: userId || "", // This needs to be robust
      isCompleted: false,
      isAiGenerated: false,
      estimatedMinutes: 15,
      project: "Inbox",
      tags: [],
      dueDate: null,
      contextDraft: null,
      completedAt: null,
    });

    // Close dialog after a short delay for the vanish effect
    setTimeout(() => {
      setOpen(false);
      setTaskTitle("");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="sm:max-w-xl bg-background/80 backdrop-blur-xl border-accent/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Add New Task</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setTaskTitle(e.target.value)}
            onSubmit={onSubmit}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Press Enter to vanish your task into the list.
        </p>
      </DialogContent>
    </Dialog>
  );
}
