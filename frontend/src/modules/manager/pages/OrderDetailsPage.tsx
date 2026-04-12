import { useParams, Link } from 'react-router-dom';
import { useManagerOrderQuery, useMarkOrderReady, useMarkOrderOutForDelivery, useMarkOrderDelivered } from '../hooks/useManagerOrders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { orderStatusLabelMap, paymentMethodLabelMap, OrderStatus } from '../../../shared/types/orders';
import { ChevronLeft, Package, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';

export function ManagerOrderDetailsPage() {
  const { orderId } = useParams();
  const id = Number(orderId);
  const { data: order, isLoading, error } = useManagerOrderQuery(id);
  const { mutate: markReady, isPending: isMarkingReady } = useMarkOrderReady();
  const { mutate: markOutForDelivery, isPending: isMarkingOfd } = useMarkOrderOutForDelivery();
  const { mutate: markDelivered, isPending: isMarkingDelivered } = useMarkOrderDelivered();

  const isUpdating = isMarkingReady || isMarkingOfd || isMarkingDelivered;

  if (isLoading) return <LoadingBlock />;
  if (error || !order) return <ErrorState message={error ? getApiErrorMessage(error) : 'Order not found'} />;

  const nextAction = () => {
    if (order.status === OrderStatus.PROCESSING) {
      return <Button size="sm" onClick={() => markReady(id)} disabled={isUpdating} isLoading={isMarkingReady}>Mark Ready</Button>;
    }
    if (order.status === OrderStatus.READY) {
      return <Button size="sm" onClick={() => markOutForDelivery(id)} disabled={isUpdating} isLoading={isMarkingOfd}>Mark Out for Delivery</Button>;
    }
    if (order.status === OrderStatus.OUT_FOR_DELIVERY) {
      return <Button size="sm" variant="primary" className="bg-green-600 hover:bg-green-500" onClick={() => markDelivered(id)} disabled={isUpdating} isLoading={isMarkingDelivered}>Mark Delivered</Button>;
    }
    return <span className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Delivered</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/manager/orders" className="inline-flex items-center text-sm text-primary-600 hover:underline">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to orders
      </Link>

      <PageHeader 
        title={`Order #${order.orderId}`} 
        action={nextAction()}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-900">
                <Package className="w-5 h-5 text-primary-600" />
                Items ({order.items.length})
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
                    <div className="flex flex-col items-end">
                      <div className="text-base font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <PriceText amount={item.lineTotal} />
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-medium">
                        <PriceText amount={item.unitPrice} /> each
                      </div>
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
              <CardTitle className="text-lg text-primary-900">Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 shrink-0">
                    {order.status === OrderStatus.PROCESSING ? <Clock className="w-4 h-4" /> : order.status === OrderStatus.READY ? <Package className="w-4 h-4" /> : order.status === OrderStatus.OUT_FOR_DELIVERY ? <Truck className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 leading-tight">{orderStatusLabelMap[order.status]}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Current order status</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-wide">Customer ID</span>
                <span className="font-bold text-slate-900">#{order.customerId}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-wide">Payment</span>
                <span className="font-bold text-slate-900">{paymentMethodLabelMap[order.paymentMethod]}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium tracking-wide">Order Date</span>
                <span className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
              </div>

              <div className="pt-5 mt-2 border-t border-slate-100 flex justify-between items-baseline bg-slate-50 p-4 rounded-xl">
                <span className="text-base font-bold text-slate-700">Total</span>
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

