import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductsQuery, useCategoriesQuery } from '../hooks/useCatalog';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { EmptyState } from '../../../shared/components/EmptyState';
import { PriceText } from '../../../shared/components/PriceText';

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <select
            value={categoryId || ''}
            onChange={(e) => {
              setCategoryId(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            className="rounded-md border-0 py-1.5 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Categories</option>
            {categories?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </form>
      </div>

      {!data?.items.length ? (
        <EmptyState title="No products found" description="We couldn't find any products matching your criteria." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.items.map((prod) => (
              <div key={prod.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="h-48 bg-slate-100 flex items-center justify-center p-4">
                  {prod.images?.[0] ? (
                    <img src={prod.images[0].imageUrl} alt={prod.name} className="max-h-full object-contain" />
                  ) : (
                    <span className="text-slate-400">No image</span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-slate-900 truncate" title={prod.name}>{prod.name}</h3>
                  <div className="mt-1 flex items-center justify-between">
                    <PriceText amount={prod.price} />
                    {prod.quantity === 0 && <span className="text-xs text-red-600 font-medium">Out of stock</span>}
                    {prod.quantity > 0 && prod.quantity <= prod.minQuantity && <span className="text-xs text-yellow-600 font-medium">Low stock</span>}
                  </div>
                  <Link 
                    to={`/products/${prod.id}`}
                    className="mt-4 w-full block text-center rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
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
