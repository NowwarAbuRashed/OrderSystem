import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCartQuery } from '../../cart/hooks/useCart';
import { useCheckout } from '../hooks/useOrders';
import { PaymentMethod } from '../../../shared/types/orders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { ErrorState } from '../../../shared/components/ErrorState';
import { PriceText } from '../../../shared/components/PriceText';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';

const checkoutSchema = z.object({
  paymentMethod: z.coerce.number().pipe(z.nativeEnum(PaymentMethod)),
  notes: z.string().optional()
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { mutate: doCheckout, isPending, error } = useCheckout();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: { notes: '', paymentMethod: PaymentMethod.CASH }
  });

  if (isCartLoading) return <LoadingBlock />;
  if (!cart || !cart.items.length) {
    navigate('/me/cart');
    return null;
  }

  const onSubmit = (data: CheckoutForm) => {
    doCheckout(data, {
      onSuccess: (res) => {
        if (data.paymentMethod === PaymentMethod.CARD) {
          navigate(`/me/orders/${res.orderId}/payment`);
        } else {
          navigate(`/me/orders/${res.orderId}`);
        }
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Checkout" />

      {error && <ErrorState message={getApiErrorMessage(error)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Order Notes (optional)</label>
              <div className="mt-2">
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                  placeholder="E.g. Leave at door"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Payment Method</label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-x-3">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value={PaymentMethod.CASH}
                    id="pm-cash"
                    className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="pm-cash" className="block text-sm font-medium leading-6 text-slate-900">Cash on Delivery</label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value={PaymentMethod.CARD}
                    id="pm-card"
                    className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="pm-card" className="block text-sm font-medium leading-6 text-slate-900">Credit Card</label>
                </div>
              </div>
              {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>}
            </div>

            <div className="pt-4 border-t border-slate-200 block md:hidden">
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
              >
                {isPending ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h3>
          <ul className="divide-y divide-slate-200">
            {cart.items.map(item => (
              <li key={item.id} className="py-3 flex justify-between">
                <div className="text-sm">
                  <span className="font-medium text-slate-900">{item.productName}</span>
                  <span className="text-slate-500 ml-2">x {item.quantity}</span>
                </div>
                <div className="text-sm font-medium text-slate-900">
                  <PriceText amount={item.lineTotal} />
                </div>
              </li>
            ))}
          </ul>
          <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-base font-medium text-slate-900">Total</span>
            <span className="text-xl font-bold text-slate-900"><PriceText amount={cart.subtotal} /></span>
          </div>

          <div className="mt-6 hidden md:block">
            <button
              form="checkout-form"
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
            >
              {isPending ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
