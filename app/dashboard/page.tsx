'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refresh to trigger middleware
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-border pb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
        
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <p className="text-muted-foreground">
            You are signed in as <strong className="text-foreground">{user?.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
