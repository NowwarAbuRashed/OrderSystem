import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCartQuery } from '../../cart/hooks/useCart';
import { useCheckout } from '../hooks/useOrders';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PaymentMethod } from '../../../shared/types/orders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { ErrorState } from '../../../shared/components/ErrorState';
import { PriceText } from '../../../shared/components/PriceText';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { Card, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

import { useMemo } from 'react';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { mutate: doCheckout, isPending, error } = useCheckout();
  const { t } = useI18n();

  const checkoutSchema = useMemo(() => z.object({
    paymentMethod: z.nativeEnum(PaymentMethod, {
      message: t.validation?.required || 'Payment method is required'
    }),
    notes: z.string().optional()
  }), [t]);

  type CheckoutForm = z.infer<typeof checkoutSchema>;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { notes: '', paymentMethod: PaymentMethod.CASH }
  });

  const selectedPaymentMethod = watch('paymentMethod');

  if (isCartLoading) return <LoadingBlock />;
  if (!cart || !cart.items.length) {
    navigate('/me/cart');
    return null;
  }

  const onSubmit = (data: CheckoutForm) => {
    if (!cart || cart.items.length === 0) {
      navigate('/me/cart');
      return;
    }
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
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title={t.checkout.title} />

      {error && <ErrorState message={getApiErrorMessage(error)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="rounded-2xl border-slate-200/60 shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">{t.checkout.paymentMethod}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`relative flex cursor-pointer rounded-xl border-2 p-5 shadow-sm focus:outline-none transition-all ${selectedPaymentMethod === PaymentMethod.CASH ? 'border-primary-500 bg-primary-50/30 shadow-primary-100' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'}`}>
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value={PaymentMethod.CASH}
                        className="sr-only"
                      />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <div className="p-1.5 bg-success-50 rounded-lg"><Banknote className="w-5 h-5 text-success-600" /></div>
                            {t.checkout.cashOnDelivery}
                          </span>
                          <span className="mt-2 text-sm text-slate-500">{t.checkout.cashDesc}</span>
                        </span>
                      </span>
                    </label>

                    <label className={`relative flex cursor-pointer rounded-xl border-2 p-5 shadow-sm focus:outline-none transition-all ${selectedPaymentMethod === PaymentMethod.CARD ? 'border-primary-500 bg-primary-50/30 shadow-primary-100' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'}`}>
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value={PaymentMethod.CARD}
                        className="sr-only"
                      />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <div className="p-1.5 bg-info-50 rounded-lg"><CreditCard className="w-5 h-5 text-info-600" /></div>
                            {t.checkout.creditCard}
                          </span>
                          <span className="mt-2 text-sm text-slate-500">{t.checkout.cardDesc}</span>
                        </span>
                      </span>
                    </label>
                  </div>
                  {errors.paymentMethod && <p className="mt-2 text-sm text-danger-600">{errors.paymentMethod.message}</p>}
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-bold text-slate-900 mb-2">{t.checkout.orderNotes}</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="block w-full rounded-xl border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 bg-slate-50/50"
                    placeholder={t.checkout.notesPlaceholder}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="block lg:hidden">
              <Button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="w-full text-base py-4 rounded-xl"
                size="lg"
              >
                {t.actions.placeOrder}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-2xl shadow-xl border-slate-200/60 sticky top-24">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
                <ShieldCheck className="w-5 h-5 text-success-600" />
                <h3 className="text-lg font-bold text-slate-900">{t.cart.orderSummary}</h3>
              </div>

              <ul className="divide-y divide-slate-100 mb-5">
                {cart.items.map(item => (
                  <li key={item.id} className="py-3 flex justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm text-slate-900 truncate" title={item.productName}>{item.productName}</span>
                      <span className="text-slate-400 text-xs mt-0.5">{t.products.quantity}: {item.quantity}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                      <PriceText amount={item.lineTotal} />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3 mb-5 border border-slate-100">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-medium text-slate-900"><PriceText amount={cart.subtotal} /></span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>{t.cart.shipping}</span>
                  <span className="font-medium text-success-600">{t.cart.shippingFree}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">{t.cart.total}</span>
                  <span className="text-2xl font-extrabold text-primary-600"><PriceText amount={cart.subtotal} /></span>
                </div>
              </div>

              <div className="hidden lg:block">
                <Button
                  form="checkout-form"
                  type="submit"
                  disabled={isPending}
                  isLoading={isPending}
                  className="w-full py-4 text-base shadow-md shadow-primary-600/20 rounded-xl"
                  size="lg"
                >
                  {t.actions.placeOrder}
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                  {t.checkout.termsNotice}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
