'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '../ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';

interface BrainDumpProps {
  userId: string;
}

export function BrainDump({ userId }: BrainDumpProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const handleAnalyze = async () => {
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/parse-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId }),
      });

      if (!response.ok) throw new Error('Failed to process brain dump');

      const result = await response.json();
      if (result.success) {
        setPrompt('');
        await fetchTasks();
      }
    } catch (error) {
      console.error('Brain dump error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm overflow-hidden relative">
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-accent/5 backdrop-blur-[2px] z-10 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-sm font-medium text-accent">AI is organizing your thoughts...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent animate-pulse-glow" />
          Brain Dump
        </CardTitle>
        <CardDescription>
          Paste your messy thoughts, and our AI will extract actionable tasks automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., 'Need to finish the report by Friday, also don't forget to call Mom and buy milk today at 6pm'"
          className="min-h-[120px] bg-background/50 border-accent/10 focus-visible:ring-accent"
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          disabled={isProcessing}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleAnalyze} 
            disabled={!prompt.trim() || isProcessing}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Analyze with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
