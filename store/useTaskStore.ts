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
  createdAt: string; // ISO string
  completedAt: string | null; // ISO string
  syncStatus?: 'synced' | 'pending' | 'error';
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'syncStatus'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  syncAll: () => Promise<void>;
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

        // Process each pending task
        // In a real app, you'd batch these or handle concurrency
        for (const task of pendingTasks) {
          try {
            // Check if it's a new task or an update
            // (Actually, our API currently handles POST for new and we don't have separate PUT/PATCH logic here)
            // Let's assume the API handles it or we use the POST/PATCH logic from before
            
            // This is a simplified sync loop
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
            } else {
              set((state) => ({
                tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, syncStatus: 'error' } : t)),
              }));
            }
          } catch (error) {
            console.error("Sync failed for task:", task.id, error);
            set((state) => ({
              tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, syncStatus: 'error' } : t)),
            }));
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
