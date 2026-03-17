'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Folder, 
  Hash, 
  Plus, 
  X, 
  FolderInput,
  FolderPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FolderCard } from '@/components/dashboard/filters/FolderCard';

export function FiltersAndLabels() {
  const tasks = useTaskStore((state) => state.tasks);
  const folders = useTaskStore((state) => state.folders);
  const addFolder = useTaskStore((state) => state.addFolder);
  const deleteFolder = useTaskStore((state) => state.deleteFolder);
  const updateFolder = useTaskStore((state) => state.updateFolder);
  const addItemToFolder = useTaskStore((state) => state.addItemToFolder);
  const removeItemFromFolder = useTaskStore((state) => state.removeItemFromFolder);

  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState<'tag' | 'project' | null>(null);

  // Extract unique tags and their counts
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      task.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  // Extract unique projects and their counts
  const projectCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      const project = task.project || 'Inbox';
      counts[project] = (counts[project] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  const handleCreateFolder = async (type: 'tag' | 'project') => {
    if (!newFolderName.trim()) return;
    await addFolder(newFolderName.trim(), type);
    setNewFolderName('');
    setShowFolderInput(null);
  };

  const handleMoveToFolder = async (folderId: string, itemId: string) => {
    const itemFolders = folders.filter(f => f.itemIds.includes(itemId));
    for (const f of itemFolders) {
      await removeItemFromFolder(f.id, itemId);
    }
    await addItemToFolder(folderId, itemId);
  };

  // --- Animation Variants ---
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  } as const;

  // --- Renderers ---
  const renderProjectItem = ([project, count]: [string, number]) => {
    const currentFolder = folders.find(f => f.itemIds.includes(project));
    
    return (
      <motion.div
        key={project}
        variants={itemVariants}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] transition-all duration-300 min-w-[200px]"
      >
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-5 flex items-start justify-between z-10">
          <div className="space-y-1.5">
            <p className="text-sm font-extrabold text-foreground group-hover:text-blue-500 transition-colors uppercase tracking-wider truncate max-w-[140px]">
              {project}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                {count} {count === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
          
          {/* Action Button & Select Overlay */}
          <div className="relative w-8 h-8 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 flex items-center justify-center text-blue-500 transition-colors">
            <FolderInput className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            <select 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Move to folder"
              onChange={async (e) => {
                const val = e.target.value;
                if (val === 'none') {
                  if (currentFolder) await removeItemFromFolder(currentFolder.id, project);
                } else {
                  await handleMoveToFolder(val, project);
                }
              }}
              value={currentFolder?.id || 'none'}
            >
              <option value="none" className="font-bold">Uncategorized</option>
              <optgroup label="Move to Folder...">
                {folders.filter(f => f.type === 'project').map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTagItem = ([tag, count]: [string, number]) => {
    const currentFolder = folders.find(f => f.itemIds.includes(tag));

    return (
      <motion.div
        key={tag}
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm hover:border-accent/40 hover:bg-accent/5 hover:shadow-lg hover:shadow-accent/10 transition-all cursor-pointer overflow-hidden"
      >
        <Hash className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
        <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">{tag}</span>
        <span className="text-[11px] bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-accent/20 group-hover:text-accent px-2 py-0.5 rounded-full font-bold min-w-[1.5rem] text-center transition-colors">
          {count}
        </span>
        
        {/* Invisible Select Overlay over the entire pill */}
        <select 
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Move tag to folder"
          onChange={async (e) => {
            const val = e.target.value;
            if (val === 'none') {
              if (currentFolder) await removeItemFromFolder(currentFolder.id, tag);
            } else {
              await handleMoveToFolder(val, tag);
            }
          }}
          value={currentFolder?.id || 'none'}
        >
          <option value="none">Uncategorized</option>
          <optgroup label="Folders">
            {folders.filter(f => f.type === 'tag').map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </optgroup>
        </select>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-20 pb-20 relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* --- Projects Section --- */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center shadow-inner">
              <Folder className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                PROJECTS
              </h2>
              <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Structure your workspace</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowFolderInput(showFolderInput === 'project' ? null : 'project')}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 shadow-sm",
              showFolderInput === 'project' 
                ? "bg-neutral-200 dark:bg-neutral-800 text-foreground"
                : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25"
            )}
          >
            {showFolderInput === 'project' ? <X className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            {showFolderInput === 'project' ? 'Cancel' : 'New Folder'}
          </button>
        </div>

        {/* Create Folder Input Dropdown */}
        <AnimatePresence>
          {showFolderInput === 'project' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 p-2 bg-card/50 rounded-2xl border border-blue-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <div className="pl-4">
                  <Folder className="w-4 h-4 text-blue-500/50" />
                </div>
                <input 
                  autoFocus
                  className="bg-transparent border-none focus:ring-0 text-sm font-bold flex-1 placeholder:text-muted-foreground/40 outline-none text-foreground uppercase"
                  placeholder="ENTER FOLDER NAME..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder('project')}
                />
                <button 
                  onClick={() => handleCreateFolder('project')}
                  disabled={!newFolderName.trim()}
                  className="px-6 py-2 bg-blue-500 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-xl font-extrabold text-xs tracking-wider transition-colors"
                >
                  CREATE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-12">
          {/* Render Active Folders */}
          <div className="space-y-6">
            {folders.filter(f => f.type === 'project').map(folder => (
              <FolderCard 
                key={folder.id} 
                folder={folder}
                onDelete={() => deleteFolder(folder.id)}
                onRename={(name) => updateFolder(folder.id, { name })}
              >
                {projectCounts
                  .filter(([name]) => folder.itemIds.includes(name))
                  .map(renderProjectItem)}
              </FolderCard>
            ))}
          </div>

          {/* Uncategorized Projects */}
          <div className="space-y-6 bg-neutral-50/50 dark:bg-neutral-900/20 p-6 rounded-3xl border border-border/40">
            <div className="flex items-center gap-4 opacity-60">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Uncategorized Projects</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent" />
            </div>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {projectCounts
                .filter(([name]) => !folders.some(f => f.type === 'project' && f.itemIds.includes(name)))
                .map(renderProjectItem)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Labels Section --- */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center shadow-inner">
              <Tag className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                LABELS
              </h2>
              <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Categorize your focus</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowFolderInput(showFolderInput === 'tag' ? null : 'tag')}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 shadow-sm",
              showFolderInput === 'tag' 
                ? "bg-neutral-200 dark:bg-neutral-800 text-foreground"
                : "bg-accent text-accent-foreground hover:opacity-90 hover:shadow-lg hover:shadow-accent/25"
            )}
          >
            {showFolderInput === 'tag' ? <X className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            {showFolderInput === 'tag' ? 'Cancel' : 'New Folder'}
          </button>
        </div>

        {/* Create Tag Folder Input Dropdown */}
        <AnimatePresence>
          {showFolderInput === 'tag' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 p-2 bg-card/50 rounded-2xl border border-accent/30 backdrop-blur-md shadow-[0_0_15px_rgba(var(--accent),0.1)]">
                <div className="pl-4">
                  <Folder className="w-4 h-4 text-accent/50" />
                </div>
                <input 
                  autoFocus
                  className="bg-transparent border-none focus:ring-0 text-sm font-bold flex-1 placeholder:text-muted-foreground/40 outline-none text-foreground uppercase"
                  placeholder="ENTER FOLDER NAME..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder('tag')}
                />
                <button 
                  onClick={() => handleCreateFolder('tag')}
                  disabled={!newFolderName.trim()}
                  className="px-6 py-2 bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground rounded-xl font-extrabold text-xs tracking-wider transition-colors"
                >
                  CREATE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-12">
          {/* Render Active Folders */}
          <div className="space-y-6">
            {folders.filter(f => f.type === 'tag').map(folder => (
              <FolderCard 
                key={folder.id} 
                folder={folder}
                onDelete={() => deleteFolder(folder.id)}
                onRename={(name) => updateFolder(folder.id, { name })}
              >
                {tagCounts
                  .filter(([name]) => folder.itemIds.includes(name))
                  .map(renderTagItem)}
              </FolderCard>
            ))}
          </div>

          {/* Uncategorized Tags */}
          <div className="space-y-6 bg-neutral-50/50 dark:bg-neutral-900/20 p-6 rounded-3xl border border-border/40">
            <div className="flex items-center gap-4 opacity-60">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Uncategorized Tags</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent" />
            </div>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-3"
            >
              {tagCounts
                .filter(([name]) => !folders.some(f => f.type === 'tag' && f.itemIds.includes(name)))
                .map(renderTagItem)}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}