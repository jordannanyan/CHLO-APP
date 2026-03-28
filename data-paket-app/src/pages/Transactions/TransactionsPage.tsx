import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { useAuthStore } from '../../store/authStore';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getTransactionsByUser(user.id);
      setTransactions(data);
    } catch {
      setError('Gagal memuat riwayat transaksi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const statusVariants: Record<string, 'success' | 'warning' | 'error'> = {
    success: 'success',
    pending: 'warning',
    failed: 'error',
  };

  const statusLabels: Record<string, string> = {
    success: 'Berhasil',
    pending: 'Pending',
    failed: 'Gagal',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <p className="text-gray-500 text-sm mt-1">Semua riwayat pembelian paket data Anda</p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchTransactions} />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 animate-pulse">
              <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/5" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Mulai beli paket data pertama Anda sekarang!"
          action={
            <Link to="/packages">
              <Button size="sm">Beli Paket Data</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {transactions.map(txn => (
            <div key={txn.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{txn.packageName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{txn.provider}</p>
                <p className="text-xs text-gray-400 mt-0.5">{txn.phone} · {formatDate(txn.createdAt)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">{formatCurrency(txn.price)}</p>
                <Badge variant={statusVariants[txn.status]} className="mt-1">
                  {statusLabels[txn.status]}
                </Badge>
                <p className="text-xs text-gray-400 mt-1 font-mono">{txn.id.slice(0, 12)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
