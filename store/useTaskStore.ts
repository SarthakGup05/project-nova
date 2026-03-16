import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the local Task interface based on db/schema.ts
export interface Task {
  id: string; // uuid
  userId: string; // uuid
  title: string;
  isCompleted: boolean | null;
  isAiGenerated: boolean | null;
  estimatedMinutes: number | null;
  project: string | null;
  tags: string[] | null;
  dueDate: string | null; // ISO string 
  contextDraft: string | null;
  startTime?: string | null; // ISO string for time blocking
  createdAt: string; // ISO string
  completedAt: string | null; // ISO string
  syncStatus?: 'synced' | 'pending' | 'error';
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  isFavorite: boolean | null;
  createdAt: string;
  syncStatus?: 'synced' | 'pending' | 'error';
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  projects: Project[];
  isProjectsLoading: boolean;

  // Actions
  fetchTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'syncStatus'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  syncAll: () => Promise<void>;

  // Project Actions
  fetchProjects: () => Promise<void>;
  addProject: (name: string, color?: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  syncProjects: () => Promise<void>;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/tasks');
          if (!response.ok) throw new Error('Failed to fetch tasks');
          const tasks = await response.json();
          // Merge with local pending tasks if any (complex logic, for now just set)
          const localPending = get().tasks.filter(t => t.syncStatus === 'pending');
          const syncedIds = new Set(tasks.map((t: Task) => t.id));
          
          set({ 
            tasks: [
              ...tasks.map((t: Task) => ({ ...t, syncStatus: 'synced' })),
              ...localPending.filter(t => !syncedIds.has(t.id))
            ], 
            isLoading: false 
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      setTasks: (tasks) => set({ tasks }),

      addTask: async (taskDetails) => {
        const tempId = crypto.randomUUID();
        const newTask: Task = {
          ...taskDetails,
          id: tempId,
          createdAt: new Date().toISOString(),
          isCompleted: taskDetails.isCompleted ?? false,
          isAiGenerated: taskDetails.isAiGenerated ?? false,
          estimatedMinutes: taskDetails.estimatedMinutes ?? 15,
          project: taskDetails.project ?? 'Inbox',
          tags: taskDetails.tags ?? [],
          startTime: taskDetails.startTime ?? null,
          syncStatus: 'pending',
        } as Task;

        // Step 1: Immediate local update (Zero Latency)
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        // Step 2: Background sync
        get().syncAll();
      },

      updateTask: async (id, updates) => {
        // Step 1: Immediate local update
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, syncStatus: 'pending' } : task
          ),
        }));

        // Step 2: Background sync
        get().syncAll();
      },

      deleteTask: async (id) => {
        const taskToDelete = get().tasks.find(t => t.id === id);
        if (!taskToDelete) return;

        // Step 1: Immediate local removal
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));

        // Step 2: Background sync delete
        if (taskToDelete.syncStatus !== 'pending') {
          try {
            const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete task');
          } catch (err: any) {
            console.error("Background delete failed:", err);
            // In a more complex app, we'd add to a 'deletedIds' set in localStorage
          }
        }
      },

      toggleTaskCompletion: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const newCompletionState = !task.isCompleted;
        const updates = {
          isCompleted: newCompletionState,
          completedAt: newCompletionState ? new Date().toISOString() : null,
        };

        // Step 1: Immediate local update
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, syncStatus: 'pending' } : t)),
        }));

        // Step 2: Background sync
        get().syncAll();
      },

      syncAll: async () => {
        const pendingTasks = get().tasks.filter(t => t.syncStatus === 'pending');
        if (pendingTasks.length === 0) return;

        for (const task of pendingTasks) {
          try {
            const response = await fetch('/api/tasks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(task),
            });

            if (response.ok) {
              const savedTask = await response.json();
              set((state) => ({
                tasks: state.tasks.map((t) => (t.id === task.id ? { ...savedTask, syncStatus: 'synced' } : t)),
              }));
            }
          } catch (error) {
            console.error("Sync failed for task:", task.id, error);
          }
        }
      },

      projects: [],
      isProjectsLoading: false,

      fetchProjects: async () => {
        set({ isProjectsLoading: true });
        try {
          const response = await fetch('/api/projects');
          if (!response.ok) throw new Error('Failed to fetch projects');
          const projects = await response.json();
          set({ 
            projects: projects.map((p: Project) => ({ ...p, syncStatus: 'synced' })), 
            isProjectsLoading: false 
          });
        } catch (err: any) {
          set({ isProjectsLoading: false });
          console.error("Fetch projects failed:", err);
        }
      },

      addProject: async (name, color) => {
        const tempId = crypto.randomUUID();
        const newProject: Project = {
          id: tempId,
          userId: '', // Will be set by API
          name,
          color: color || null,
          isFavorite: false,
          createdAt: new Date().toISOString(),
          syncStatus: 'pending',
        };

        set((state) => ({ projects: [...state.projects, newProject] }));
        get().syncProjects();
      },

      updateProject: async (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, syncStatus: 'pending' } : p
          ),
        }));
        get().syncProjects();
      },

      deleteProject: async (id) => {
        const projectToDelete = get().projects.find(p => p.id === id);
        if (!projectToDelete) return;

        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));

        if (projectToDelete.syncStatus !== 'pending') {
          try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
          } catch (err) {
            console.error("Background delete failed for project:", err);
          }
        }
      },

      syncProjects: async () => {
        const pendingProjects = get().projects.filter(p => p.syncStatus === 'pending');
        if (pendingProjects.length === 0) return;

        for (const project of pendingProjects) {
          try {
            const response = await fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(project),
            });

            if (response.ok) {
              const savedProject = await response.json();
              set((state) => ({
                projects: state.projects.map((p) => (p.id === project.id ? { ...savedProject, syncStatus: 'synced' } : p)),
              }));
            }
          } catch (error) {
            console.error("Sync failed for project:", project.id, error);
          }
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'nova-tasks-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
