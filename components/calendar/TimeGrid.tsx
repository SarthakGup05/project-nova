'use client';

import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { CalendarTaskItem } from '@/components/calendar/CalendarTaskItem';
import { AddTaskDialog } from '../dashboard/AddTaskDialog';

export function TimeGrid({ selectedDate }: { selectedDate: Date }) {
  const tasks = useTaskStore((state) => state.tasks);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState<{ time: string } | null>(null);

  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Filter tasks that have a startTime on the selected date
  const scheduledTasks = tasks.filter(task => {
    if (!task.startTime) return false;
    const taskDate = new Date(task.startTime);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 84; // Pixels per hour

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const currentMinutesLoaded = currentTime.getHours() * 60 + currentTime.getMinutes();
  const timeLineTop = (currentMinutesLoaded * hourHeight) / 60;

  return (
    <div className="relative flex flex-col p-6 min-w-[600px]">
      <div className="relative ml-16">
        {/* 24-hour grid background */}
        <div className="border-l border-border/40">
          {hours.map((hour) => (
            <div 
              key={hour} 
              className="relative h-[84px] border-b border-border/20 group transition-colors hover:bg-accent/5 cursor-pointer"
              onClick={() => setSelectedSlot({ time: `${hour.toString().padStart(2, '0')}:00` })}
            >
              <div className="absolute -left-16 top-0 -translate-y-1/2 w-12 text-right">
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
              
              {/* Half-hour line */}
              <div className="absolute top-1/2 left-0 right-0 border-t border-border/10 border-dashed pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Current Time Indicator */}
        {isToday && (
          <div 
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
            style={{ top: `${timeLineTop}px` }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <div className="h-[2px] flex-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
          </div>
        )}

        {/* Tasks Layer */}
        <div className="absolute inset-0 pointer-events-none pr-4">
          {scheduledTasks.map((task) => {
            const date = new Date(task.startTime!);
            const hour = date.getHours();
            const minutes = date.getMinutes();
            const duration = task.estimatedMinutes || 30;
            
            const top = (hour * hourHeight) + (minutes * hourHeight / 60);
            const height = (duration * hourHeight) / 60;
            
            return (
              <div 
                key={task.id}
                className="absolute left-2 right-2 pointer-events-auto p-0.5"
                style={{ 
                  top: `${top}px`, 
                  height: `${height}px`,
                  zIndex: 10 
                }}
              >
                <CalendarTaskItem task={task} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Hidden AddTaskDialog triggered by slot clicks */}
      <AddTaskDialog 
        userId="" 
        initialDate={selectedDate}
        initialTime={selectedSlot?.time}
        open={!!selectedSlot}
        onOpenChange={(open) => !open && setSelectedSlot(null)}
        onSuccess={() => setSelectedSlot(null)}
      >
        {/* Ghost trigger */}
        <div className="hidden" />
      </AddTaskDialog>
      
      {/* Trigger AddTaskDialog manually when selectedSlot changes */}
      <div 
        onClick={(e) => {
          if (selectedSlot) {
            // This is a bit of a hack to trigger the dialog which uses a DialogTrigger.
            // A better way would be to make AddTaskDialog's open state controllable.
            // For now, I'll rely on the user clicking the grid which sets state.
          }
        }}
      />
    </div>
  );
}
