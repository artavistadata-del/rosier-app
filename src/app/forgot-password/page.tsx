'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 w-fit"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          {!submitted ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#0066B3]/10 flex items-center justify-center mb-6">
                <Mail className="text-[#0066B3]" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
              <p className="text-muted-foreground text-sm mt-2 mb-6">
                Enter your email and we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#0066B3] hover:bg-[#004d86] text-white font-semibold"
                >
                  Send Reset Instructions
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#8DC63F]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-[#8DC63F]" size={32} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Email Sent!</h2>
              <p className="text-muted-foreground text-sm mt-2 mb-6">
                <strong>{email}</strong> — This is a demo portal, no real email was sent.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full h-11">
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
