import { useParams, Link } from 'react-router-dom';
import { useMyOrderQuery } from '../hooks/useOrders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { orderStatusLabelMap, paymentMethodLabelMap, PaymentMethod } from '../../../shared/types/orders';
import { ChevronLeft, Package, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';

export function CustomerOrderDetailsPage() {
  const { orderId } = useParams();
  const id = Number(orderId);
  const { data: order, isLoading, error } = useMyOrderQuery(id);

  if (isLoading) return <LoadingBlock />;
  if (error || !order) return <ErrorState message={error ? getApiErrorMessage(error) : 'Order not found'} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/me/orders" className="inline-flex items-center text-sm text-primary-600 hover:underline">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to orders
      </Link>

      <PageHeader 
        title={`Order #${order.orderId}`} 
        action={
          order.paymentMethod === PaymentMethod.CARD ? (
            <Link to={`/me/orders/${order.orderId}/payment`} className="inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 text-xs">
              View Payment
            </Link>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-900">
                <Package className="w-5 h-5 text-primary-600" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="divide-y divide-slate-100">
                {order.items.map(item => (
                  <li key={item.orderItemId} className="py-4 flex justify-between items-center group">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">Product #{item.productId}</span>
                      <span className="text-sm text-slate-500 mt-1">Quantity: {item.quantity}</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <PriceText amount={item.lineTotal} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-primary-900">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              
              <div className="pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 shrink-0">
                    {order.status === 0 ? <Clock className="w-4 h-4" /> : order.status === 1 ? <Package className="w-4 h-4" /> : order.status === 2 ? <Truck className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 leading-tight">{orderStatusLabelMap[order.status]}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Current order status</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-wide">Payment Method</span>
                <span className="font-bold text-slate-900">{paymentMethodLabelMap[order.paymentMethod]}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-wide">Order Date</span>
                <span className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
              </div>

              <div className="pt-5 mt-2 border-t border-slate-100 flex justify-between items-baseline bg-slate-50 p-4 rounded-xl">
                <span className="text-base font-bold text-slate-700">Total Amount</span>
                <span className="text-2xl font-black text-primary-600 drop-shadow-sm"><PriceText amount={order.totalAmount} /></span>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card className="shadow-sm border border-yellow-200 bg-yellow-50/30">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Notes
                </h3>
                <p className="text-sm text-yellow-900/80 leading-relaxed font-medium">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
