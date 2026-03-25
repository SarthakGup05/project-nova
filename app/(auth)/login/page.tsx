'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Sparkles, Loader2, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type ViewState = 'login' | 'forgot-password' | 'success';

export default function LoginPage() {
  const [view, setView] = useState<ViewState>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.refresh();
        router.push('/');
      }
    } catch (err) {
      console.error('Unexpected exception during login:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setView('success');
      }
    } catch (err) {
      console.error('Unexpected exception during password reset:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const viewVariants = {
    initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -20, filter: 'blur(4px)' }
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
          
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div key="login-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  Welcome to <span className="text-gradient bg-gradient-to-r from-primary to-accent">Nova</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-2">Enter your credentials to access your workspace</p>
              </motion.div>
            )}
            {view === 'forgot-password' && (
              <motion.div key="forgot-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-extrabold tracking-tight">Reset Password</h1>
                <p className="text-muted-foreground text-sm mt-2">Enter your email to receive a secure reset link.</p>
              </motion.div>
            )}
            {view === 'success' && (
              <motion.div key="success-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-extrabold tracking-tight">Email Sent</h1>
                <p className="text-muted-foreground text-sm mt-2">Check your inbox for the reset link.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form Card */}
        <div className="bg-card/40 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[400px]">
          
          {errorMsg && (
             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 left-8 right-8 z-20">
               <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                 {errorMsg}
               </div>
             </motion.div>
          )}

          <div className="h-full flex flex-col justify-center">
            <AnimatePresence mode="wait" initial={false}>
              
              {/* --- LOGIN VIEW --- */}
              {view === 'login' && (
                <motion.form 
                  key="login-form"
                  variants={viewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="space-y-5" 
                  onSubmit={handleLogin}
                >
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
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
                        <button 
                          type="button" 
                          onClick={() => { setView('forgot-password'); setErrorMsg(''); }}
                          className="text-xs text-primary hover:underline decoration-primary/50 pr-1"
                        >
                          Forgot password?
                        </button>
                      </div>
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
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">Don't have an account? </span>
                      <Link href="/signup" className="text-primary font-semibold hover:underline decoration-primary/50 underline-offset-4">
                        Sign up
                      </Link>
                    </div>
                  </div>
                </motion.form>
              )}

              {/* --- FORGOT PASSWORD VIEW --- */}
              {view === 'forgot-password' && (
                <motion.form 
                  key="forgot-form"
                  variants={viewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="space-y-5" 
                  onSubmit={handleResetPassword}
                >
                  <div className="space-y-4 pt-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Email Address</label>
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
                  </div>
                  
                  <div className="pt-6 space-y-4">
                    <Button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full h-12 rounded-xl font-semibold text-[15px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 cursor-pointer group"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Send Reset Link
                          <Sparkles className="w-4 h-4 ml-2 opacity-70 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center pt-2">
                      <button 
                        type="button" 
                        onClick={() => { setView('login'); setErrorMsg(''); }}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                      >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to sign in
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}

              {/* --- SUCCESS VIEW --- */}
              {view === 'success' && (
                <motion.div 
                  key="success-view"
                  variants={viewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="text-center space-y-4 py-8"
                >
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold tracking-tight">Check your inbox</h3>
                  <p className="text-muted-foreground leading-relaxed px-4">
                    We've securely sent a password reset link to <br/>
                    <strong className="text-foreground">{email}</strong>
                  </p>
                  
                  <div className="pt-8 w-full max-w-[200px] mx-auto">
                    <Button 
                      onClick={() => { setView('login'); setEmail(''); setPassword(''); }}
                      variant="outline" 
                      className="w-full h-11 rounded-xl font-semibold border-border/50 hover:bg-accent/10"
                    >
                      Return to sign in
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
        
        {/* Footer text is only relevant for login/signup, hide softly if reset */}
        <AnimatePresence>
          {view === 'login' && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-xs text-muted-foreground/60 px-6 pt-4"
            >
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
