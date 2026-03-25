'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  LayoutGrid, 
  Search, 
  Rocket,
  CalendarDays,
  Flame,
  PlusCircle,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingTourProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Nova',
    description: 'The next generation of task management, powered by AI and designed for speed.',
    icon: <Sparkles className="w-8 h-8 text-accent" />,
    target: null,
  },
  {
    id: 'add-task',
    title: 'Zero-Latency Task Entry',
    description: 'Create tasks instantly. Our AI automatically extracts dates, projects, and context from your natural language.',
    icon: <PlusCircle className="w-6 h-6 text-orange-500" />,
    target: 'a[href="#"]',
  },
  {
    id: 'projects',
    title: 'Organize with Projects',
    description: 'Group related tasks into dedicated workspaces to maintain sharp focus on your core objectives.',
    icon: <LayoutGrid className="w-6 h-6 text-primary" />,
    target: '#sidebar-projects',
  },
  {
    id: 'calendar',
    title: 'Master Your Schedule',
    description: 'Visualize your entire week with our drag-and-drop calendar view. Precision planning made effortless.',
    icon: <CalendarDays className="w-6 h-6 text-emerald-500" />,
    target: 'a[href="/dashboard/calendar"]',
  },
  {
    id: 'achievements',
    title: 'Gamified Productivity',
    description: 'Build streaks, unlock badges, and watch your progress grow as you consistently crush your goals.',
    icon: <Flame className="w-6 h-6 text-orange-600" />,
    target: 'a[href="/dashboard/achievements"]',
  },
  {
    id: 'search',
    title: 'Lightning Fast Search',
    description: 'Find any task, project, or insight instantly with our global quick-search from anywhere in the app.',
    icon: <Search className="w-6 h-6 text-accent" />,
    target: '#header-search',
  },
  {
    id: 'theme',
    title: 'Aesthetic Control',
    description: 'Switch between our vibrant light mode and premium deep midnight theme to match your vibe.',
    icon: <Moon className="w-6 h-6 text-indigo-400" />,
    target: '#theme-toggle',
  },
  {
    id: 'finish',
    title: 'Ready to Launch?',
    description: 'You\'re all set to experience unprecedented productivity. Let\'s build something great.',
    icon: <Rocket className="w-8 h-8 text-orange-500" />,
    target: null,
  }
];

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const step = steps[currentStep];

  useEffect(() => {
    if (step.target) {
      const timer = setTimeout(() => {
        let element = null;
        if (step.target.startsWith('#') || step.target.startsWith('.') || step.target.includes('[')) {
           element = document.querySelector(step.target);
        } else {
           element = document.getElementById(step.target) || document.querySelector(step.target);
        }
        
        if (element) {
          setTargetRect(element.getBoundingClientRect());
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        } else {
          setTargetRect(null);
        }
      }, 50); // Faster polling for premium feel
      return () => clearTimeout(timer);
    } else {
      setTargetRect(null);
    }
  }, [currentStep, step.target, windowSize]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  // Fluid Positioning Logic
  let dialogX = 0;
  let dialogY = 0;
  let arrowPlacement: 'top' | 'left' | 'none' = 'none';

  if (targetRect && windowSize.width > 0) {
    const isSidebar = targetRect.left < 250; 
    
    if (isSidebar) {
      dialogX = targetRect.right + 32;
      dialogY = targetRect.top - 80;
      arrowPlacement = 'left';
    } else {
      dialogX = targetRect.left - 200 + (targetRect.width / 2);
      dialogY = targetRect.bottom + 32;
      arrowPlacement = 'top';
    }

    // Clamp
    dialogX = Math.max(24, Math.min(dialogX, windowSize.width - 424));
    dialogY = Math.max(24, Math.min(dialogY, windowSize.height - 350));
  } else if (!targetRect && windowSize.width > 0) {
    // Center
    dialogX = windowSize.width / 2 - 200;
    dialogY = windowSize.height / 2 - 180;
  }

  // Animation Variants for premium stagger ease
  const contentVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -15, filter: 'blur(4px)' }
  };

  const springConfig = { type: 'spring' as const, damping: 24, stiffness: 200, mass: 0.8 };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      
      {/* SVG Mask for Fluid Backdrop Spotlight */}
      <svg className="absolute inset-0 pointer-events-none z-0" width="100%" height="100%">
        <defs>
          <mask id="premium-spotlight">
            <rect width="100%" height="100%" fill="white" />
            {targetRect ? (
              <motion.rect
                initial={false}
                animate={{
                  x: targetRect.left - 12,
                  y: targetRect.top - 12,
                  width: targetRect.width + 24,
                  height: targetRect.height + 24,
                }}
                transition={springConfig}
                fill="black"
                rx={16}
              />
            ) : null}
          </mask>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          fill="rgba(0,0,0,0.5)" 
          className="backdrop-blur-[3px]"
          mask="url(#premium-spotlight)" 
          style={{ pointerEvents: 'auto' }}
          onClick={handleSkip}
        />
      </svg>

      {/* Sleek Action Orb (Premium Target Indicator) */}
      <AnimatePresence>
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute z-10 pointer-events-none flex items-center justify-center"
            style={{
              left: arrowPlacement === 'left' ? targetRect.right + 4 : targetRect.left + targetRect.width / 2 - 12,
              top: arrowPlacement === 'top' ? targetRect.bottom + 4 : targetRect.top + targetRect.height / 2 - 12,
              width: 24,
              height: 24,
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-50 animate-ping" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-accent shadow-[0_0_15px_rgba(var(--accent),0.8)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Gliding Dialog Card */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: dialogX,
          y: dialogY,
        }}
        transition={springConfig}
        className="absolute w-[400px] pointer-events-auto bg-background/95 backdrop-blur-3xl border border-border/80 rounded-3xl shadow-2xl p-8 flex flex-col items-start z-50 overflow-hidden"
      >
        {/* Subtle top gradient glow for premium feel */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="flex flex-col w-full h-full"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            <motion.div variants={contentVariants} className="mb-6 h-12 w-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/20 shadow-inner">
              {step.icon}
            </motion.div>
            
            <motion.h2 variants={contentVariants} className="text-2xl font-bold tracking-tight mb-2 text-foreground">
              {step.title}
            </motion.h2>
            
            <motion.p variants={contentVariants} className="text-muted-foreground leading-relaxed mb-8 min-h-[60px]">
              {step.description}
            </motion.p>

            <motion.div variants={contentVariants} className="flex items-center gap-3 w-full mt-auto">
              <button 
                onClick={handleSkip}
                className="px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
              >
                Skip 
              </button>
              
              <div className="flex-1 flex justify-center gap-1.5">
                {steps.map((_, i) => (
                  <motion.div 
                    key={i}
                    layoutId={`dot-${i}`}
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-500",
                      i === currentStep ? "w-5 bg-accent" : "w-1.5 bg-border/80"
                    )}
                  />
                ))}
              </div>
              
              <button 
                onClick={handleNext}
                className="relative overflow-hidden px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
