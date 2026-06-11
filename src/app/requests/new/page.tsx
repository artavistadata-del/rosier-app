'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRODUCTS } from '@/data/products';
import { getCurrentUser } from '@/lib/auth';
import { createRequest, addNotification } from '@/lib/store';
import { toast } from 'sonner';
import { ArrowLeft, Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AuthSession } from '@/types';

function NewRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('productId') ?? '';

  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [productId, setProductId] = useState(preselectedProductId);
  const [quantity, setQuantity] = useState('1');
  const [address, setAddress] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u?.address) setAddress(u.address);
  }, []);

  const selectedProduct = PRODUCTS.find((p) => p.id === productId);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!productId) errs.productId = 'Please select a product';
    if (!quantity || Number(quantity) <= 0)
      errs.quantity = 'Quantity must be greater than 0';
    if (!address.trim()) errs.address = 'Delivery address is required';
    if (!purpose.trim()) errs.purpose = 'Purpose of use is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    if (!user) return;

    const newRequest = createRequest({
      userId: user.id,
      productId,
      quantity: Number(quantity),
      address,
      purpose,
      notes,
    });

    addNotification({
      userId: user.id,
      title: 'Request Successfully Submitted',
      message: `Your sample request for ${selectedProduct?.name} has been submitted and is being processed.`,
      type: 'success',
    });

    toast.success('Sample request submitted successfully!');
    router.push(`/requests/${newRequest.id}`);
  };

  return (
    <DashboardLayout title="New Sample Request" requireRole="distributor">
      <Link
        href="/products"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 w-fit"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-5">Request Details</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Select */}
              <div className="space-y-1.5">
                <Label htmlFor="product" className="text-sm font-medium">
                  Product <span className="text-destructive">*</span>
                </Label>
                <Select value={productId} onValueChange={(v) => { setProductId(v); setErrors((e) => ({ ...e, productId: '' })); }}>
                  <SelectTrigger id="product" className={errors.productId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a Rosier product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">– {p.category}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productId && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.productId}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Sample Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => { setQuantity(e.target.value); setErrors((er) => ({ ...er, quantity: '' })); }}
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.quantity}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-medium">
                  Delivery Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  rows={3}
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors((er) => ({ ...er, address: '' })); }}
                  placeholder="123 Example Street, City, Province"
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.address}
                  </p>
                )}
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <Label htmlFor="purpose" className="text-sm font-medium">
                  Purpose of Use <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  rows={3}
                  value={purpose}
                  onChange={(e) => { setPurpose(e.target.value); setErrors((er) => ({ ...er, purpose: '' })); }}
                  placeholder="Describe how you plan to use this sample..."
                  className={errors.purpose ? 'border-destructive' : ''}
                />
                {errors.purpose && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.purpose}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for the Rosier team (optional)"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#0066B3] hover:bg-[#004d86] text-white h-11 font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
                <Link href="/requests">
                  <Button type="button" variant="outline" className="h-11">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          {selectedProduct ? (
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Selected Product</h3>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0066B3]/10 flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-[#0066B3]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{selectedProduct.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedProduct.category}</p>
                  <p className="text-xs text-muted-foreground">{selectedProduct.packaging}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                {selectedProduct.description.slice(0, 120)}...
              </p>
            </div>
          ) : (
            <div className="bg-muted/40 rounded-2xl border border-dashed border-border p-5 text-center">
              <Package size={28} className="text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Select a product to see details</p>
            </div>
          )}

          {/* Guide */}
          <div className="bg-gradient-to-br from-[#8DC63F]/5 to-[#0066B3]/5 rounded-2xl border border-[#8DC63F]/20 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Request Guidelines</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Maximum 100 sample units per request</li>
              <li>• Review process takes 1–3 business days</li>
              <li>• Shipping after admin approval</li>
              <li>• One product per request</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function NewRequestPage() {
  return (
    <Suspense fallback={<DashboardLayout title="New Sample Request"><div className="animate-pulse bg-card rounded-2xl h-96" /></DashboardLayout>}>
      <NewRequestForm />
    </Suspense>
  );
}
