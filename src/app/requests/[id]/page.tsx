'use client';

import { use, useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getRequestById } from '@/lib/store';
import { PRODUCTS } from '@/data/products';
import { SampleRequest } from '@/types';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import StatusTimeline from '@/components/requests/StatusTimeline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  MapPin,
  Target,
  FileText,
  Calendar,
  Hash,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [request, setRequest] = useState<SampleRequest | null | undefined>(undefined);

  useEffect(() => {
    const req = getRequestById(id);
    setRequest(req ?? null);
  }, [id]);

  if (request === undefined) {
    return (
      <DashboardLayout title="Detail Request" requireRole="distributor">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (request === null) {
    return (
      <DashboardLayout title="Detail Request" requireRole="distributor">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Request tidak ditemukan.</p>
          <Link href="/requests">
            <Button variant="outline" className="mt-4">Kembali</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const product = PRODUCTS.find((p) => p.id === request.productId);

  return (
    <DashboardLayout title="Detail Request" requireRole="distributor">
      <Link
        href="/requests"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 w-fit"
      >
        <ArrowLeft size={16} /> Kembali ke Riwayat
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
            <p className="text-sm text-muted-foreground mt-0.5">{product?.category} • {product?.packaging}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-xs text-muted-foreground">Dibuat</p>
            <p className="text-sm font-medium text-foreground">
              {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Diperbarui</p>
            <p className="text-sm font-medium text-foreground">
              {format(new Date(request.updatedAt), 'dd MMM yyyy, HH:mm')}
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Notice */}
      {request.status === 'Rejected' && request.rejectionReason && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 mb-5">
          <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-red-700">Alasan Penolakan</p>
            <p className="text-sm text-red-600 mt-0.5">{request.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Detail Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info Grid */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Informasi Request</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={Package} label="Jumlah Sample" value={`${request.quantity} unit`} />
              <InfoItem icon={Hash} label="ID Request" value={request.id} mono />
              <InfoItem icon={Calendar} label="Tanggal Request" value={format(new Date(request.createdAt), 'dd MMMM yyyy')} />
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0066B3]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-[#0066B3]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alamat Pengiriman</p>
                  <p className="text-sm text-foreground mt-0.5">{request.address}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8DC63F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target size={14} className="text-[#8DC63F]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purpose of Use</p>
                <p className="text-sm text-foreground mt-0.5">{request.purpose}</p>
              </div>
            </div>

            {request.notes && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={14} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Catatan</p>
                  <p className="text-sm text-foreground mt-0.5">{request.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/requests/new">
              <Button className="bg-[#0066B3] hover:bg-[#004d86] text-white">
                Request Another Product
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">Lihat Katalog</Button>
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Status Perjalanan</h3>
          <StatusTimeline currentStatus={request.status} />
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm text-foreground mt-0.5 ${mono ? 'font-mono text-xs' : 'font-medium'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
