'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Trophy, 
  Flame, 
  Target, 
  Sparkles, 
  CheckCircle,
  Activity,
  Star
} from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { 
  calculateXP, 
  calculateStreaks, 
  getWeeklyCompletionData 
} from '@/lib/achievementUtils';
import { StatsCard } from '@/components/dashboard/achievements/StatsCard';
import { StreakCalendar } from '@/components/dashboard/achievements/StreakCalendar';
import { BadgeItem } from '@/components/dashboard/achievements/BadgeItem';
import { cn } from '@/lib/utils';

// Enhanced animation variants for a smoother, premium feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  }
} as const;

export default function AchievementsPage() {
  const tasks = useTaskStore(state => state.tasks);
  
  const totalXP = calculateXP(tasks);
  const streaks = calculateStreaks(tasks);
  const weeklyData = getWeeklyCompletionData(tasks);
  const completedCount = tasks.filter(t => t.isCompleted).length;

  // Calculate unlocked badges for the progress indicator
  const unlockedBadgesCount = [
    true, // Early Adopter is always unlocked
    streaks.longest >= 3,
    completedCount >= 10,
    false, // Task Architect
    false, // Nova Legend
    false  // Zen Master
  ].filter(Boolean).length;
  const totalBadges = 6;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-6xl mx-auto px-6 py-10 pb-20 relative"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <motion.header variants={itemVariants} className="mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-[0.2em]">
          <Trophy className="w-3.5 h-3.5" />
          <span>Progress & Rewards</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          My Achievements
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl">
          Track your execution velocity, maintain your daily streaks, and unlock exclusive badges for your consistency.
        </p>
      </motion.header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content: Stats & Streaks */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
            <StatsCard 
              title="XP Earned" 
              value={totalXP} 
              icon={Zap} 
              iconClassName="text-yellow-500 bg-yellow-500/10"
              className="border-yellow-500/20 shadow-sm hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all"
            />
            <StatsCard 
              title="Tasks Completed" 
              value={completedCount} 
              icon={Target} 
              iconClassName="text-accent bg-accent/10"
              className="border-accent/20 shadow-sm hover:shadow-accent/10 hover:border-accent/40 transition-all"
            />
            <StatsCard 
              title="Current Streak" 
              value={streaks.current} 
              subtitle="/ 7 days"
              icon={Flame} 
              iconClassName="text-orange-500 bg-orange-500/10"
              className={cn(
                "transition-all shadow-sm",
                streaks.current > 0 ? "border-orange-500/40 shadow-orange-500/10 bg-orange-500/5" : "border-border/50"
              )}
            />
            <StatsCard 
              title="Longest Streak" 
              value={streaks.longest} 
              subtitle="Days"
              icon={Sparkles} 
              iconClassName="text-purple-500 bg-purple-500/10"
              className="border-purple-500/20 shadow-sm hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all"
            />
          </motion.div>

          {/* Streaks Calendar */}
          <motion.div variants={itemVariants} className="hover:shadow-md transition-shadow duration-300 rounded-3xl">
            <StreakCalendar completedDays={weeklyData} />
          </motion.div>

          {/* Badges Section - Refactored into a "Trophy Cabinet" */}
          <motion.div variants={itemVariants} className="pt-4">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
              {/* Decorative background star */}
              <Star className="absolute -bottom-12 -right-12 w-48 h-48 text-muted/30 rotate-12 pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative z-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center shadow-inner">
                      <Trophy className="w-5 h-5 text-accent" />
                    </div>
                    Trophy Cabinet
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium pl-14">
                    Unlock badges by hitting execution milestones.
                  </p>
                </div>
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
                  <span className="text-2xl font-black text-foreground">{unlockedBadgesCount}</span>
                  <span className="text-sm font-bold text-muted-foreground">/ {totalBadges}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Unlocked</span>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                  <BadgeItem 
                    name="Early Adopter" 
                    description="Joined the Nova Private Beta"
                    tier="bronze"
                    isUnlocked={true}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                  <BadgeItem 
                    name="3-Day Warrior" 
                    description="Maintained a 3-day execution streak"
                    tier="silver"
                    isUnlocked={streaks.longest >= 3}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                  <BadgeItem 
                    name="Consistency King" 
                    description="Complete 10 tasks in total"
                    tier="gold"
                    isUnlocked={completedCount >= 10}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                  <BadgeItem 
                    name="Task Architect" 
                    description="Create 5 custom projects"
                    tier="platinum"
                    isUnlocked={false}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                  <BadgeItem 
                    name="Nova Legend" 
                    description="Reach a 30-day streak"
                    tier="diamond"
                    isUnlocked={false}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                  <BadgeItem 
                    name="Zen Master" 
                    description="Zero tasks pending for 7 days"
                    tier="platinum"
                    isUnlocked={false}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Daily Activities */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {/* Quest Log Card */}
            <div className="bg-neutral-950 border border-neutral-800 p-7 rounded-[2rem] shadow-2xl relative overflow-hidden group">
              {/* Animated Background Glows */}
              <div className="absolute -top-24 -right-24 w-56 h-56 bg-orange-500/20 blur-[60px] rounded-full group-hover:bg-orange-500/30 transition-all duration-700" />
              <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-accent/10 blur-[60px] rounded-full group-hover:bg-accent/20 transition-all duration-700" />
              
              <div className="relative z-10 space-y-6 text-neutral-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center border border-orange-500/30 shadow-inner">
                    <Flame className={cn("w-6 h-6 text-orange-400", streaks.current > 0 && "animate-pulse")} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Daily Quests</h3>
                    <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mt-0.5">Active Logs</p>
                  </div>
                </div>
                
                <p className="text-neutral-300 text-sm leading-relaxed font-medium">
                  Complete any one activity each day to secure your streak and climb the ranks.
                </p>

                <div className="space-y-4 pt-2">
                  {/* Quest 1 */}
                  <div className={cn(
                    "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden",
                    streaks.current > 0 
                      ? "bg-emerald-500/10 border-emerald-500/30" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  )}>
                    {/* Completion Shine Effect */}
                    {streaks.current > 0 && (
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -skew-x-12"
                      />
                    )}
                    
                    <div className="mt-0.5 shrink-0 z-10">
                      {streaks.current > 0 ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                          <Activity className="w-3 h-3 text-neutral-500" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 z-10">
                      <h4 className={cn("font-bold text-sm", streaks.current > 0 ? "text-emerald-100" : "text-neutral-200")}>
                        Execute 1 Task
                      </h4>
                      <p className={cn("text-xs leading-relaxed font-medium", streaks.current > 0 ? "text-emerald-200/70" : "text-neutral-400")}>
                        {streaks.current > 0 ? "Daily streak secured! Awesome work." : "Check off your first task to earn today's streak."}
                      </p>
                    </div>
                  </div>

                  {/* Quest 2 */}
                  <div className={cn(
                    "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300",
                    completedCount >= 3
                      ? "bg-accent/10 border-accent/30"
                      : "bg-white/5 border-white/10 opacity-70"
                  )}>
                    <div className="mt-0.5 shrink-0">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border",
                        completedCount >= 3 ? "bg-accent/20 border-accent/40" : "bg-neutral-800 border-neutral-700"
                      )}>
                        <Zap className={cn("w-3.5 h-3.5", completedCount >= 3 ? "text-accent" : "text-neutral-500")} />
                      </div>
                    </div>
                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center justify-between">
                        <h4 className={cn("font-bold text-sm", completedCount >= 3 ? "text-accent-100" : "text-neutral-200")}>
                          Task Master
                        </h4>
                        <span className="text-[10px] font-bold text-neutral-500">{Math.min(completedCount, 3)}/3</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                        Crush 3 total tasks to boost your ranking.
                      </p>
                      {/* Mini Progress Bar */}
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mt-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((completedCount / 3) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn("h-full rounded-full", completedCount >= 3 ? "bg-accent" : "bg-neutral-500")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-200 font-extrabold text-sm transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 group/btn mt-2">
                  View Leaderboard
                  {/* FIX: Moved stray props into className string */}
                  <motion.span 
                    className="inline-block group-hover/btn:translate-x-1 transition-transform"
                  >→</motion.span>
                </button>
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-2 h-full bg-gradient-to-b from-accent/50 to-transparent opacity-50" />
              <h4 className="text-[11px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Pro Tip
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Consistency outpaces volume. Use the <strong className="text-foreground">Daily Quests</strong> to maintain your momentum even on light work days.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}