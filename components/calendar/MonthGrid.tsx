'use client';

import React, { useMemo } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface MonthGridProps {
  selectedDate: Date;
  onDayClick: (date: Date) => void;
  onAddTaskClick: (date: Date) => void; // New prop for the plus button
}

export function MonthGrid({ selectedDate, onDayClick, onAddTaskClick }: MonthGridProps) {
  const tasks = useTaskStore((state) => state.tasks);

  // Pre-group tasks by date string for O(1) lookup performance
  const tasksByDate = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    tasks.forEach(task => {
      if (!task.startTime && !task.dueDate) return; 
      const dateStr = new Date(task.startTime || task.dueDate!).toDateString();
      if (!map.has(dateStr)) map.set(dateStr, []);
      map.get(dateStr)!.push(task);
    });
    return map;
  }, [tasks]);

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  
  const calendarDays = useMemo(() => {
    const days = [];
    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: currentMonth, year: currentYear, isCurrentMonth: true });
    }
    // Next month padding (fill exactly 42 slots)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, month: currentMonth + 1, year: currentYear, isCurrentMonth: false });
    }
    return days;
  }, [currentMonth, currentYear, daysInMonth, firstDay, prevMonthDays]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full bg-background/30 backdrop-blur-sm">
      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-border/40 bg-secondary/10 sticky top-0 z-10">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center">
            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-[minmax(120px,_1fr)] flex-1">
        {calendarDays.map((dateObj, idx) => {
          const date = new Date(dateObj.year, dateObj.month, dateObj.day);
          const dateString = date.toDateString();
          const isToday = dateString === new Date().toDateString();
          const isSelected = dateString === selectedDate.toDateString();
          
          const dayTasks = tasksByDate.get(dateString) || [];

          return (
            <motion.div 
              key={`${dateObj.month}-${dateObj.day}-${idx}`}
              whileHover={{ backgroundColor: "rgba(var(--accent-rgb), 0.03)" }}
              onClick={() => onDayClick(date)}
              className={cn(
                "relative border-r border-b border-border/20 p-2 cursor-pointer transition-colors group flex flex-col gap-1",
                !dateObj.isCurrentMonth && "opacity-40 bg-muted/20 grayscale",
                isSelected && "bg-accent/5 ring-1 ring-inset ring-accent/20"
              )}
            >
              {/* Date Header & Quick Add Button */}
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all",
                  isToday 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-110" 
                    : isSelected && !isToday 
                      ? "bg-accent/20 text-accent-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {dateObj.day}
                </span>
                
                <div className="flex items-center gap-1">
                  {/* Small dot if there are hidden tasks */}
                  {dayTasks.length > 3 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 mr-1" />
                  )}
                  {/* Quick Add Task Button (Appears on Hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the cell's onClick from firing
                      onDayClick(date); // Select the day visually
                      onAddTaskClick(date); // Open the dialog
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded-md transition-all text-muted-foreground hover:text-foreground border border-transparent hover:border-border shadow-sm hover:shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Badges */}
              <div className="flex flex-col gap-1.5 overflow-hidden flex-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={task.id}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold truncate transition-colors border",
                      task.isCompleted 
                        ? "bg-muted text-muted-foreground/60 border-transparent" 
                        : "bg-background/80 text-foreground/80 border-border shadow-sm hover:border-accent"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      task.isCompleted ? "bg-muted-foreground/40" : "bg-primary"
                    )} />
                    <span className="truncate">{task.title}</span>
                  </motion.div>
                ))}
                
                {dayTasks.length > 3 && (
                  <span className="text-[10px] font-semibold text-muted-foreground/60 pl-2">
                    +{dayTasks.length - 3} more
                  </span>
                )}
              </div>

              {/* Inner Focus Ring */}
              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 rounded-lg pointer-events-none transition-all m-0.5" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}