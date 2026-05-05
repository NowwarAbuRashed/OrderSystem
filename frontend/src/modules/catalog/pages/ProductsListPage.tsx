import { useState, useEffect } from 'react';
import { useProductsQuery, useCategoriesQuery } from '../hooks/useCatalog';
import { useI18n } from '../../../app/i18n/i18n-context';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { EmptyState } from '../../../shared/components/EmptyState';
import { PageHeader } from '../../../shared/components/PageHeader';
import { ProductCard } from '../../../shared/components/ProductCard';
import { useAddCartItem } from '../../cart/hooks/useCart';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export function ProductsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const pageSize = 12;
  const { t } = useI18n();

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const setPage = (newPage: number) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (newPage <= 1) params.delete('page');
      else params.set('page', String(newPage));
      return params;
    }, { replace: true });
  };

  const setSearch = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value) params.set('search', value);
      else params.delete('search');
      params.delete('page');
      return params;
    }, { replace: true });
  };

  const setCategoryId = (id: number | undefined) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (id) params.set('categoryId', String(id));
      else params.delete('categoryId');
      params.delete('page');
      return params;
    }, { replace: true });
  };
  const { data, isLoading, error } = useProductsQuery({ page, pageSize, search, categoryId });
  const { data: categories } = useCategoriesQuery();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddCartItem();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
  };

  const handleAddToCart = (productId: number) => {
    addToCart({ productId, quantity: 1 });
  };

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message={getApiErrorMessage(error)} />;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl overflow-hidden p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-4 left-12 w-20 h-20 border-4 border-white rounded-full" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {t.products.heroTitle}
          </h1>
          <p className="text-primary-100 mt-3 text-base md:text-lg">
            {t.products.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/60 pb-6">
        <PageHeader
          title={t.products.catalog}
          description={t.products.catalogDesc}
        />

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors z-10">
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={t.products.searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border-0 py-2.5 pl-10 pr-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all bg-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={categoryId || ''}
              onChange={(e) => {
                setCategoryId(e.target.value ? Number(e.target.value) : undefined);
              }}
              className="w-full sm:w-48 rounded-xl border-0 py-2.5 pl-10 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all cursor-pointer bg-white"
            >
              <option value="">{t.products.allCategories}</option>
              {categories?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Product Grid */}
      {!data?.items.length ? (
        <EmptyState
          title={t.products.noProducts}
          description={t.products.noProductsDesc}
          icon={<ShoppingBag className="w-12 h-12 text-slate-300" />}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.items.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
              />
            ))}
          </div>
          <PaginationBar
            page={data.page}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
