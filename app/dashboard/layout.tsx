'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LogOut, 
  User as UserIcon, 
  Sparkles,
  Calendar,
  PlusCircle,
  Activity,
  CalendarDays,
  LayoutGrid,
  CheckCircle2,
  Hash,
  Trophy
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Sidebar, SidebarBody, SidebarLink, SidebarGroup } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useTaskStore } from '@/store/useTaskStore';
import { AddTaskDialog } from '@/components/dashboard/AddTaskDialog';
import { AddProjectDialog } from '@/components/dashboard/AddProjectDialog';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const syncAll = useTaskStore((state) => state.syncAll);
  const tasks = useTaskStore((state) => state.tasks);
  const projectsFromStore = useTaskStore((state) => state.projects);
  const fetchProjects = useTaskStore((state) => state.fetchProjects);
  
  const activeTasksCount = tasks.filter(t => !t.isCompleted).length;

  const projectLinks = useMemo(() => {
    return projectsFromStore.map(project => ({
      label: project.name,
      href: `/dashboard/project/${encodeURIComponent(project.name)}`,
      icon: <Hash className="w-4 h-4 shrink-0" />,
      active: pathname === `/dashboard/project/${encodeURIComponent(project.name)}`,
    }));
  }, [projectsFromStore, pathname]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    syncAll();
  }, [fetchTasks, fetchProjects, syncAll]);

  useEffect(() => {
    const handleOnline = () => {
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
      label: "Add task",
      href: "#",
      icon: (
        <div className="bg-white rounded-full p-0.5">
           <PlusCircle className="w-4 h-4 text-black fill-white" />
        </div>
      ),
      className: "text-[#d1453b] font-medium hover:bg-transparent hover:text-[#d1453b]",
      rightElement: <Activity className="w-4 h-4 text-[#e77a41]" />,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsTaskDialogOpen(true);
      }
    },
    {
      label: "Today",
      href: "/dashboard",
      icon: <Calendar className="w-5 h-5 shrink-0" />,
      active: pathname === "/dashboard",
      rightElement: activeTasksCount > 0 ? activeTasksCount.toString() : undefined,
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: <CalendarDays className="w-5 h-5 shrink-0" />,
      active: pathname === "/dashboard/calendar",
    },
    {
      label: "Filters & Labels",
      href: "/dashboard/filters",
      icon: <LayoutGrid className="w-5 h-5 shrink-0" />,
      active: pathname === "/dashboard/filters",
    },
    {
      label: "Completed",
      href: "/dashboard/completed",
      icon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
      active: pathname === "/dashboard/completed",
    },
    {
      label: "Achievements",
      href: "/dashboard/achievements",
      icon: <Trophy className="w-5 h-5 shrink-0" />,
      active: pathname === "/dashboard/achievements",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-accent/30">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-border/40 bg-background/50 backdrop-blur-xl">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo open={open} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} onClick={link.onClick} />
              ))}
            </div>

            {projectLinks.length > 0 && (
              <SidebarGroup 
                label="Projects" 
                action={
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsProjectDialogOpen(true);
                    }}
                    className="p-1 hover:bg-accent/10 rounded transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-muted-foreground" />
                  </button>
                }
              >
                <div className="flex flex-col gap-1">
                  {projectLinks.map((project, idx) => (
                    <SidebarLink key={idx} link={project} />
                  ))}
                </div>
              </SidebarGroup>
            )}
          </div>
          
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

      <main className="flex-1 overflow-y-auto bg-background relative flex flex-col items-center">
        <DashboardHeader user={user} />
        {children}
      </main>

      {/* Global Add Task Dialog */}
      <AddTaskDialog
        userId={user?.id || ""}
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
      >
        <span className="hidden"></span>
      </AddTaskDialog>

      <AddProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
      />
    </div>
  );
}

const Logo = ({ open }: { open: boolean }) => (
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
