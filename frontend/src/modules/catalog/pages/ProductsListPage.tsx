import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductsQuery, useCategoriesQuery } from '../hooks/useCatalog';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { EmptyState } from '../../../shared/components/EmptyState';
import { PriceText } from '../../../shared/components/PriceText';
import { PageHeader } from '../../../shared/components/PageHeader';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { ImageOff, Search, Filter } from 'lucide-react';
import { ImageFallback } from '../../../shared/components/ImageFallback';
export function ProductsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const pageSize = 12;

  const { data, isLoading, error } = useProductsQuery({ page, pageSize, search, categoryId });
  const { data: categories } = useCategoriesQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); 
  };

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message={getApiErrorMessage(error)} />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/60 pb-6">
        <PageHeader 
          title="Products Catalog" 
          description="Browse our collection of high-quality products."
        />
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary-600 sm:text-sm transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={categoryId || ''}
              onChange={(e) => {
                setCategoryId(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="w-full sm:w-48 rounded-lg border-0 py-2.5 pl-10 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary-600 sm:text-sm transition-all cursor-pointer bg-white"
            >
              <option value="">All Categories</option>
              {categories?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {!data?.items.length ? (
        <EmptyState title="No products found" description="We couldn't find any products matching your criteria." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.items.map((prod) => (
              <Link 
                key={prod.id} 
                to={`/products/${prod.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/60 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-56 bg-slate-50 relative flex items-center justify-center p-6 border-b border-slate-100">
                  {prod.images?.[0] ? (
                    <ImageFallback 
                      src={prod.images[0].imageUrl} 
                      alt={prod.name} 
                      className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                      fallbackIconSize={48}
                    />
                  ) : (
                    <ImageOff className="w-12 h-12 text-slate-300" />
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 shadow-sm rounded-full">
                    {prod.quantity === 0 && <StatusBadge label="Out of Stock" variant="error" />}
                    {prod.quantity > 0 && prod.quantity <= prod.minQuantity && <StatusBadge label="Low Stock" variant="warning" />}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-slate-900 text-lg line-clamp-1 group-hover:text-primary-600 transition-colors" title={prod.name}>{prod.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 shadow-sm px-2 py-1 bg-white rounded-lg border border-slate-100">
                      <PriceText amount={prod.price} />
                    </span>
                    <span className="text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
                  </div>
                </div>
              </Link>
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
