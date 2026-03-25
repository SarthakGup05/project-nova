'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { ProgressReport } from '@/components/dashboard/ProgressReport';
import { 
  User as UserIcon, 
  Settings, 
  Share2, 
  Calendar,
  Mail,
  ShieldCheck,
  Trophy,
  Sparkles,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-16 pb-24">
      
      {/* Hero / Cover Section */}
      <section className="relative w-full rounded-[2.5rem] bg-card border border-border/50 shadow-sm overflow-hidden">
        {/* Cover Photo Gradient / Pattern */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-emerald-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="px-6 sm:px-10 pb-10 relative mt-[-4rem] md:mt-[-5rem]">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            
            {/* Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative group"
            >
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] bg-background p-2 shadow-xl ring-1 ring-border/50 relative z-10 transition-transform duration-300 group-hover:scale-105">
                <div className="h-full w-full rounded-[1.5rem] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-muted-foreground/50" />
                  )}
                </div>
              </div>
              {/* Verification Badge */}
              <div className="absolute bottom-2 right-2 p-1.5 bg-emerald-500 rounded-xl border-[3px] border-background shadow-lg z-20" title="Verified Member">
                <ShieldCheck className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-3 pb-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row md:items-center gap-3"
              >
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member'}
                </h1>
                <div className="flex items-center justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Pro Plan
                  </span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 opacity-70" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-70" />
                  <span>Joined {joinDate}</span>
                </div>
                {user?.user_metadata?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 opacity-70" />
                    <span>{user.user_metadata.location}</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-row items-center gap-3 w-full md:w-auto pt-4 md:pt-0"
            >
              <Button 
                variant="outline" 
                onClick={async () => {
                  if (user) {
                    await supabase.from('profiles').update({ has_onboarded: false }).eq('id', user.id);
                    window.location.href = '/dashboard';
                  }
                }}
                className="rounded-2xl h-11 px-4 border-border/50 hover:bg-accent hover:text-accent-foreground transition-all shadow-sm flex-shrink-0 gap-2"
              >
                <div className="rotate-180"><Sparkles className="w-4 h-4" /></div>
                Replay Tour
              </Button>
              <Button variant="outline" size="icon" className="rounded-2xl h-11 w-11 border-border/50 hover:bg-accent hover:text-accent-foreground transition-all shadow-sm flex-shrink-0">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button className="rounded-2xl h-11 px-6 w-full md:w-auto font-semibold gap-2 shadow-md hover:shadow-lg transition-all">
                <Settings className="w-4 h-4" />
                Edit Profile
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress & Main Stats */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Productivity Hub
              </h2>
              <p className="text-sm text-muted-foreground">Your performance metrics and growth over time.</p>
            </div>
            
            {/* Elegant Segmented Control */}
            <div className="flex items-center p-1 bg-muted/50 border border-border/50 rounded-xl w-fit">
              {['Weekly', 'Monthly', 'Yearly'].map((period, i) => (
                <button 
                  key={period}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                    i === 0 
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <ProgressReport />
          </div>
        </section>

        {/* Right Column: Bento Insights Cards */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Insights</h2>
            <p className="text-sm text-muted-foreground">AI-driven highlights.</p>
          </div>

          <div className="grid gap-6">
            {/* AI Insight Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/40 transition-colors duration-300">
              <div className="relative z-10 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Peak Hours</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You're most productive between <strong className="text-foreground">10 AM and 12 PM</strong>. Try scheduling your "Deep Work" sessions during this window for maximum efficiency.
                  </p>
                </div>
              </div>
              {/* Decorative Blur */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full group-hover:bg-indigo-500/30 transition-colors duration-500" />
            </div>

            {/* Achievement Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-colors duration-300">
              <div className="relative z-10 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Next Milestone</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Complete <strong className="text-foreground">5 more tasks</strong> to unlock the "Weekend Warrior" badge. You're almost there!
                  </p>
                </div>
                {/* Mini Progress Bar */}
                <div className="w-full h-2 bg-emerald-500/20 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-emerald-500 rounded-full w-[75%] transition-all duration-1000 ease-out" />
                </div>
              </div>
              {/* Decorative Blur */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full group-hover:bg-emerald-500/30 transition-colors duration-500" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}