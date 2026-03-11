"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, CalendarDays, Flame, Sparkles, Zap, Activity, WifiOff, Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Zero-Latency Architecture",
    description: "Eliminate loading spinners completely. Nova runs locally on your device with offline capabilities, synchronizing seamlessly in the background.",
    icon: <Zap className="h-5 w-5 text-primary" />,
    className: "md:col-span-2 bg-gradient-to-br from-card to-secondary/30 border-border/60 shadow-sm",
    // Micro-Visual: Offline-first sync animation
    visual: (
      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden rounded-r-2xl pointer-events-none flex items-center justify-end pr-8 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <div className="w-12 h-2 rounded-full bg-primary/20" />
            <div className="w-8 h-2 rounded-full bg-primary/20" />
          </div>
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-primary/30 bg-background shadow-sm">
            <WifiOff className="w-5 h-5 text-primary absolute transition-all duration-300 group-hover:scale-0 group-hover:opacity-0" />
            <Activity className="w-5 h-5 text-primary absolute scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
            {/* Pulsing ring on hover */}
            <div className="absolute inset-0 rounded-full border border-primary scale-100 opacity-0 group-hover:animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] group-hover:opacity-50" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "AI Brain Dump",
    description: "Stop categorizing. Dump your thoughts, and the AI builds your schedule.",
    icon: <BrainCircuit className="h-5 w-5 text-accent" />,
    className: "md:col-span-1 bg-card border-border/60 shadow-sm",
    // Micro-Visual: AI Processing Pill
    visual: (
      <div className="absolute -bottom-4 -right-4 md:-bottom-2 md:-right-6 pointer-events-none opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <div className="w-16 h-1.5 rounded-full bg-accent/30 overflow-hidden">
            <div className="h-full bg-accent w-full animate-[shimmer_1.5s_infinite] -translate-x-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Calendar Time-Blocking",
    description: "Drag tasks directly onto your timeline. Protect deep work blocks automatically.",
    icon: <CalendarDays className="h-5 w-5 text-primary" />,
    className: "md:col-span-1 bg-card border-border/60 shadow-sm",
    // Micro-Visual: Mini Time Blocks
    visual: (
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
    ),
  },
  {
    title: "Forgiving Gamification",
    description: "Build streaks that don't punish you for resting. Witty push notifications keep you engaged without feeling like a nagging boss.",
    icon: <Flame className="h-5 w-5 text-accent" />,
    className: "md:col-span-2 bg-gradient-to-tr from-card to-accent/5 border-border/60 shadow-sm",
    // Micro-Visual: Streak Graph
    visual: (
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-end gap-1.5 opacity-20 group-hover:opacity-50 blur-[2px] transition-all duration-500">
        {[20, 35, 25, 45, 60, 40, 70].map((height, i) => (
          <div key={i} className="relative w-3 rounded-t-sm bg-accent/20" style={{ height: `${height}px` }}>
            {/* The active fill that animates up on hover */}
            <div 
              className="absolute bottom-0 left-0 w-full rounded-t-sm bg-accent transition-all duration-700 ease-out h-0 group-hover:h-full"
              style={{ transitionDelay: `${i * 50}ms` }} 
            />
          </div>
        ))}
        {/* Mock "Completed" badge */}
        <div className="absolute -top-6 -right-2 bg-background border border-border px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 delay-300">
          <Check className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-foreground">7d</span>
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="relative w-full py-16 md:py-24 bg-background z-10 overflow-hidden">
      
      {/* Background Grid to tie it to the Hero */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-5xl">
        
        {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center text-center space-y-4 mb-14"
          >
            <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent shadow-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span className="tracking-wide">Built for Execution</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Everything you need. <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-muted-foreground to-muted-foreground/50 text-gradient font-light">
                None of the friction.
              </span>
            </h2>
          </motion.div>

        {/* Bento Box Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(220px,_auto)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { type: "spring", stiffness: 100, damping: 20 }
                }
              }}
              className={feature.className}
            >
              <Card
                className={`h-full relative overflow-hidden group transition-all duration-500 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 flex flex-col justify-between bg-transparent border-none shadow-none`}
              >
                {/* Background needs to be moved out of Card to handle gradient class properly if Card overrides but bg-transparent handles it */}
                <div className="absolute inset-0 bg-inherit z-0" />
                
                {/* Inject the micro-visual */}
                <div className="relative z-0">
                  {feature.visual}
                </div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <CardHeader className="pb-3 pt-6 px-6">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-background border border-border shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-foreground font-semibold tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}