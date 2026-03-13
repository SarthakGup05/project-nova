'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {    
  LogOut, 
  Calendar,
  User as UserIcon,
  PlusCircle,
  Activity,
  Search,
  Inbox,
  CalendarDays,
  LayoutGrid,
  CheckCircle2,
  ListTodo,
  CheckCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useTaskStore } from '@/store/useTaskStore';
import { BrainDump } from '@/components/dashboard/BrainDump';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { TaskList } from '@/components/dashboard/TaskList';
import { motion } from 'framer-motion';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  },
} as const;

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks
    .filter((task) => task.isCompleted)
    .sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

 const links = [
    {
      label: "Add task",
      href: "#",
      icon: <PlusCircle className="w-5 h-5 shrink-0 text-[#d1453b]" />,
      className: "text-[#d1453b] font-medium hover:bg-transparent hover:text-[#d1453b]",
      rightElement: <Activity className="w-4 h-4 text-[#e77a41]" />
    },
    {
      label: "Search",
      href: "#",
      icon: <Search className="w-5 h-5 shrink-0 text-neutral-500" />,
    },
    {
      label: "Inbox",
      href: "#",
      icon: <Inbox className="w-5 h-5 shrink-0 text-neutral-500" />,
    },
    {
      label: "Today",
      href: "#",
      icon: <Calendar className="w-5 h-5 shrink-0" />,
      active: true, // Triggers the orange bg and red text/icon
      rightElement: "2",
    },
    {
      label: "Upcoming",
      href: "#",
      icon: <CalendarDays className="w-5 h-5 shrink-0 text-neutral-500" />,
    },
    {
      label: "Filters & Labels",
      href: "#",
      icon: <LayoutGrid className="w-5 h-5 shrink-0 text-neutral-500" />,
    },
    {
      label: "Completed",
      href: "#",
      icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-neutral-500" />,
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen" 
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: user?.user_metadata?.full_name || user?.email || "User",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                  </div>
                ),
              }}
            />
            {/* Custom styled logout button to match Aceternity SidebarLink */}
            <button 
              onClick={handleSignOut}
              className="group/sidebar flex items-center justify-start gap-2 py-2 w-full rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 group-hover/sidebar:text-red-500" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:text-red-500 transition-colors whitespace-pre !p-0 !m-0"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Dashboard Wrapper formatted exactly like the snippet */}
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto relative">
          
          <div className="max-w-6xl mx-auto w-full space-y-10">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Header Section */}
              <motion.header variants={itemVariants} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{currentDate}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Welcome back, {user?.user_metadata?.full_name || "Sid"} ✨
                </h1>
                <p className="text-muted-foreground text-lg">
                  Let's capture your ideas and clear your focus list today.
                </p>
              </motion.header>

              {/* Top Row: Quick Stats & AI Input */}
              <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 h-full">
                  <div className="h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50 p-1">
                    <StreakCounter />
                  </div>
                </div>
                <div className="lg:col-span-2 h-full">
                  <div className="h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50 p-1">
                    {user?.id && <BrainDump userId={user.id} />}
                  </div>
                </div>
              </motion.div>

              {/* Main Content: Task Lists */}
              <motion.div variants={itemVariants} className="grid gap-8 lg:grid-cols-2">
                
                {/* Today's Focus */}
                <section className="space-y-5">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2 tracking-tight">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <ListTodo className="w-5 h-5" />
                      </div>
                      Focus List
                    </h2>
                    <span className="text-sm font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                      {openTasks.length} pending
                    </span>
                  </div>
                  
                  <Card className="border-neutral-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50 shadow-sm min-h-[450px] overflow-hidden rounded-2xl">
                    <CardContent className="p-6">
                      {error && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="text-sm text-red-500 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                          {error}
                        </motion.p>
                      )}
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full"
                          />
                          <p className="text-sm text-neutral-500 animate-pulse font-medium">Synchronizing tasks...</p>
                        </div>
                      ) : (
                        <TaskList 
                          tasks={openTasks} 
                          emptyMessage="Your focus list is clear. Great job!" 
                        />
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Done Log */}
                <section className="space-y-5">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2 tracking-tight">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      Done Log
                    </h2>
                    <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {completedTasks.length} completed
                    </span>
                  </div>

                  <Card className="border-neutral-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50 shadow-sm min-h-[450px] overflow-hidden rounded-2xl">
                    <CardContent className="p-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
                      <TaskList 
                        tasks={completedTasks} 
                        emptyMessage="Completed tasks will appear here as you check them off." 
                      />
                    </CardContent>
                  </Card>
                </section>

              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Exactly matching the requested Logo components
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Nova Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};