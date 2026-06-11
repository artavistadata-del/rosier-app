'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getRequestById, updateRequestStatus, addNotification } from '@/lib/store';
import { PRODUCTS } from '@/data/products';
import { DEMO_USERS } from '@/data/users';
import { SampleRequest, RequestStatus } from '@/types';
import { ADMIN_STATUS_TRANSITIONS } from '@/constants';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import StatusTimeline from '@/components/requests/StatusTimeline';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Target,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [request, setRequest] = useState<SampleRequest | null | undefined>(undefined);
  const [newStatus, setNewStatus] = useState<RequestStatus | ''>('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const req = getRequestById(id);
    setRequest(req ?? null);
  }, [id]);

  if (request === undefined) {
    return (
      <DashboardLayout title="Request Details" requireRole="admin">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (request === null) {
    return (
      <DashboardLayout title="Request Details" requireRole="admin">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Request not found.</p>
          <Link href="/admin/requests">
            <Button variant="outline" className="mt-4">Back</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const product = PRODUCTS.find((p) => p.id === request.productId);
  const reqUser = DEMO_USERS.find((u) => u.id === request.userId);
  const availableTransitions = ADMIN_STATUS_TRANSITIONS[request.status] ?? [];

  const handleApprove = async () => {
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 500));
    const updated = updateRequestStatus(id, 'Approved');
    if (updated) {
      addNotification({
        userId: request.userId,
        title: 'Request Approved ✓',
        message: `Your sample request for ${product?.name} has been approved. Processing soon.`,
        type: 'success',
      });
      setRequest(updated);
      toast.success('Request successfully approved!');
    }
    setIsUpdating(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Enter rejection reason');
      return;
    }
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 500));
    const updated = updateRequestStatus(id, 'Rejected', rejectionReason);
    if (updated) {
      addNotification({
        userId: request.userId,
        title: 'Request Rejected',
        message: `Your sample request for ${product?.name} was rejected. Reason: ${rejectionReason}`,
        type: 'error',
      });
      setRequest(updated);
      setShowRejectDialog(false);
      toast.success('Request successfully rejected.');
    }
    setIsUpdating(false);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Select new status');
      return;
    }
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 500));
    const updated = updateRequestStatus(id, newStatus as RequestStatus);
    if (updated) {
      addNotification({
        userId: request.userId,
        title: 'Request Status Updated',
        message: `Sample status for ${product?.name} changed to: ${newStatus}`,
        type: 'info',
      });
      setRequest(updated);
      setNewStatus('');
      toast.success(`Status diperbarui ke "${newStatus}"`);
    }
    setIsUpdating(false);
  };

  const isPendingReview = ['Submitted', 'Pending Review'].includes(request.status);

  return (
    <DashboardLayout title="Request Details" requireRole="admin">
      <Link
        href="/admin/requests"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 w-fit"
      >
        <ArrowLeft size={16} /> Back to Request List
      </Link>

      {/* Header */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <RequestStatusBadge status={request.status} />
              <span className="text-xs text-muted-foreground font-mono">{request.id}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mt-2">
              {product?.name ?? 'Unknown Product'}
            </h2>
            <p className="text-sm text-muted-foreground">{product?.category} • {product?.packaging}</p>
          </div>
          <div className="text-sm text-muted-foreground text-left sm:text-right">
            <p className="text-xs">Created: {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm')}</p>
            <p className="text-xs mt-1">Updated: {format(new Date(request.updatedAt), 'dd MMM yyyy, HH:mm')}</p>
          </div>
        </div>
      </div>

      {/* Rejection Notice */}
      {request.status === 'Rejected' && request.rejectionReason && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 mb-5">
          <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
            <p className="text-sm text-red-600 mt-0.5">{request.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Distributor */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User size={16} className="text-[#0066B3]" /> Distributor Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow label="Name" value={reqUser?.name ?? '-'} />
              <InfoRow label="Company" value={reqUser?.company ?? '-'} />
              <InfoRow label="Email" value={reqUser?.email ?? '-'} />
              <InfoRow label="Phone" value={reqUser?.phone ?? '-'} />
            </div>
          </div>

          {/* Request Detail */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package size={16} className="text-[#0066B3]" /> Request Details
            </h3>
            <div className="space-y-3">
              <InfoRow label="Sample Quantity" value={`${request.quantity} unit`} />
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                  <MapPin size={12} /> Shipping Address
                </p>
                <p className="text-sm text-foreground bg-muted/40 rounded-xl px-3 py-2">{request.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Target size={12} /> Purpose of Use
                </p>
                <p className="text-sm text-foreground bg-muted/40 rounded-xl px-3 py-2">{request.purpose}</p>
              </div>
              {request.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                    <FileText size={12} /> Notes
                  </p>
                  <p className="text-sm text-foreground bg-muted/40 rounded-xl px-3 py-2">{request.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Admin Actions</h3>

            {/* Quick Approve/Reject */}
            {isPendingReview && (
              <div className="flex gap-3 mb-4">
                <Button
                  onClick={handleApprove}
                  disabled={isUpdating}
                  className="flex-1 bg-[#8DC63F] hover:bg-[#6fa52e] text-white gap-2 h-11"
                >
                  <CheckCircle2 size={16} /> Approve Request
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isUpdating}
                  variant="destructive"
                  className="flex-1 gap-2 h-11"
                >
                  <XCircle size={16} /> Reject Request
                </Button>
              </div>
            )}

            {/* Update Status */}
            {availableTransitions.length > 0 && !isPendingReview && (
              <div className="flex gap-3">
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as RequestStatus)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select new status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTransitions.filter((s) => s !== 'Approved' && s !== 'Rejected').map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || !newStatus}
                  className="bg-[#0066B3] hover:bg-[#004d86] text-white gap-2"
                >
                  <RefreshCw size={14} /> Update
                </Button>
              </div>
            )}

            {availableTransitions.length === 0 && request.status !== 'Rejected' && (
              <p className="text-sm text-muted-foreground text-center py-2">
                ✓ No further actions available for this status.
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Status Progress</h3>
          <StatusTimeline currentStatus={request.status} />
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enter rejection reason. This reason will be sent to the distributor as a notification.
            </p>
            <div className="space-y-1.5">
              <Label>Rejection Reason *</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="Example: Sample stock is currently empty, please try again next month."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isUpdating}
            >
              {isUpdating ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}
