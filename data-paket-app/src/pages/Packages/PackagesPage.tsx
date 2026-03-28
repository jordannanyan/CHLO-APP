import React, { useState, useEffect, useCallback } from 'react';
import { packageService } from '../../services/packageService';
import type { Package, FilterState, PaginationState } from '../../types';
import { PackageCard } from '../../components/PackageCard';
import { PackageCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';

const PROVIDERS = ['all', 'Telkomsel', 'Indosat', 'XL', 'AXIS', 'Three'];
const PRICE_RANGES = [
  { label: 'Semua', min: 0, max: 0 },
  { label: '< Rp 25.000', min: 0, max: 25000 },
  { label: 'Rp 25.000 - 75.000', min: 25000, max: 75000 },
  { label: '> Rp 75.000', min: 75001, max: 0 },
];
const QUOTA_RANGES = [
  { label: 'Semua', min: 0, max: 0 },
  { label: '< 5GB', min: 0, max: 4 },
  { label: '5 - 10GB', min: 5, max: 10 },
  { label: '> 10GB', min: 11, max: 0 },
];
const LIMIT = 8;

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    provider: 'all',
    minPrice: 0,
    maxPrice: 0,
    minQuota: 0,
    maxQuota: 0,
    search: '',
  });
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: LIMIT, total: 0 });
  const [searchInput, setSearchInput] = useState('');

  const fetchPackages = useCallback(async (currentFilters: FilterState, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await packageService.getPackages({
        page,
        limit: LIMIT,
        provider: currentFilters.provider,
        minPrice: currentFilters.minPrice,
        maxPrice: currentFilters.maxPrice,
        minQuota: currentFilters.minQuota,
        maxQuota: currentFilters.maxQuota,
        search: currentFilters.search,
      });
      setPackages(result.data);
      setPagination(prev => ({ ...prev, page, total: result.total }));
    } catch {
      setError('Gagal memuat paket data. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages(filters, 1);
  }, [filters, fetchPackages]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceRange = (range: typeof PRICE_RANGES[0]) => {
    setFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max }));
  };

  const handleQuotaRange = (range: typeof QUOTA_RANGES[0]) => {
    setFilters(prev => ({ ...prev, minQuota: range.min, maxQuota: range.max }));
  };

  const resetFilters = () => {
    setFilters({ provider: 'all', minPrice: 0, maxPrice: 0, minQuota: 0, maxQuota: 0, search: '' });
    setSearchInput('');
  };

  const totalPages = Math.ceil(pagination.total / LIMIT);
  const hasActiveFilters = filters.provider !== 'all' || filters.minPrice > 0 || filters.maxPrice > 0 || filters.minQuota > 0 || filters.maxQuota > 0 || filters.search !== '';

  const getActivePriceLabel = () => {
    const range = PRICE_RANGES.find(r => r.min === filters.minPrice && r.max === filters.maxPrice);
    return range?.label || 'Semua';
  };

  const getActiveQuotaLabel = () => {
    const range = QUOTA_RANGES.find(r => r.min === filters.minQuota && r.max === filters.maxQuota);
    return range?.label || 'Semua';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paket Data Internet</h1>
        <p className="text-gray-500 text-sm mt-1">Temukan paket data terbaik untuk kebutuhan Anda</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Cari paket data..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <Button type="submit" size="md">Cari</Button>
      </form>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-56 space-y-5 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Filter</h3>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-700">
                  Reset
                </button>
              )}
            </div>

            {/* Provider Filter */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Provider</p>
              <div className="space-y-1">
                {PROVIDERS.map(provider => (
                  <button
                    key={provider}
                    onClick={() => handleFilterChange('provider', provider)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.provider === provider
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {provider === 'all' ? 'Semua Provider' : provider}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Harga</p>
              <div className="space-y-1">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceRange(range)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      getActivePriceLabel() === range.label
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quota Filter */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Kuota</p>
              <div className="space-y-1">
                {QUOTA_RANGES.map(range => (
                  <button
                    key={range.label}
                    onClick={() => handleQuotaRange(range)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      getActiveQuotaLabel() === range.label
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Package Grid */}
        <div className="flex-1">
          {error ? (
            <ErrorState message={error} onRetry={() => fetchPackages(filters, pagination.page)} />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: LIMIT }).map((_, i) => <PackageCardSkeleton key={i} />)}
            </div>
          ) : packages.length === 0 ? (
            <EmptyState
              title="Paket tidak ditemukan"
              description="Coba ubah filter atau kata kunci pencarian Anda"
              action={<Button variant="outline" size="sm" onClick={resetFilters}>Reset Filter</Button>}
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{pagination.total} paket ditemukan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {packages.map(pkg => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => fetchPackages(filters, pagination.page - 1)}
                  >
                    &larr; Sebelumnya
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => fetchPackages(filters, page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          page === pagination.page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === totalPages}
                    onClick={() => fetchPackages(filters, pagination.page + 1)}
                  >
                    Selanjutnya &rarr;
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};
