import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { packageService } from '../../services/packageService';
import { transactionService } from '../../services/transactionService';
import type { Package, Transaction } from '../../types';
import { PackageCard } from '../../components/PackageCard';
import { PackageCardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [packages, transactions] = await Promise.all([
        packageService.getFeaturedPackages(),
        transactionService.getTransactionsByUser(user!.id),
      ]);
      setFeaturedPackages(packages);
      setRecentTransactions(transactions.slice(0, 3));
      setTransactionCount(transactions.length);
      setTotalSpent(transactions.reduce((sum, t) => sum + t.price, 0));
    } catch {
      setError('Gagal memuat data. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = [
    {
      label: 'Total Transaksi',
      value: transactionCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      label: 'Total Pengeluaran',
      value: formatCurrency(totalSpent),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      label: 'Paket Tersedia',
      value: '20+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
  ];

  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Halo, {user?.name}!</h1>
        <p className="text-blue-100 text-sm">Selamat datang kembali. Cek paket data terbaru untuk Anda.</p>
        <Link to="/packages">
          <Button variant="ghost" size="sm" className="mt-4 !bg-white !text-blue-600 hover:!bg-blue-50 !border-white">
            Lihat Semua Paket
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{loading ? '...' : stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Packages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Paket Populer</h2>
          <Link to="/packages" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Lihat semua &rarr;
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <PackageCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredPackages.map(pkg => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Transaksi Terakhir</h2>
          <Link to="/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Lihat semua &rarr;
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-16" />
                </div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Belum ada transaksi. <Link to="/packages" className="text-blue-600">Beli paket sekarang!</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTransactions.map(txn => (
                <div key={txn.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{txn.packageName}</p>
                    <p className="text-xs text-gray-500">{txn.provider} · {formatDate(txn.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(txn.price)}</p>
                    <Badge variant="success" className="mt-0.5">Berhasil</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
