import { Link, useNavigate } from 'react-router-dom';
import { useCartQuery, useUpdateCartItem, useDeleteCartItem, useClearCart } from '../hooks/useCart';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { useProductQuery } from '../../catalog/hooks/useCatalog';
import { CartItem } from '../../../shared/types/cart';
import { useState } from 'react';

function CartItemRow({ item, updateItem, deleteItem }: { item: CartItem, updateItem: any, deleteItem: any }) {
  const { data: product } = useProductQuery(item.productId);
  const maxAvailable = product ? product.quantity : 999;

  return (
    <li className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-slate-50 transition-colors">
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.productId}`} className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors truncate block">
          {item.productName}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-slate-500 font-medium"><PriceText amount={item.unitPrice} /></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 text-sm">
            {product ? `${product.quantity} in stock` : 'In stock'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6 sm:gap-8">
        <div className="w-24">
          <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity</label>
          <Input
            id={`qty-${item.id}`}
            type="number"
            min={1}
            max={maxAvailable}
            value={item.quantity}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val > maxAvailable) val = maxAvailable;
              if (val < 1) val = 1;
              if (val !== item.quantity) {
                 updateItem({ itemId: item.id, quantity: val });
              }
            }}
          />
        </div>
        <div className="text-lg font-bold text-slate-900 w-24 text-right">
          <PriceText amount={item.lineTotal} />
        </div>
        <button
          onClick={() => deleteItem(item.id)}
          className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors flex-shrink-0 flex items-center justify-center bg-white border border-slate-100 shadow-sm hover:border-red-200"
          title="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
}

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
        action={<Link to="/products" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors">Go Shopping</Link>}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {cart.items.map(item => (
              <CartItemRow key={item.id} item={item} updateItem={updateItem} deleteItem={deleteItem} />
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-1 lg:sticky lg:top-8">
          <Card className="rounded-2xl shadow-xl border-slate-200/60">
            <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Order Summary</h2>
              
              <div className="flex flex-col gap-4 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span className="font-medium text-slate-900"><PriceText amount={cart.subtotal} /></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping estimate</span>
                  <span className="font-medium text-slate-900">Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax estimate</span>
                  <span className="font-medium text-slate-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-bold text-slate-900">Estimated Total</span>
                  <span className="text-3xl font-extrabold text-primary-600"><PriceText amount={cart.subtotal} /></span>
                </div>
                
                <Button
                  onClick={() => navigate('/me/checkout')}
                  className="w-full text-lg py-6 shadow-md shadow-primary-600/20"
                  size="lg"
                >
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="mt-4 flex justify-center">
                  <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center">
                    or continue shopping
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
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
