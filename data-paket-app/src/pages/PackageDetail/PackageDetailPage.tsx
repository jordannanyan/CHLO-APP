import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageService } from '../../services/packageService';
import type { Package } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useModalStore } from '../../store/modalStore';
import { useAuthStore } from '../../store/authStore';

export const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openCheckout } = useModalStore();
  const { user } = useAuthStore();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackage = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await packageService.getPackageById(id);
      setPkg(data);
    } catch {
      setError('Paket tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackage(); }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-200">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !pkg) return <ErrorState message={error || 'Paket tidak ditemukan'} onRetry={fetchPackage} />;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20">
              {pkg.provider}
            </span>
            {pkg.popular && <Badge variant="info" className="bg-white/20 text-white">Populer</Badge>}
          </div>
          <h1 className="text-2xl font-bold mb-1">{pkg.name}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold">{pkg.quota === 999 ? '∞' : pkg.quota}</span>
            <span className="text-blue-200">{pkg.quota === 999 ? 'Unlimited' : pkg.quotaUnit}</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: 'Masa Aktif',
                value: `${pkg.validity} Hari`,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                label: 'Kecepatan',
                value: pkg.speed,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                label: 'Kategori',
                value: pkg.category,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
              },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h3>
            <p className="text-sm text-gray-600">{pkg.description}</p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Keuntungan Paket</h3>
            <ul className="space-y-2">
              {[
                `Kuota ${pkg.quota === 999 ? 'unlimited' : `${pkg.quota}${pkg.quotaUnit}`} untuk semua aplikasi`,
                `Masa aktif ${pkg.validity} hari`,
                `Kecepatan ${pkg.speed}`,
                'Aktivasi instan setelah pembayaran',
                'Berlaku 24 jam',
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Price & CTA */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">Harga</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(pkg.price)}</p>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={() => openCheckout(pkg, user?.phone || '')}>
              Beli Sekarang
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};
