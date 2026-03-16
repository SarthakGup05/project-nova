'use client';

import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { motion } from 'framer-motion';
import { Tag, Folder, Hash, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FiltersAndLabels() {
  const tasks = useTaskStore((state) => state.tasks);

  // Extract unique tags and their counts
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      task.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  // Extract unique projects and their counts
  const projectCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      const project = task.project || 'Inbox';
      counts[project] = (counts[project] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full space-y-12">
      {/* Projects Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Folder className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Projects</h2>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {projectCounts.map(([project, count]) => (
            <motion.div
              key={project}
              variants={item}
              whileHover={{ y: -2 }}
              className="group p-4 rounded-2xl border border-border/40 bg-card/40 hover:border-blue-500/30 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors uppercase tracking-wider">
                    {project}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {count} {count === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-blue-500 group-hover:text-muted-foreground/100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tags / Labels Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-accent/10 text-accent">
            <Tag className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Labels</h2>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-3"
        >
          {tagCounts.length > 0 ? tagCounts.map(([tag, count]) => (
            <motion.div
              key={tag}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/40 hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer shadow-sm group"
            >
              <Hash className="w-3.5 h-3.5 text-accent/60 group-hover:text-accent transition-colors" />
              <span className="text-sm font-semibold">{tag}</span>
              <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-md font-bold min-w-[1.5rem] text-center">
                {count}
              </span>
            </motion.div>
          )) : (
            <p className="text-sm text-muted-foreground italic">No labels created yet. Add tags to your tasks to see them here.</p>
          )}
        </motion.div>
      </section>
    </div>
  );
}
