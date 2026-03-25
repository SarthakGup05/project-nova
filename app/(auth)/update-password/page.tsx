'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Optional: verify the user is actually authenticated
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If they arrived here without a valid session (e.g. fake link), boot them to login
        router.push('/login?error=Session+expired.+Please+request+a+new+reset+link.');
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Success! Send them to the dashboard.
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected exception during password update:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4 font-sans text-foreground">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] mix-blend-screen opacity-50 animate-pulse-glow" style={{ animationDelay: '1s', animationDirection: 'reverse' }} />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Intro */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center mb-6 border border-border shadow-lg backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
            <Sparkles className="w-8 h-8 text-primary relative z-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Set New Password
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter a strong new password to secure your account.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card/40 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background/50 border-input focus-visible:ring-primary/50 text-foreground transition-all duration-300 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background/50 border-input focus-visible:ring-primary/50 text-foreground transition-all duration-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            {errorMsg && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-semibold text-[15px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 cursor-pointer group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
