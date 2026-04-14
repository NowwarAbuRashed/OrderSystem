import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useMyOrderPaymentQuery, usePayByCard } from '../hooks/useOrders';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PaymentStatus, PaymentMethod } from '../../../shared/types/orders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { ErrorState } from '../../../shared/components/ErrorState';
import { PriceText } from '../../../shared/components/PriceText';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Card, CardContent } from '../../../shared/components/Card';
import { CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const id = Number(orderId);
  const { t } = useI18n();

  const currentYear = new Date().getFullYear();

  const paymentSchema = useMemo(() => z.object({
    cardHolderName: z.string().trim()
      .min(2, t.validation?.minLength?.replace('{{min}}', '2') as string),
    cardNumber: z.string()
      .length(16, t.validation?.exactLength?.replace('{{length}}', '16') as string)
      .regex(/^\d+$/, t.validation?.numbersOnly as string),
    expiryMonth: z.number({ message: t.validation?.required as string })
      .min(1, t.validation?.minNumber?.replace('{{min}}', '1') as string)
      .max(12, t.validation?.maxNumber?.replace('{{max}}', '12') as string),
    expiryYear: z.number({ message: t.validation?.required as string })
      .min(currentYear, t.validation?.minNumber?.replace('{{min}}', String(currentYear)) as string),
    cvv: z.string()
      .length(3, t.validation?.exactLength?.replace('{{length}}', '3') as string)
      .regex(/^\d+$/, t.validation?.numbersOnly as string),
  }).superRefine((data, ctx) => {
    const currentMonth = new Date().getMonth() + 1;
    if (data.expiryYear === currentYear && data.expiryMonth < currentMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation?.cardExpired as string,
        path: ['expiryMonth']
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation?.cardExpired as string,
        path: ['expiryYear']
      });
    }
  }), [t, currentYear]);

  type PaymentForm = z.infer<typeof paymentSchema>;

  const { data: paymentInfo, isLoading, error } = useMyOrderPaymentQuery(id);
  const { mutate: pay, isPending: isPaying, error: payError } = usePayByCard();

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
  });

  if (isNaN(id)) return <ErrorState message="Invalid order reference" />;
  if (isLoading) return <LoadingBlock />;
  if (error || !paymentInfo) return <ErrorState message={error ? getApiErrorMessage(error) : 'Payment info not found'} />;

  if (paymentInfo.status === PaymentStatus.PAID) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 mt-10 p-8 bg-white rounded-2xl shadow-xl border border-slate-200/60">
        <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
        <p className="text-slate-500">Your payment of <PriceText amount={paymentInfo.amount} /> has been processed.</p>
        <Button
          onClick={() => navigate(`/me/orders/${id}`)}
          className="rounded-xl"
        >
          {t.actions.viewDetails}
        </Button>
      </div>
    );
  }

  if (paymentInfo.paymentMethod !== PaymentMethod.CARD) {
    return <ErrorState message="This order is not configured for Card payment." />;
  }

  const onSubmit = (data: PaymentForm) => {
    pay({ orderId: id, ...data });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <PageHeader title={t.payment.securePayment} />

      {payError && <ErrorState message={getApiErrorMessage(payError)} />}

      {/* Amount Due */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 rounded-2xl border border-primary-200/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-xl">
              <CreditCard className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-primary-700">{t.payment.orderRecap}</span>
          </div>
          <span className="text-2xl font-bold text-primary-700"><PriceText amount={paymentInfo.amount} /></span>
        </div>
      </div>

      {/* Payment Form */}
      <Card className="rounded-2xl shadow-xl border-slate-200/60">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t.payment.cardHolderName}
              type="text"
              placeholder="John Doe"
              {...register('cardHolderName')}
              error={errors.cardHolderName?.message}
            />

            <Input
              label={t.payment.cardNumber}
              type="text"
              maxLength={16}
              placeholder="1234 5678 9012 3456"
              {...register('cardNumber')}
              error={errors.cardNumber?.message}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label={t.payment.expiryMonth}
                type="number"
                min={1}
                max={12}
                placeholder="MM"
                {...register('expiryMonth', { valueAsNumber: true })}
                error={errors.expiryMonth?.message}
              />
              <Input
                label={t.payment.expiryYear}
                type="number"
                min={new Date().getFullYear()}
                placeholder="YYYY"
                {...register('expiryYear', { valueAsNumber: true })}
                error={errors.expiryYear?.message}
              />
              <Input
                label={t.payment.cvv}
                type="text"
                maxLength={3}
                placeholder="123"
                {...register('cvv')}
                error={errors.cvv?.message}
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                disabled={isPaying}
                isLoading={isPaying}
                className="w-full py-4 text-base rounded-xl shadow-md shadow-primary-600/20"
                size="lg"
              >
                {isPaying ? 'Processing...' : t.actions.payNow}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Trust bar */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4" />
        <span>256-bit SSL encryption • Your card details are secure</span>
      </div>
    </div>
  );
}
