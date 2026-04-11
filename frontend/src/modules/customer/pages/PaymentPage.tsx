import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useMyOrderPaymentQuery, usePayByCard } from '../hooks/useOrders';
import { PaymentStatus, PaymentMethod } from '../../../shared/types/orders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { ErrorState } from '../../../shared/components/ErrorState';
import { PriceText } from '../../../shared/components/PriceText';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';

const paymentSchema = z.object({
  cardHolderName: z.string().min(2, 'Name is required'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits').regex(/^\d+$/, 'Numbers only'),
  expiryMonth: z.coerce.number().min(1).max(12),
  expiryYear: z.coerce.number().min(new Date().getFullYear()),
  cvv: z.string().length(3, 'CVV must be 3 digits').regex(/^\d+$/, 'Numbers only'),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const id = Number(orderId);

  const { data: paymentInfo, isLoading, error } = useMyOrderPaymentQuery(id);
  const { mutate: pay, isPending: isPaying, error: payError } = usePayByCard();

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema) as any,
  });

  if (isLoading) return <LoadingBlock />;
  if (error || !paymentInfo) return <ErrorState message={error ? getApiErrorMessage(error) : 'Payment info not found'} />;

  if (paymentInfo.status === PaymentStatus.PAID) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 mt-10 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
        <p className="text-slate-500">Your payment of <PriceText amount={paymentInfo.amount} /> has been processed.</p>
        <button
          onClick={() => navigate(`/me/orders/${id}`)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          View Order Details
        </button>
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
      <PageHeader title="Pay by Card" />

      {payError && <ErrorState message={getApiErrorMessage(payError)} />}

      <div className="bg-slate-50 p-6 rounded-lg mb-6 border border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Amount Due</span>
          <span className="text-2xl font-bold text-slate-900"><PriceText amount={paymentInfo.amount} /></span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div>
          <label className="block text-sm font-medium leading-6 text-slate-900">Cardholder Name</label>
          <div className="mt-2">
            <input
              {...register('cardHolderName')}
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
            {errors.cardHolderName && <p className="mt-1 text-sm text-red-600">{errors.cardHolderName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-slate-900">Card Number</label>
          <div className="mt-2">
            <input
              {...register('cardNumber')}
              type="text"
              maxLength={16}
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
            {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Month</label>
            <div className="mt-2">
              <input
                {...register('expiryMonth')}
                type="number"
                min={1}
                max={12}
                placeholder="MM"
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
              {errors.expiryMonth && <p className="mt-1 text-sm text-red-600">{errors.expiryMonth.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Year</label>
            <div className="mt-2">
              <input
                {...register('expiryYear')}
                type="number"
                min={new Date().getFullYear()}
                placeholder="YYYY"
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
              {errors.expiryYear && <p className="mt-1 text-sm text-red-600">{errors.expiryYear.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">CVV</label>
            <div className="mt-2">
              <input
                {...register('cvv')}
                type="text"
                maxLength={3}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
              {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isPaying}
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {isPaying ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
