'use client';

import { useTaskStore, Task } from '@/store/useTaskStore';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  MessageSquare,
  PlayCircle,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
// Removed date-fns import to fix "Module not found" error

export default function ProjectPage() {
  const params = useParams();
  const projectName = decodeURIComponent(params.name as string);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  
  const projectTasks = useMemo(() => {
    return tasks.filter(t => t.project === projectName);
  }, [tasks, projectName]);

  // Group tasks by a simple logic for now: Active and Completed
  // In a real app, you might have a 'section' field.
  const groupedTasks = useMemo(() => {
    const activeTasks = projectTasks.filter(t => !t.isCompleted);
    const completedTasks = projectTasks.filter(t => t.isCompleted);
    
    return [
      { id: 'active', title: projectName, tasks: activeTasks, itemsCount: activeTasks.length },
      { id: 'completed', title: 'Completed', tasks: completedTasks, itemsCount: completedTasks.length }
    ].filter(group => group.tasks.length > 0);
  }, [projectTasks, projectName]);

  if (projectTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 mb-6 bg-accent/5 rounded-full flex items-center justify-center">
          <Circle className="w-10 h-10 opacity-20" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">No tasks in this project</h2>
        <p className="max-w-xs text-center mt-2">Start adding tasks to see them organized here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10 animate-in fade-in duration-700">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{projectName} 👋</h1>
        </div>
        <button className="p-2 hover:bg-accent/10 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <div className="space-y-8">
        {groupedTasks.map((group) => (
          <TaskGroup 
            key={group.id} 
            title={group.title} 
            itemsCount={group.itemsCount}
            tasks={group.tasks}
            onToggleTask={(task) => updateTask(task.id, { isCompleted: !task.isCompleted })}
          />
        ))}
      </div>
    </div>
  );
}

function TaskGroup({ 
  title, 
  itemsCount, 
  tasks,
  onToggleTask
}: { 
  title: string; 
  itemsCount: number; 
  tasks: Task[];
  onToggleTask: (task: Task) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="border-b border-border/40 pb-6 last:border-0">
      <div 
        className="flex items-center justify-between group cursor-pointer py-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground group-hover:text-foreground transition-colors">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <h2 className="text-sm font-bold text-foreground/90 flex items-center gap-2">
            {title} <span className="text-muted-foreground/60 font-normal">{itemsCount}</span>
          </h2>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent/10 rounded-md transition-all">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2">
              {tasks.map((task) => (
                <ProjectTaskItem key={task.id} task={task} onToggle={() => onToggleTask(task)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectTaskItem({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      layout
      className="flex gap-4 p-3 rounded-xl hover:bg-accent/5 transition-all group/item items-start"
    >
      <button 
        onClick={onToggle}
        className={cn(
          "shrink-0 mt-1 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
          task.isCompleted 
            ? "bg-muted-foreground/20 border-transparent text-muted-foreground/40" 
            : "border-muted-foreground/30 group-hover/item:border-muted-foreground hover:bg-accent/10"
        )}
      >
        {task.isCompleted && <CheckCircle2 className="w-3 h-3" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-base font-medium transition-all",
            task.isCompleted ? "text-muted-foreground line-through opacity-60" : "text-foreground"
          )}>
            {task.title}
          </p>
          {task.tags && task.tags.length > 0 && (
            <span className="text-[10px] text-muted-foreground bg-accent/10 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
              (Watch)
            </span>
          )}
        </div>
        
        {task.contextDraft && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {task.contextDraft}
          </p>
        )}

        <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-destructive/80 shrink-0">
              <Clock className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          )}
          
          <div className="flex items-center gap-1 shrink-0">
            <MessageSquare className="w-3 h-3" />
            <span>1</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground/60 shrink-0">
            <PlayCircle className="w-3 h-3" />
            <span className="hover:underline cursor-pointer">Watch Video</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
