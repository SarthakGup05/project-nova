import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Award, Sparkles, Shield, Zap, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'none';

interface BadgeItemProps {
  name: string;
  description: string;
  isUnlocked?: boolean;
  tier?: BadgeTier;
  icon?: React.ReactNode;
}

const TIER_CONFIG = {
  bronze: {
    color: 'emerald', // Using emerald as the primary accent replacement for bronze in this theme
    gradient: 'from-[#CD7F32]/20 to-[#A0522D]/10',
    iconColor: 'text-[#CD7F32]',
    borderColor: 'border-[#CD7F32]/30',
    glow: 'shadow-[#CD7F32]/10',
    Icon: Shield
  },
  silver: {
    color: 'neutral',
    gradient: 'from-neutral-300/20 to-neutral-500/10',
    iconColor: 'text-neutral-400',
    borderColor: 'border-neutral-400/30',
    glow: 'shadow-neutral-400/10',
    Icon: Zap
  },
  gold: {
    color: 'yellow',
    gradient: 'from-amber-300/20 to-amber-500/10',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    glow: 'shadow-amber-500/20',
    Icon: Award
  },
  platinum: {
    color: 'blue',
    gradient: 'from-cyan-300/20 to-blue-500/10',
    iconColor: 'text-cyan-500',
    borderColor: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/30',
    Icon: Crown
  },
  diamond: {
    color: 'indigo',
    gradient: 'from-indigo-400/30 via-purple-400/20 to-pink-400/30',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-400/40',
    glow: 'shadow-indigo-500/40',
    Icon: Star
  },
  none: {
    color: 'neutral',
    gradient: 'from-neutral-100 to-neutral-200',
    iconColor: 'text-neutral-400',
    borderColor: 'border-neutral-200',
    glow: 'shadow-none',
    Icon: Award
  }
};

export function BadgeItem({ 
  name, 
  description, 
  isUnlocked = true, 
  tier = 'bronze',
  icon 
}: BadgeItemProps) {
  const config = TIER_CONFIG[tier];
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isUnlocked) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isUnlocked ? rotateX : 0,
        rotateY: isUnlocked ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
      className={cn(
        "group relative flex items-center gap-5 p-5 rounded-[2rem] transition-all duration-300 cursor-default",
        isUnlocked 
          ? "bg-white dark:bg-[#0c101b] border border-neutral-200 dark:border-white/5 shadow-xl" 
          : "bg-neutral-50 dark:bg-neutral-950/40 border border-dashed border-neutral-300 dark:border-neutral-800 opacity-60 grayscale"
      )}
    >
      {/* Background Glow for Higher Tiers */}
      {isUnlocked && (tier === 'platinum' || tier === 'diamond') && (
        <div className={cn(
          "absolute -inset-1 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-[2rem] -z-10",
          tier === 'platinum' ? "bg-cyan-500" : "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
        )} />
      )}

      {/* Badge Icon Container */}
      <div 
        style={{ transform: "translateZ(30px)" }}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden",
          isUnlocked 
            ? `bg-gradient-to-br ${config.gradient} border ${config.borderColor}` 
            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
        )}
      >
        {/* Animated Sweep Effect */}
        {isUnlocked && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent skew-x-[-20deg] z-10"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 1 }}
          />
        )}

        {/* Floating Animation for Unlocked Icons */}
        <motion.div
          animate={isUnlocked ? {
            y: [0, -4, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn("z-20", isUnlocked ? config.iconColor : "")}
        >
          {icon || <config.Icon className="w-8 h-8" />}
        </motion.div>

        {/* Particle Sparkles for Diamond/Platinum Tiers */}
        {isUnlocked && (tier === 'diamond' || tier === 'platinum') && (
          <div className="absolute inset-0 pointer-events-none">
             {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-0"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    x: [Math.random() * 60, Math.random() * 60],
                    y: [Math.random() * 60, Math.random() * 60],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
             ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0" style={{ transform: "translateZ(20px)" }}>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-black text-lg text-neutral-900 dark:text-white tracking-tight uppercase">
            {name}
          </h3>
          {isUnlocked && (
             <span className={cn(
               "text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-tighter",
               tier === 'bronze' && "bg-orange-500/10 text-orange-600 dark:text-orange-400",
               tier === 'silver' && "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400",
               tier === 'gold' && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
               tier === 'platinum' && "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
               tier === 'diamond' && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
             )}>
               {tier}
             </span>
          )}
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
          {description}
        </p>
      </div>

      {!isUnlocked && (
        <div 
          style={{ transform: "translateZ(10px)" }}
          className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] bg-neutral-200 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700"
        >
          Locked
        </div>
      )}
    </motion.div>
  );
}
