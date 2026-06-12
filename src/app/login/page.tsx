'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4 sm:p-8 z-0">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#0066B3]/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00AEEF]/20 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-[#8DC63F]/20 blur-[100px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '4s' }} />
      </div>

      {/* Main Wrapper Card */}
      <div className="w-full max-w-[1000px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden flex flex-col md:flex-row min-h-[600px] m-auto relative z-10">
        
        {/* Left Panel – Gradient Design */}
        <div className="hidden md:flex flex-col w-[45%] bg-gradient-to-br from-[#102A43] via-[#0066B3] to-[#00AEEF] p-12 relative overflow-hidden text-white">
          {/* Subtle noise/mesh overlay effect */}
          <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
          
          {/* Logo */}
          <div className="relative z-10">
             <img src="/rosier.png" alt="Rosier" className="h-10 object-contain brightness-0 invert" />
          </div>

          <div className="relative z-10 mt-auto pt-20">
            <p className="text-white/80 text-[15px] font-medium mb-3">You can easily</p>
            <h2 className="text-[34px] font-bold text-white leading-[1.1] tracking-tight">
              Get access your personal hub for clarity and productivity
            </h2>
          </div>
        </div>

        {/* Right Panel – Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 relative bg-white">
          
          <div className="w-full max-w-[340px]">
            {/* Mobile Logo */}
            <div className="md:hidden mb-8 text-center flex justify-center">
              <img src="/rosier.png" alt="Rosier" className="h-12 object-contain" />
            </div>

            {/* Desktop Logo (Centered above form) */}
            <div className="hidden md:block mb-8 text-left">
               <img src="/rosier.png" alt="Rosier" className="h-10 object-contain" />
            </div>

            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight mb-3">Sign in to account</h1>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Access your Rosier portal anytime, anywhere - and keep everything flowing in one place.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-bold text-slate-800">
                  Your email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="h-11 rounded-xl bg-white border-slate-200 text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[13px] font-bold text-slate-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="h-11 pr-10 rounded-xl bg-white border-slate-200 text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)] transition-all mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Get Started'
                )}
              </Button>
            </form>

            {/* Demo Accounts (styled like "or continue with") */}
            <div className="mt-8">
              <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-[11px] text-slate-400 font-medium">or continue with demo</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fillDemo('distributor')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                >
                  Distributor
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-[13px] text-slate-500 font-medium">
              Don't have an account? <Link href="#" className="text-[#3b82f6] hover:underline font-bold">Sign up</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
