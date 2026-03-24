'use client';

import React, { useMemo } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  TrendingUp, 
  Calendar, 
  PieChart,
  BarChart3,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProgressReport() {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Project distribution
    const projects: Record<string, number> = {};
    tasks.forEach(t => {
      const p = t.project || 'Inbox';
      projects[p] = (projects[p] || 0) + 1;
    });

    const projectData = Object.entries(projects)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Productivity by day (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();

    const dailyCompletions = last7Days.map(dateStr => {
      return tasks.filter(t => 
        t.isCompleted && 
        t.completedAt && 
        new Date(t.completedAt).toDateString() === dateStr
      ).length;
    });

    return {
      total,
      completed,
      completionRate,
      projectData,
      dailyCompletions,
      last7Days
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Main Stats Card */}
      <StatsCard 
        title="Total Productivity" 
        value={stats.completed} 
        subtitle={`out of ${stats.total} total tasks`}
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        progress={stats.completionRate}
        color="emerald"
      />

      <StatsCard 
        title="Completion Rate" 
        value={`${stats.completionRate}%`} 
        subtitle="Average task velocity"
        icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        progress={stats.completionRate}
        color="blue"
      />

      {/* Streak (Simplified for now) */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition-all group">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500">
            <Flame className="w-5 h-5" />
          </div>
          <Trophy className="w-5 h-5 text-muted-foreground/30 group-hover:text-orange-500/50 transition-colors" />
        </div>
        <div>
          <h3 className="text-4xl font-black tracking-tighter mb-1">Coming Soon</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Active Streak</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="md:col-span-2 lg:col-span-2 bg-neutral-900/50 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 flex flex-col shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
                <h3 className="text-lg font-bold tracking-tight">Activity Trend</h3>
                <p className="text-xs text-muted-foreground">Daily task completion (last 7 days)</p>
            </div>
            <BarChart3 className="w-4 h-4 text-muted-foreground/50" />
         </div>

         <div className="flex-1 flex items-end justify-between gap-3 min-h-[150px]">
            {stats.dailyCompletions.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="w-full relative">
                        <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${Math.max(count * 20, 10)}px` }}
                           className={cn(
                             "w-full rounded-t-xl bg-gradient-to-t transition-all duration-500",
                             count > 0 ? "from-emerald-500/80 to-emerald-400" : "from-neutral-800 to-neutral-700/50"
                           )}
                        />
                        {count > 0 && (
                            <motion.span 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-500"
                            >
                                {count}
                            </motion.span>
                        )}
                    </div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                        {stats.last7Days[i].split(' ')[0]}
                    </span>
                </div>
            ))}
         </div>
      </div>

      {/* Project Distribution */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold tracking-tight">Projects</h3>
            <PieChart className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <div className="space-y-4">
            {stats.projectData.slice(0, 4).map((p, i) => (
                <div key={p.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-neutral-400">{p.name}</span>
                        <span className="text-foreground">{p.count} tasks</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(p.count / stats.total) * 100}%` }}
                           className={cn(
                             "h-full rounded-full bg-gradient-to-r",
                             i === 0 ? "from-red-500 to-orange-500" : 
                             i === 1 ? "from-blue-500 to-indigo-500" :
                             i === 2 ? "from-emerald-500 to-teal-500" : "from-purple-500 to-pink-500"
                           )}
                        />
                    </div>
                </div>
            ))}
            {stats.projectData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 mb-2" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No data available</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
}

function StatsCard({ 
    title, 
    value, 
    subtitle, 
    icon, 
    progress, 
    color 
}: { 
    title: string; 
    value: string | number; 
    subtitle: string; 
    icon: React.ReactNode; 
    progress: number;
    color: 'emerald' | 'blue' | 'red' | 'orange'
}) {
    const colorClasses = {
        emerald: "bg-emerald-500/10 text-emerald-500",
        blue: "bg-blue-500/10 text-blue-500",
        red: "bg-red-500/10 text-red-500",
        orange: "bg-orange-500/10 text-orange-500"
    };

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={cn("p-2.5 rounded-2xl transition-colors", colorClasses[color])}>
                        {icon}
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center rounded-full border border-border/40 text-[10px] font-bold">
                        {progress}%
                    </div>
                </div>
                
                <h3 className="text-4xl font-black tracking-tighter mb-1 select-none">{value}</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{title}</p>
                <div className="mt-4 pt-4 border-t border-border/20">
                    <p className="text-[11px] text-muted-foreground/60 italic">{subtitle}</p>
                </div>
            </div>

            {/* Subtle background glow */}
            <div className={cn(
                "absolute -right-8 -bottom-8 w-24 h-24 blur-[80px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity",
                color === 'emerald' ? 'bg-emerald-500' : 
                color === 'blue' ? 'bg-blue-500' : 'bg-red-500'
            )} />
        </motion.div>
    );
}
