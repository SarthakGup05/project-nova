'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message); // Replace with a nice toast notification later
    } else {
      router.refresh();
      router.push('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert('Check your email for the confirmation link!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 font-sans">
      <div className="w-full max-w-sm p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">Welcome to Nova</h1>
        
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
          />
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 bg-neutral-800 text-white font-semibold py-3 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
