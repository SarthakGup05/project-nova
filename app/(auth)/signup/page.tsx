'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('--- SIGNUP INITIATED ---');
    console.log('Attempting signup for email:', email);
    
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('Supabase signup raw response:', response);
      
      if (response.error) {
        console.error('Signup error:', response.error.message);
        alert(response.error.message);
      } else {
        console.log('Signup success, check email confirm. User data:', response.data);
        alert('Check your email for the confirmation link!');
      }
    } catch (err) {
      console.error('Unexpected exception during signup:', err);
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
          <h1 className="text-4xl font-extrabold tracking-tight">
            Create an Account
          </h1>
          <p className="text-muted-foreground text-sm">
            Join <span className="text-primary font-semibold">Nova</span> to unlock AI-powered tools
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card/40 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSignUp}>
            <div className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background/50 border-input focus-visible:ring-primary/50 text-foreground transition-all duration-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 h-12 bg-background/50 border-input focus-visible:ring-primary/50 text-foreground transition-all duration-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-semibold text-[15px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 cursor-pointer group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary font-semibold hover:underline decoration-primary/50 underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
        
        <p className="text-center text-xs text-muted-foreground/60 px-6">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
