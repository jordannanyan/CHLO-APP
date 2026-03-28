import React from 'react';
import { Link } from 'react-router-dom';
import type { Package } from '../types';
import { formatCurrency } from '../utils/format';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useModalStore } from '../store/modalStore';
import { useAuthStore } from '../store/authStore';

interface PackageCardProps {
  package: Package;
}

const providerColors: Record<string, string> = {
  Telkomsel: 'bg-red-100 text-red-700',
  Indosat: 'bg-yellow-100 text-yellow-700',
  XL: 'bg-blue-100 text-blue-700',
  AXIS: 'bg-purple-100 text-purple-700',
  Three: 'bg-green-100 text-green-700',
};

export const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  const { openCheckout } = useModalStore();
  const { user } = useAuthStore();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${providerColors[pkg.provider] || 'bg-gray-100 text-gray-700'}`}>
          {pkg.provider}
        </span>
        {pkg.popular && <Badge variant="info">Populer</Badge>}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{pkg.name}</h3>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {pkg.quota === 999 ? '∞' : pkg.quota}
          </span>
          <span className="text-sm text-gray-500">{pkg.quota === 999 ? 'Unlimited' : pkg.quotaUnit}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {pkg.validity} hari
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {pkg.speed}
        </span>
      </div>

      <div className="mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">{formatCurrency(pkg.price)}</span>
        </div>
        <div className="flex gap-2">
          <Link to={`/packages/${pkg.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">Detail</Button>
          </Link>
          <Button size="sm" className="flex-1" onClick={() => openCheckout(pkg, user?.phone || '')}>
            Beli
          </Button>
        </div>
      </div>
    </div>
  );
};
