'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCurrentUser, updateProfile } from '@/lib/auth';
import { AuthSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Building2, Phone, MapPin, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setName(u.name);
      setCompany(u.company ?? '');
      setPhone(u.phone ?? '');
      setAddress(u.address ?? '');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    updateProfile({ name, company, phone, address });
    setUser((u) => u ? { ...u, name, company, phone, address } : u);
    toast.success('Profile successfully updated!');
    setIsLoading(false);
  };

  return (
    <DashboardLayout title="My Profile" requireRole="distributor">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar + Info */}
        <div className="space-y-4">
          {/* Avatar Card */}
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#8DC63F] flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">
                {user?.name?.charAt(0) ?? 'U'}
              </span>
            </div>
            <h3 className="font-bold text-foreground">{user?.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066B3]/10 text-[#0066B3] text-xs font-semibold">
              <Shield size={12} /> Distributor
            </span>
          </div>

          {/* Account Info */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Account Information</h3>
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{user?.email}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Email cannot be changed. Contact admin if needed.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-5">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User size={14} className="text-muted-foreground" /> Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
                  <Building2 size={14} className="text-muted-foreground" /> Company Name
                </Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Example Company"
                  className="h-11"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                  <Phone size={14} className="text-muted-foreground" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                  className="h-11"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin size={14} className="text-muted-foreground" /> Address
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="123 Main St, City, State"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0066B3] hover:bg-[#004d86] text-white h-11 font-semibold px-8"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => {
                    const u = getCurrentUser();
                    if (u) {
                      setName(u.name);
                      setCompany(u.company ?? '');
                      setPhone(u.phone ?? '');
                      setAddress(u.address ?? '');
                    }
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
