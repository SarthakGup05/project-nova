'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Send, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNotificationStore } from '@/store/useNotificationStore';

export function BroadcastNotification() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'achievement' | 'ai' | 'success'>('info');
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!title || !message) return;
    setIsSending(true);
    try {
      const response = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type }),
      });
      if (response.ok) {
        setTitle('');
        setMessage('');
        setIsOpen(false);
        // Show a local success notification
        useNotificationStore.getState().addNotification({
          type: 'success',
          title: 'Broadcast Sent!',
          message: 'Your message has been pushed to all users.'
        });
      }
    } catch (error) {
      console.error("Broadcast failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-primary/20"
        >
          <Megaphone className="w-5 h-5" />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-80 bg-background border border-border rounded-3xl shadow-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Broadcast
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <Input 
              placeholder="Notification Title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/50 border-none font-bold uppercase tracking-wider text-xs"
            />
            <Textarea 
              placeholder="Broadcast message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-muted/50 border-none text-xs min-h-[100px]"
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['info', 'warning', 'achievement', 'ai', 'success'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    type === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-[0.2em] text-xs h-12 shadow-lg shadow-primary/20"
              onClick={handleSend}
              disabled={isSending || !title || !message}
            >
              <Send className="w-3 h-3 mr-2" />
              {isSending ? 'SENDING...' : 'SEND TO ALL'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
