'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from '../ui/label';
import { useTaskStore } from "@/store/useTaskStore";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const PRESET_COLORS = [
  { name: 'Berry Red', value: '#b8255f' },
  { name: 'Red', value: '#db4035' },
  { name: 'Orange', value: '#ff9933' },
  { name: 'Yellow', value: '#fad000' },
  { name: 'Olive Green', value: '#afb83b' },
  { name: 'Lime Green', value: '#7ecc49' },
  { name: 'Green', value: '#299438' },
  { name: 'Mint Green', value: '#6accbc' },
  { name: 'Teal', value: '#158fad' },
  { name: 'Sky Blue', value: '#14aaf5' },
  { name: 'Light Blue', value: '#4073ff' },
  { name: 'Blue', value: '#246fe0' },
  { name: 'Grape', value: '#884dff' },
  { name: 'Violet', value: '#af38eb' },
  { name: 'Lavender', value: '#eb96eb' },
  { name: 'Magenta', value: '#e05194' },
  { name: 'Salmon', value: '#ff8d85' },
  { name: 'Charcoal', value: '#808080' },
  { name: 'Grey', value: '#b8b8b8' },
  { name: 'Taupe', value: '#ccac93' },
];

export function AddProjectDialog({ 
  children,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: { 
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;
  
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[11].value); // Default Blue
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProject = useTaskStore((state) => state.addProject);

  const handleReset = () => {
    setProjectName("");
    setSelectedColor(PRESET_COLORS[11].value);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addProject(projectName, selectedColor);
      setOpen(false);
      handleReset();
    } catch (error) {
      console.error("Failed to add project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setTimeout(handleReset, 300);
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-accent/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Add Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Work"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-background/50 border-accent/20 focus:border-accent/40"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95",
                    selectedColor === color.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <Check className="h-4 w-4 text-white drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="hover:bg-accent/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName.trim() || isSubmitting}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSubmitting ? "Adding..." : "Add project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
