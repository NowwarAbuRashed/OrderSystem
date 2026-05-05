import { useState } from 'react';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { useManagerProductsQuery } from '../../manager/hooks/useManagerProducts';
import { useUpdateCatalogBulkStatusMutation, useUpdateCatalogBulkPriceMutation } from '../hooks/useAdmin';
import { Package, Search, CheckSquare, Percent, X } from 'lucide-react';
import { ImageFallback } from '../../../shared/components/ImageFallback';
import clsx from 'clsx';

export function AdminCatalogPage() {
  const { t } = useI18n();
  
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState<number>(0);

  const { data: result, isLoading } = useManagerProductsQuery({
    search: search || undefined,
    page: 1,
    pageSize: 100,
  });

  const products = result?.items || [];

  const updateStatusMutation = useUpdateCatalogBulkStatusMutation();
  const updatePriceMutation = useUpdateCatalogBulkPriceMutation();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(products.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newKeys = new Set(selectedIds);
    if (checked) newKeys.add(id);
    else newKeys.delete(id);
    setSelectedIds(newKeys);
  };

  const handleBulkStatusUpdate = (isActive: boolean) => {
    if (selectedIds.size === 0) return;
    updateStatusMutation.mutate({ productIds: Array.from(selectedIds), isActive }, {
      onSuccess: () => {
        alert(`Successfully updated ${selectedIds.size} products`);
        setSelectedIds(new Set());
      },
      onError: () => {
        alert('Failed to update products');
      }
    });
  };

  const handleBulkPriceUpdate = () => {
    if (selectedIds.size === 0) return;
    updatePriceMutation.mutate({ productIds: Array.from(selectedIds), percentageChange: priceAdjustment }, {
      onSuccess: () => {
        alert(`Successfully updated prices for ${selectedIds.size} products`);
        setSelectedIds(new Set());
        setIsPriceModalOpen(false);
      },
      onError: () => {
        alert('Failed to update prices');
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t.admin?.catalogOverview || 'Product Catalog Overview'} 
        description={t.admin?.catalogDesc || 'Manage products and perform bulk actions'} 
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.admin?.searchCatalog || 'Search products...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-neutral-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-primary-800 font-medium tracking-tight">
            <CheckSquare className="w-5 h-5" />
            <span>{selectedIds.size} products selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleBulkStatusUpdate(true)}
              className="px-4 py-2 bg-white text-emerald-600 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors shadow-sm"
              disabled={updateStatusMutation.isPending}
            >
              Set Active
            </button>
            <button 
              onClick={() => handleBulkStatusUpdate(false)}
              className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
              disabled={updateStatusMutation.isPending}
            >
              Set Inactive
            </button>
            <button 
              onClick={() => setIsPriceModalOpen(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm flex items-center space-x-2"
            >
              <Percent className="w-4 h-4 mr-1" /> Adjust Prices
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingBlock />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 font-medium w-10">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary-600 focus:ring-primary-500"
                      checked={products.length > 0 && selectedIds.size === products.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 font-medium">{t.admin.productName}</th>
                  <th className="px-6 py-4 font-medium">{t.common.price}</th>
                  <th className="px-6 py-4 font-medium">{t.admin.stock}</th>
                  <th className="px-6 py-4 font-medium">{t.common.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((product) => (
                  <tr key={product.id} className={clsx(
                    "transition-colors",
                    selectedIds.has(product.id) ? "bg-primary-50/50" : "hover:bg-neutral-50/50"
                  )}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary-600 focus:ring-primary-500"
                        checked={selectedIds.has(product.id)}
                        onChange={(e) => handleSelectOne(product.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 mr-3 flex-shrink-0 flex items-center justify-center overflow-hidden border border-neutral-200">
                           {product.images && product.images.length > 0 ? (
                              <ImageFallback src={product.images[0].imageUrl} alt="" className="w-full h-full object-cover" fallbackIconSize={16} />
                            ) : (
                              <Package className="w-5 h-5 text-neutral-400" />
                            )}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {product.quantity} / {product.minQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        product.status === 'ACTIVE' 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-red-50 text-red-700 border-red-100"
                      )}>
                        {product.status === 'ACTIVE' ? t.manager.active : t.manager.inactive}
                      </span>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      {t.products.noProducts}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Price Adjustment Modal */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">{t.admin?.adjustPrices || 'Adjust Prices'}</h3>
              <button 
                onClick={() => setIsPriceModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-600 mb-6">
                Adjust the price for {selectedIds.size} selected products by a percentage. Use a negative number to reduce prices.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Percentage Change (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={priceAdjustment}
                    onChange={(e) => setPriceAdjustment(parseFloat(e.target.value))}
                    className="w-full pl-4 pr-10 py-3 border border-neutral-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. 10 or -5"
                  />
                  <Percent className="w-5 h-5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Example: 10 increases price by 10%. -10 decreases it by 10%.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsPriceModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkPriceUpdate}
                  disabled={updatePriceMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {updatePriceMutation.isPending ? 'Updating...' : 'Apply Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
