import { useParams, Link } from 'react-router-dom';
import { useMyOrderQuery } from '../hooks/useOrders';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { DetailList } from '../../../shared/components/DetailList';
import { orderStatusLabelMap, paymentMethodLabelMap, PaymentMethod } from '../../../shared/types/orders';
import { ChevronLeft, Package, Clock, Truck, CheckCircle2, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { useProductQuery } from '../../catalog/hooks/useCatalog';
import { Button } from '../../../shared/components/Button';

function OrderItemRow({ item }: { item: any }) {
  const { data: product } = useProductQuery(item.productId);
  const productName = product ? product.name : `Product #${item.productId}`;

  return (
    <li className="py-4 flex justify-between items-center">
      <div className="flex flex-col">
        <Link to={`/products/${item.productId}`} className="font-semibold text-slate-900 hover:text-primary-600 transition-colors">
          {productName}
        </Link>
        <span className="text-sm text-slate-500 mt-0.5">Qty: {item.quantity}</span>
      </div>
      <div className="text-sm font-bold text-slate-900">
        <PriceText amount={item.lineTotal} />
      </div>
    </li>
  );
}

export function CustomerOrderDetailsPage() {
  const { orderId } = useParams();
  const id = Number(orderId);
  const { data: order, isLoading, error } = useMyOrderQuery(id);
  const { t } = useI18n();

  if (isNaN(id)) return <ErrorState message="Invalid order reference" />;
  if (isLoading) return <LoadingBlock />;
  if (error || !order) return <ErrorState message={error ? getApiErrorMessage(error) : 'Order not found'} />;

  const statusSteps = [
    { key: 0, label: t.orders.processing, icon: Clock },
    { key: 1, label: t.orders.ready, icon: Package },
    { key: 2, label: t.orders.outForDelivery, icon: Truck },
    { key: 3, label: t.orders.delivered, icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/me/orders" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">
        <ChevronLeft className="w-4 h-4 mr-1" /> {t.orders.title}
      </Link>

      <PageHeader
        title={`${t.orders.orderId} #${order.orderId}`}
        action={
          order.paymentMethod === PaymentMethod.CARD ? (
            <Link to={`/me/orders/${order.orderId}/payment`}>
              <Button variant="outline" size="sm" className="rounded-xl">
                <CreditCard className="w-4 h-4 mr-1.5" />
                {t.orders.payNow}
              </Button>
            </Link>
          ) : undefined
        }
      />

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">{t.orders.timeline}</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary-500 z-0 transition-all"
            style={{ width: `${(order.status / 3) * 100}%` }}
          />
          {statusSteps.map((step) => {
            const Icon = step.icon;
            const isCompleted = order.status >= step.key;
            const isCurrent = order.status === step.key;
            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-primary-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200/60 rounded-2xl">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" />
                {t.orders.items}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="divide-y divide-slate-100">
                {order.items.map((item: any) => (
                  <OrderItemRow key={item.orderItemId} item={item} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200/60 rounded-2xl">
            <CardContent className="p-5">
              <DetailList items={[
                { label: t.orders.orderStatus, value: <span className="text-primary-600 font-bold">{orderStatusLabelMap[order.status]}</span> },
                { label: t.orders.paymentMethod, value: paymentMethodLabelMap[order.paymentMethod] },
                { label: t.orders.orderDate, value: new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) },
              ]} />
              <div className="mt-4 bg-primary-50 p-4 rounded-xl border border-primary-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-primary-800">{t.cart.total}</span>
                <span className="text-2xl font-extrabold text-primary-600"><PriceText amount={order.totalAmount} /></span>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card className="shadow-sm border border-warning-200 bg-warning-50/30 rounded-2xl">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-warning-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning-500"></span> {t.orders.notes}
                </h3>
                <p className="text-sm text-warning-900/80 leading-relaxed font-medium">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
