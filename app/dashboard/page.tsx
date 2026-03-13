'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  User as UserIcon, 
  Sparkles,
  Calendar,
  PlusCircle,
  Activity,
  Search,
  Inbox,
  CalendarDays,
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { motion, Variants } from 'framer-motion';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { TodayView } from '@/components/dashboard/Todayview'; // Make sure the path matches your actual file name
import { useTaskStore } from '@/store/useTaskStore';

// --- Framer Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  },
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const syncAll = useTaskStore((state) => state.syncAll);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  useEffect(() => {
    fetchTasks();
    // Initial sync on mount to handle any stale pending tasks
    syncAll();
  }, [fetchTasks, syncAll]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Device is online, triggering sync...");
      syncAll();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncAll]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  const links = [
    {
      label: "New Task",
      href: "#",
      // Custom styling for the primary action button
      icon: (
        <div className="bg-white rounded-full p-0.5">
           <PlusCircle className="w-4 h-4 text-black fill-white" />
        </div>
      ),
      className: "text-white font-semibold hover:bg-white/10",
      rightElement: <Activity className="w-4 h-4 text-white" />
    },
    {
      label: "Search",
      href: "#",
      icon: <Search className="w-5 h-5 shrink-0" />,
    },
    {
      label: "Inbox",
      href: "#",
      icon: <Inbox className="w-5 h-5 shrink-0" />,
    },
    {
      label: "Today",
      href: "/dashboard",
      icon: <Calendar className="w-5 h-5 shrink-0" />,
      active: true, // Triggers the active state styling
      rightElement: "2",
    },
    {
      label: "Upcoming",
      href: "#",
      icon: <CalendarDays className="w-5 h-5 shrink-0" />,
    },
    {
      label: "Filters & Labels",
      href: "#",
      icon: <LayoutGrid className="w-5 h-5 shrink-0" />,
    },
    {
      label: "Completed",
      href: "#",
      icon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-accent/30">
      
      {/* Sidebar Section */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-border/40 bg-background/50 backdrop-blur-xl">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo open={open} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          
          {/* User & Logout Section */}
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: user?.user_metadata?.full_name || user?.email || "User",
                href: "#",
                icon: (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border border-accent/20 shadow-sm">
                    <UserIcon className="w-4 h-4 text-accent" />
                  </div>
                ),
              }}
            />
            <button 
              onClick={handleSignOut}
              className="group/sidebar flex items-center justify-start gap-3 py-2 px-2 w-full hover:bg-destructive/10 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5 shrink-0 text-muted-foreground group-hover/sidebar:text-destructive transition-colors" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-muted-foreground text-sm font-medium group-hover/sidebar:text-destructive transition-colors whitespace-pre"
              >
                Sign Out
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area - Completely minimalist now */}
      <main className="flex-1 overflow-y-auto bg-background relative flex justify-center">
        {/* Very subtle background gradient to keep it from feeling perfectly flat */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-4xl relative z-10 pt-4"
        >
          {/* The TodayView component now handles its own header, date, and task list */}
          {user?.id && <TodayView userId={user.id} />}
        </motion.div>
      </main>
    </div>
  );
}

// Logo Component
const Logo = ({ open }: { open: boolean }) => {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20 border border-white/10">
        <Sparkles className="w-4 h-4 text-accent-foreground" />
      </div>
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ 
          opacity: open ? 1 : 0,
          width: open ? "auto" : 0 
        }}
        className="font-bold text-xl tracking-tight whitespace-pre bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 overflow-hidden"
      >
        Nova
      </motion.span>
    </div>
  );
};