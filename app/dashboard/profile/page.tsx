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
  MapPin, 
  Calendar,
  Mail,
  ShieldCheck,
  Trophy
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 space-y-12 pb-24">
      {/* Profile Header */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
            >
                <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center border-4 border-background shadow-2xl overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <UserIcon className="w-12 h-12 text-accent/50" />
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-xl border-4 border-background shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-white" />
                </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left space-y-2">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center gap-3"
                >
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member'}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-wider">
                            Pro Member
                        </span>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium"
                >
                    <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {joinDate}</span>
                    </div>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-border/40 hover:bg-accent/5 transition-all">
                    <Share2 className="w-4 h-4" />
                </Button>
                <Button className="rounded-2xl h-12 px-6 bg-foreground text-background font-bold gap-2 hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                </Button>
            </motion.div>
        </div>
      </section>

      {/* Stats Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      {/* Progress Report Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    Productivity Hub
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h2>
                <p className="text-sm text-muted-foreground font-medium">Visualization of your personal journey and growth.</p>
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 border border-border/40 rounded-2xl w-fit">
                <button className="px-4 py-1.5 rounded-xl text-xs font-bold bg-background shadow-sm border border-border/20">Weekly</button>
                <button className="px-4 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Monthly</button>
                <button className="px-4 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Yearly</button>
            </div>
        </div>

        <ProgressReport />
      </section>

      {/* Insights/Achievements Placeholder */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">AI Productivity Insights</h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                    You're most productive between 10 AM and 12 PM. Try scheduling your "Deep Work" sessions during this window for maximum efficiency.
                </p>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <div className="p-8 rounded-[40px] bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">Next Milestone</h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                    Complete 5 more tasks to unlock the "Weekend Warrior" badge. You're almost there!
                </p>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </section>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
    );
}
