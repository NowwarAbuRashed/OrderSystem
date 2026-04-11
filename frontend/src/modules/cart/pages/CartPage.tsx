import { Link, useNavigate } from 'react-router-dom';
import { useCartQuery, useUpdateCartItem, useDeleteCartItem, useClearCart } from '../hooks/useCart';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Trash2, ShoppingCart } from 'lucide-react';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { useState } from 'react';

export function CartPage() {
  const { data: cart, isLoading, error } = useCartQuery();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: deleteItem } = useDeleteCartItem();
  const { mutate: clear, isPending: isClearing } = useClearCart();
  const navigate = useNavigate();

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message={getApiErrorMessage(error)} />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added any products to your cart yet."
        action={<Link to="/products" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Go Shopping</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Shopping Cart" 
        action={
          <button onClick={() => setIsClearConfirmOpen(true)} className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {cart.items.map(item => (
            <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="text-sm font-medium text-blue-600 hover:underline truncate block">
                  {item.productName}
                </Link>
                <div className="mt-1 text-sm text-slate-500">
                  <PriceText amount={item.unitPrice} /> each
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity</label>
                  <input
                    id={`qty-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem({ itemId: item.id, quantity: Number(e.target.value) })}
                    className="block w-20 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
                <div className="text-sm font-medium text-slate-900 w-24 text-right">
                  <PriceText amount={item.lineTotal} />
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-slate-900">Subtotal:</span>
            <span className="text-2xl font-bold text-slate-900"><PriceText amount={cart.subtotal} /></span>
          </div>
          <button
            onClick={() => navigate('/me/checkout')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ShoppingCart className="w-4 h-4" /> Proceed to Checkout
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={() => {
          clear(undefined, { onSuccess: () => setIsClearConfirmOpen(false) });
        }}
        title="Clear Cart"
        description="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Clear completely"
        isDestructive
        isLoading={isClearing}
      />
    </div>
  );
}
