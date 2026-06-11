'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Leaf, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace(session.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const session = login(email, password);
    if (!session) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
      return;
    }

    toast.success(`Welcome back, ${session.user.name}!`);
    router.push(session.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
  };

  const fillDemo = (role: 'distributor' | 'admin') => {
    if (role === 'distributor') {
      setEmail('distributor@rosier.demo');
    } else {
      setEmail('admin@rosier.demo');
    }
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-[#102A43] via-[#0066B3] to-[#00AEEF] p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8DC63F]/10 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Leaf className="text-white" size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Rosier</p>
              <p className="text-white/60 text-xs">Sample Portal</p>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Sample Requests,
            <br />
            <span className="text-[#8DC63F]">Simpler.</span>
            <br />
            Faster.
          </h2>
          <p className="mt-4 text-white/70 text-base leading-relaxed max-w-sm">
            The Rosier B2B portal enables authorized distributors to submit, track,
            and manage fertilizer product sample requests — fully digital.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              'Submit a request in minutes',
              'Track status in real-time',
              'Centralized request history',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#8DC63F] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
                <p className="text-white/80 text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/40 text-xs">
          © 2024 PT. Rosier Indonesia. All rights reserved.
        </p>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#0066B3] flex items-center justify-center">
              <Leaf className="text-white" size={16} />
            </div>
            <span className="font-bold text-foreground">Rosier Sample Portal</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Sign in to your Rosier account to continue
            </p>
          </div>

          {/* Demo Account Buttons */}
          <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              🔑 Demo Accounts – Click to autofill:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('distributor')}
                className="flex-1 text-xs py-2 px-3 rounded-lg bg-[#0066B3]/10 text-[#0066B3] font-medium hover:bg-[#0066B3]/20 transition-colors"
              >
                👤 Distributor
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex-1 text-xs py-2 px-3 rounded-lg bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertCircle size={16} className="text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#0066B3] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#0066B3] hover:bg-[#004d86] text-white font-semibold mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
