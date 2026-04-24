import { Link, useNavigate } from 'react-router-dom';
import { useCartQuery, useUpdateCartItem, useDeleteCartItem, useClearCart } from '../hooks/useCart';
import { useI18n } from '../../../app/i18n/i18n-context';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { PageHeader } from '../../../shared/components/PageHeader';
import { QuantityStepper } from '../../../shared/components/QuantityStepper';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { ImageFallback } from '../../../shared/components/ImageFallback';
import { useProductQuery } from '../../catalog/hooks/useCatalog';
import { CartItem } from '../../../shared/types/cart';
import { useState } from 'react';

function CartItemRow({ item, updateItem, deleteItem, t }: { item: CartItem; updateItem: any; deleteItem: any; t: any }) {
  const { data: product } = useProductQuery(item.productId);
  const maxAvailable = product ? product.quantity : 999;

  return (
    <li className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
      <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-400">
        {product?.images?.[0]?.imageUrl ? (
          <ImageFallback src={product.images[0].imageUrl} alt={item.productName} className="w-full h-full object-cover" />
        ) : (
          <ShoppingBag className="w-6 h-6 opacity-50" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.productId}`} className="text-base font-semibold text-slate-900 hover:text-primary-600 transition-colors truncate block">
          {item.productName}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-slate-500 font-medium text-sm"><PriceText amount={item.unitPrice} /></span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 text-xs">
            {product && product.quantity === 0 ? t.products.outOfStock : t.products.inStock}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <QuantityStepper
          value={item.quantity}
          onChange={(val) => {
            if (val !== item.quantity) {
              updateItem({ itemId: item.id, quantity: val });
            }
          }}
          min={1}
          max={maxAvailable}
          size="sm"
        />
        <div className="text-base font-bold text-slate-900 w-24 text-right tabular-nums">
          <PriceText amount={item.lineTotal} />
        </div>
        <button
          onClick={() => deleteItem(item.id)}
          className="text-slate-400 hover:text-danger-600 p-2 rounded-xl hover:bg-danger-50 transition-colors flex-shrink-0"
          title={t.cart.removeItem}
        >
          <Trash2 className="w-4 h-4" />
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
  const { t } = useI18n();

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message={getApiErrorMessage(error)} />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <EmptyState
        title={t.cart.empty}
        description={t.cart.emptyDesc}
        icon={<ShoppingBag className="w-12 h-12 text-slate-300" />}
        action={<Link to="/products" className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors">{t.actions.goShopping}</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.cart.title}
        action={
          <button onClick={() => setIsClearConfirmOpen(true)} className="text-sm font-medium text-danger-600 hover:text-danger-700 flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> {t.actions.clearCart}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {cart.items.map(item => (
              <CartItemRow key={item.id} item={item} updateItem={updateItem} deleteItem={deleteItem} t={t} />
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <Card className="rounded-2xl shadow-xl border-slate-200/60">
            <CardContent className="p-6 sm:p-8 flex flex-col gap-5">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">{t.cart.orderSummary}</h2>

              <div className="flex flex-col gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>{t.cart.subtotal} ({cart.items.length} {t.cart.items})</span>
                  <span className="font-medium text-slate-900"><PriceText amount={cart.subtotal} /></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.cart.shipping}</span>
                  <span className="font-medium text-slate-900">{t.cart.shippingEstimate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.cart.taxEstimate}</span>
                  <span className="font-medium text-slate-900">{t.cart.taxCalc}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-base font-bold text-slate-900">{t.cart.estimatedTotal}</span>
                  <span className="text-2xl font-extrabold text-primary-600"><PriceText amount={cart.subtotal} /></span>
                </div>

                <Button
                  onClick={() => navigate('/me/checkout')}
                  className="w-full text-base py-4 shadow-md shadow-primary-600/20 rounded-xl"
                  size="lg"
                >
                  {t.actions.proceedToCheckout} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <div className="mt-4 flex justify-center">
                  <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center">
                    {t.actions.continueShopping}
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
        title={t.cart.clearConfirmTitle}
        description={t.cart.clearConfirmDesc}
        confirmText={t.cart.clearConfirmAction}
        isDestructive
        isLoading={isClearing}
      />
    </div>
  );
}
