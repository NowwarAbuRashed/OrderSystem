import { useParams, Link } from 'react-router-dom';
import { useMyOrderQuery } from '../hooks/useOrders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { orderStatusLabelMap, paymentMethodLabelMap, PaymentMethod } from '../../../shared/types/orders';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { ChevronLeft } from 'lucide-react';

export function CustomerOrderDetailsPage() {
  const { orderId } = useParams();
  const id = Number(orderId);
  const { data: order, isLoading, error } = useMyOrderQuery(id);

  if (isLoading) return <LoadingBlock />;
  if (error || !order) return <ErrorState message={error ? getApiErrorMessage(error) : 'Order not found'} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/me/orders" className="inline-flex items-center text-sm text-blue-600 hover:underline">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to orders
      </Link>

      <PageHeader 
        title={`Order #${order.orderId}`} 
        action={
          order.paymentMethod === PaymentMethod.CARD ? (
            <Link to={`/me/orders/${order.orderId}/payment`} className="rounded-md bg-white border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              View Payment Status
            </Link>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Items</h3>
            <ul className="divide-y divide-slate-200">
              {order.items.map(item => (
                <li key={item.orderItemId} className="py-3 flex justify-between">
                  <div>
                    <span className="font-medium text-slate-900">Product #{item.productId}</span>
                    <span className="text-slate-500 ml-2">x {item.quantity}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    <PriceText amount={item.lineTotal} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-medium text-slate-900 mb-2">Summary</h3>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <StatusBadge 
                label={orderStatusLabelMap[order.status]} 
                variant={order.status === 0 ? 'warning' : order.status === 1 ? 'info' : order.status === 2 ? 'success' : 'default'} 
              />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Payment</span>
              <span className="font-medium text-slate-900">{paymentMethodLabelMap[order.paymentMethod]}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Placed on</span>
              <span className="font-medium text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-medium text-slate-900">Total</span>
              <span className="text-xl font-bold text-slate-900"><PriceText amount={order.totalAmount} /></span>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Notes</h3>
              <p className="text-sm text-slate-500">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
