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
import { Card, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Check, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const checkoutSchema = z.object({
  paymentMethod: z.coerce.number().pipe(z.nativeEnum(PaymentMethod)),
  notes: z.string().optional()
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { mutate: doCheckout, isPending, error } = useCheckout();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: { notes: '', paymentMethod: PaymentMethod.CASH }
  });
  
  const selectedPaymentMethod = watch('paymentMethod');

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="rounded-2xl border-slate-200/60 shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${selectedPaymentMethod === PaymentMethod.CASH ? 'border-primary-600 ring-1 ring-primary-600 bg-primary-50/10' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value={PaymentMethod.CASH}
                        className="sr-only"
                      />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Banknote className="w-5 h-5 text-green-600" /> Cash on Delivery
                          </span>
                          <span className="mt-1 flex items-center text-sm text-slate-500">Pay when order arrives.</span>
                        </span>
                      </span>
                    </label>

                    <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${selectedPaymentMethod === PaymentMethod.CARD ? 'border-primary-600 ring-1 ring-primary-600 bg-primary-50/10' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value={PaymentMethod.CARD}
                        className="sr-only"
                      />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <CreditCard className="w-5 h-5 text-blue-600" /> Credit Card
                          </span>
                          <span className="mt-1 flex items-center text-sm text-slate-500">Redirects to secure portal.</span>
                        </span>
                      </span>
                    </label>
                  </div>
                  {errors.paymentMethod && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><Check className="w-4 h-4"/> {errors.paymentMethod.message}</p>}
                </div>

                <div className="pt-6">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Order Notes (optional)</label>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="block w-full rounded-xl border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary-600 sm:text-sm px-4 bg-slate-50/50"
                    placeholder="E.g. Leave at door, or call on arrival"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="block lg:hidden">
              <Button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="w-full text-lg py-6"
                size="lg"
              >
                Place Order Securely
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-2xl shadow-xl border-slate-200/60 sticky top-8">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>
              </div>
              
              <ul className="divide-y divide-slate-100 mb-6">
                {cart.items.map(item => (
                  <li key={item.id} className="py-4 flex justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-900 truncate" title={item.productName}>{item.productName}</span>
                      <span className="text-slate-500 text-sm mt-1">Qty: {item.quantity}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                      <PriceText amount={item.lineTotal} />
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-3 mb-6 border border-slate-100">
                 <div className="flex justify-between text-slate-600 text-sm">
                   <span>Subtotal</span>
                   <span className="font-medium text-slate-900"><PriceText amount={cart.subtotal} /></span>
                 </div>
                 <div className="flex justify-between text-slate-600 text-sm">
                   <span>Shipping</span>
                   <span className="font-medium text-slate-900">Free</span>
                 </div>
                 <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                   <span className="text-base font-bold text-slate-900">Total</span>
                   <span className="text-2xl font-extrabold text-primary-600"><PriceText amount={cart.subtotal} /></span>
                 </div>
              </div>

              <div className="hidden lg:block">
                <Button
                  form="checkout-form"
                  type="submit"
                  disabled={isPending}
                  isLoading={isPending}
                  className="w-full py-6 text-lg shadow-md shadow-primary-600/20"
                  size="lg"
                >
                  Place Order Securely
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                  By placing your order, you agree to our Terms of Service and Privacy Policy. Secure payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
