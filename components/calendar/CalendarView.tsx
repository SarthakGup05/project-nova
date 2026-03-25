'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { MonthGrid } from '@/components/calendar/MonthGrid';
import { AddTaskDialog } from '@/components/dashboard/AddTaskDialog';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  
  // State for the Task Dialog
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskTargetDate, setTaskTargetDate] = useState<Date>(new Date());

  const formattedMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const formattedYear = currentDate.toLocaleDateString('en-US', { year: 'numeric' });

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const handleToday = () => {
    const today = new Date();
    setDirection(today > currentDate ? 1 : -1);
    setCurrentDate(today);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden shadow-2xl relative">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-border/50 bg-secondary/20 gap-4 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
          <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-accent shadow-lg shadow-accent/20 flex items-center justify-center text-accent-foreground">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-xl sm:text-3xl font-black tracking-tighter text-foreground truncate">
              {formattedMonth}
            </h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-[0.2em]">
              {formattedYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background/40 p-1.5 rounded-2xl border border-border/50 shadow-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevMonth}
            className="p-2 hover:bg-background rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToday}
            className="px-4 py-2 text-xs font-bold bg-background/50 hover:bg-background rounded-xl transition-colors"
          >
            Today
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextMonth}
            className="p-2 hover:bg-background rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-hidden relative bg-background/20">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentDate.toISOString()}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="h-full w-full absolute inset-0 overflow-auto custom-scrollbar"
          >
            <MonthGrid
              selectedDate={currentDate}
              onDayClick={(date) => setCurrentDate(date)}
              onAddTaskClick={(date) => {
                setTaskTargetDate(date);
                setIsTaskDialogOpen(true);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The Dialog component is mounted here. 
        It remains invisible until isTaskDialogOpen becomes true.
      */}
      <AddTaskDialog
        userId="user_123" // Replace with your actual auth user ID
        initialDate={taskTargetDate}
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
      >
        {/* Invisible trigger so the dialog doesn't render an extra button */}
        <span className="hidden"></span>
      </AddTaskDialog>
    </div>
  );
}