'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Folder, 
  Hash, 
  X, 
  FolderPlus,
  Layers,
  LayoutGrid,
  Filter,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FolderCard } from '@/components/dashboard/filters/FolderCard';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { MoveToFolderPopOver } from '@/components/dashboard/filters/MoveToFolderPopOver';
import { AddProjectDialog } from '@/components/dashboard/AddProjectDialog';

export function FiltersAndLabels() {
  const [activeTab, setActiveTab] = useState<'projects' | 'labels'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useTaskStore((state) => state.projects);
  const folders = useTaskStore((state) => state.folders);
  
  const addFolder = useTaskStore((state) => state.addFolder);
  const deleteFolder = useTaskStore((state) => state.deleteFolder);
  const updateFolder = useTaskStore((state) => state.updateFolder);
  const addItemToFolder = useTaskStore((state) => state.addItemToFolder);
  const removeItemFromFolder = useTaskStore((state) => state.removeItemFromFolder);
  const updateProject = useTaskStore((state) => state.updateProject);
  const deleteProject = useTaskStore((state) => state.deleteProject);
  const renameTag = useTaskStore((state) => state.renameTag);
  const deleteTag = useTaskStore((state) => state.deleteTag);

  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState<boolean>(false);
  
  // State for Project Editing
  const [editingProject, setEditingProject] = useState<{ id: string; name: string; color: string | null } | null>(null);

  // Extract unique tags and their counts
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      task.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .filter(([tag]) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b[1] - a[1]);
  }, [tasks, searchQuery]);

  // Extract unique project names and their counts from tasks 
  // (Note: we should also show projects from the store even if they have no tasks)
  const projectStats = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      const project = task.project || 'Inbox';
      counts[project] = (counts[project] || 0) + 1;
    });

    // Merge with actual projects from store
    const allProjectNames = new Set([...Object.keys(counts), ...projects.map(p => p.name)]);
    return Array.from(allProjectNames)
      .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(name => ({
        name,
        count: counts[name] || 0,
        projectData: projects.find(p => p.name === name)
      }));
  }, [tasks, projects, searchQuery]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await addFolder(newFolderName.trim(), activeTab === 'projects' ? 'project' : 'tag');
    setNewFolderName('');
    setShowFolderInput(false);
  };

  const handleMoveToFolder = async (itemId: string, folderId: string | 'none') => {
    const itemFolders = folders.filter(f => f.itemIds.includes(itemId));
    for (const f of itemFolders) {
      await removeItemFromFolder(f.id, itemId);
    }
    if (folderId !== 'none') {
      await addItemToFolder(folderId, itemId);
    }
  };

  const handleRenameTag = async (oldTag: string) => {
    const newTag = prompt(`Rename tag "${oldTag}" to:`, oldTag);
    if (newTag && newTag.trim() && newTag !== oldTag) {
      await renameTag(oldTag, newTag.trim());
    }
  };

  const handleDeleteTag = async (tag: string) => {
    if (confirm(`Are you sure you want to delete the tag "${tag}"? It will be removed from all tasks.`)) {
      await deleteTag(tag);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (name === 'Inbox') {
      alert("The Inbox project cannot be deleted.");
      return;
    }
    if (confirm(`Are you sure you want to delete the project "${name}"? This action cannot be undone.`)) {
      await deleteProject(id);
    }
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
  const renderProjectItem = ({ name, count, projectData }: { name: string, count: number, projectData?: any }) => {
    const currentFolder = folders.find(f => f.type === 'project' && f.itemIds.includes(name));
    const projectColor = projectData?.color || '#3b82f6';
    
    return (
      <motion.div
        key={name}
        variants={itemVariants}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(var(--primary),0.12)] transition-all duration-300 min-w-[240px]"
      >
        <div 
          className="absolute inset-x-0 top-0 h-1 opacity-60 transition-opacity group-hover:opacity-100" 
          style={{ backgroundColor: projectColor }}
        />
        
        <div className="relative p-5 flex items-start justify-between z-10 gap-2">
          <div className="space-y-2 flex-1 min-w-0">
            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-[0.1em] truncate">
              {name}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                {count} {count === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {projectData && (
              <>
                <button
                  onClick={() => setEditingProject({ id: projectData.id, name: projectData.name, color: projectData.color })}
                  className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteProject(projectData.id, name)}
                  className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <MoveToFolderPopOver 
              type="project"
              itemName={name}
              currentFolderId={currentFolder?.id}
              folders={folders}
              onMove={(folderId) => handleMoveToFolder(name, folderId)}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTagItem = ([tag, count]: [string, number]) => {
    const currentFolder = folders.find(f => f.type === 'tag' && f.itemIds.includes(tag));

    return (
      <motion.div
        key={tag}
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        className="group relative flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm hover:border-accent/40 hover:bg-accent/5 hover:shadow-lg hover:shadow-accent/10 transition-all cursor-pointer overflow-hidden"
      >
        <Hash className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
        <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors max-w-[120px] truncate">{tag}</span>
        <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-accent/20 group-hover:text-accent px-2 py-0.5 rounded-full font-black min-w-[1.5rem] text-center transition-colors">
          {count}
        </span>
        
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleRenameTag(tag)}
            className="p-1 hover:bg-accent/10 text-accent rounded-lg transition-colors"
            title="Rename Label"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteTag(tag)}
            className="p-1 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
            title="Delete Label"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <MoveToFolderPopOver 
            type="tag"
            itemName={tag}
            currentFolderId={currentFolder?.id}
            folders={folders}
            onMove={(folderId) => handleMoveToFolder(tag, folderId)}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-20 relative">
      <AddProjectDialog 
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        initialData={editingProject ? { name: editingProject.name, color: editingProject.color } : undefined}
        onSubmit={async (name, color) => {
          if (editingProject) {
            await updateProject(editingProject.id, { name, color });
            setEditingProject(null);
          }
        }}
      />

      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex p-1.5 bg-muted/40 backdrop-blur-xl rounded-[2rem] border border-border/40 w-fit shadow-inner">
            <button
              onClick={() => setActiveTab('projects')}
              className={cn(
                "flex items-center gap-3 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-500",
                activeTab === 'projects' 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
              )}
            >
              <LayoutGrid className={cn("w-4 h-4 transition-transform", activeTab === 'projects' && "scale-110")} />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('labels')}
              className={cn(
                "flex items-center gap-3 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-500",
                activeTab === 'labels' 
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
              )}
            >
              <Tag className={cn("w-4 h-4 transition-transform", activeTab === 'labels' && "scale-110")} />
              Labels
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'projects' && (
              <AddProjectDialog>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white dark:bg-neutral-800 text-foreground border border-border/60 hover:border-primary/40 hover:bg-primary/[0.02] transition-all shadow-sm active:scale-95">
                  <Plus className="w-4 h-4 text-primary" />
                  Add Project
                </button>
              </AddProjectDialog>
            )}
            <button 
              onClick={() => setShowFolderInput(!showFolderInput)}
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 active:scale-95 shadow-lg",
                showFolderInput 
                  ? "bg-neutral-200 dark:bg-neutral-700 text-foreground"
                  : activeTab === 'projects' 
                    ? "bg-primary text-white hover:opacity-90 hover:shadow-primary/30"
                    : "bg-accent text-accent-foreground hover:opacity-90 hover:shadow-accent/30"
              )}
            >
              {showFolderInput ? <X className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
              {showFolderInput ? 'Cancel' : 'New Folder'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto group">
          <div className="absolute inset-0 bg-primary/20 blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
          <PlaceholdersAndVanishInput 
            placeholders={[
              "Filter your workspace...",
              "Find active projects...",
              "Locate specific labels...",
              "Search with precision..."
            ]}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>
      </div>

      {/* Create Folder Input Dropdown */}
      <AnimatePresence>
        {showFolderInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "flex items-center gap-4 p-2.5 bg-card/60 rounded-[2rem] border backdrop-blur-2xl shadow-2xl max-w-xl mx-auto transition-colors duration-500",
              activeTab === 'projects' ? "border-primary/30 shadow-primary/5" : "border-accent/30 shadow-accent/5"
            )}>
              <div className="pl-5">
                <Folder className={cn("w-5 h-5", activeTab === 'projects' ? "text-primary/70" : "text-accent/70")} />
              </div>
              <input 
                autoFocus
                className="bg-transparent border-none focus:ring-0 text-sm font-black flex-1 placeholder:text-muted-foreground/30 outline-none text-foreground uppercase tracking-widest"
                placeholder={`NEW ${activeTab.toUpperCase()} FOLDER NAME...`}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <button 
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className={cn(
                  "px-8 py-3 rounded-[1.5rem] font-black text-xs tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
                  activeTab === 'projects' ? "bg-primary text-white" : "bg-accent text-accent-foreground"
                )}
              >
                CREATE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-16"
        >
          {/* Active Folders Section */}
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className={cn(
                "p-3 rounded-2xl shadow-inner",
                activeTab === 'projects' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              )}>
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-[0.3em] text-foreground/90">Organized Folders</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Structured collections</p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-8">
              {folders
                .filter(f => f.type === (activeTab === 'projects' ? 'project' : 'tag'))
                .map(folder => (
                <FolderCard 
                  key={folder.id} 
                  folder={folder}
                  onDelete={() => deleteFolder(folder.id)}
                  onRename={(name) => updateFolder(folder.id, { name })}
                >
                  {activeTab === 'projects' 
                    ? projectStats
                        .filter(p => folder.itemIds.includes(p.name))
                        .map(renderProjectItem)
                    : tagCounts
                        .filter(([name]) => folder.itemIds.includes(name))
                        .map(renderTagItem)}
                </FolderCard>
              ))}
            </div>
          </div>

          {/* Uncategorized Section */}
          <div className="space-y-10 bg-muted/20 p-10 rounded-[3rem] border border-border/40 backdrop-blur-md relative overflow-hidden">
            <div className={cn(
              "absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-[0.03] -z-10",
              activeTab === 'projects' ? "bg-primary" : "bg-accent"
            )} />

            <div className="flex items-center gap-6">
              <div className="p-3 rounded-2xl bg-muted text-muted-foreground shadow-inner">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-[0.3em] text-muted-foreground">Uncategorized Items</h3>
                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1">Standalone resources</p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className={cn(
                "grid gap-6",
                activeTab === 'projects' 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "flex flex-wrap gap-4"
              )}
            >
              {activeTab === 'projects'
                ? projectStats
                    .filter(p => !folders.some(f => f.type === 'project' && f.itemIds.includes(p.name)))
                    .map(renderProjectItem)
                : tagCounts
                    .filter(([name]) => !folders.some(f => f.type === 'tag' && f.itemIds.includes(name)))
                    .map(renderTagItem)}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}