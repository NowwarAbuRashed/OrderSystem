import { useState } from 'react';
import { useAdminOrdersQuery } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { StatCard } from '../../../shared/components/StatCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { Card } from '../../../shared/components/Card';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { ShoppingCart, Clock, Truck, CheckCircle2, Package, CreditCard, Banknote } from 'lucide-react';

type AdminOrder = {
  orderId: number;
  customerName: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
};

const statusVariantMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  PROCESSING: 'warning',
  READY: 'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
};

const paymentStatusVariantMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  PAID: 'success',
  PENDING: 'warning',
  FAILED: 'error',
};

export function AdminOrderOverviewPage() {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const params = {
    page: 1,
    pageSize: 50,
    ...(statusFilter ? { status: Number(statusFilter) } : {}),
  };
  const { data, isLoading, error } = useAdminOrdersQuery(params);

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load orders." />;

  const orders: AdminOrder[] = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const processing = orders.filter((o) => o.status === 'PROCESSING').length;
  const ready = orders.filter((o) => o.status === 'READY').length;
  const outForDelivery = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
  const delivered = orders.filter((o) => o.status === 'DELIVERED').length;

  const statusLabelMap: Record<string, string> = {
    PROCESSING: t.orders.processing,
    READY: t.orders.ready,
    OUT_FOR_DELIVERY: t.orders.outForDelivery,
    DELIVERED: t.orders.delivered,
  };

  const paymentStatusLabelMap: Record<string, string> = {
    PAID: t.orders.paid,
    PENDING: t.orders.pending,
    FAILED: t.orders.failed,
  };

  const columns: Column<AdminOrder>[] = [
    {
      header: t.admin.orderId,
      accessor: (row) => (
        <span className="font-semibold text-primary-700">#{row.orderId}</span>
      ),
    },
    {
      header: t.admin.customer,
      accessor: (row) => <span className="font-medium">{row.customerName}</span>,
    },
    {
      header: t.admin.amount,
      accessor: (row) => (
        <span className="font-semibold">${row.totalAmount.toFixed(2)}</span>
      ),
    },
    {
      header: t.admin.items,
      accessor: (row) => (
        <span className="text-sm text-slate-600">{row.itemCount} {t.common.items}</span>
      ),
    },
    {
      header: t.admin.statusLabel,
      accessor: (row) => (
        <StatusBadge
          label={statusLabelMap[row.status] || row.status}
          variant={statusVariantMap[row.status] || 'info'}
        />
      ),
    },
    {
      header: t.admin.paymentMethodLabel,
      accessor: (row) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          {row.paymentMethod === 'CASH' ? (
            <Banknote className="w-3.5 h-3.5 text-success-600" />
          ) : (
            <CreditCard className="w-3.5 h-3.5 text-primary-600" />
          )}
          {row.paymentMethod === 'CASH' ? t.orders.cash : t.orders.card}
        </span>
      ),
    },
    {
      header: t.payment.paymentStatus,
      accessor: (row) => (
        <StatusBadge
          label={paymentStatusLabelMap[row.paymentStatus] || row.paymentStatus}
          variant={paymentStatusVariantMap[row.paymentStatus] || 'info'}
        />
      ),
    },
    {
      header: t.admin.date,
      accessor: (row) => (
        <span className="text-sm text-slate-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={t.admin.orderOverview} description={t.admin.orderOverviewDesc} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={<ShoppingCart className="w-5 h-5" />} label={t.admin.totalOrders} value={totalCount} variant="default" />
        <StatCard icon={<Clock className="w-5 h-5" />} label={t.orders.processing} value={processing} variant="warning" />
        <StatCard icon={<Package className="w-5 h-5" />} label={t.orders.ready} value={ready} variant="info" />
        <StatCard icon={<Truck className="w-5 h-5" />} label={t.orders.outForDelivery} value={outForDelivery} variant="info" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label={t.orders.delivered} value={delivered} variant="success" />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-600">{t.admin.filterByStatus}:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t.common.all}</option>
          <option value="0">{t.orders.processing}</option>
          <option value="1">{t.orders.ready}</option>
          <option value="2">{t.orders.outForDelivery}</option>
          <option value="3">{t.orders.delivered}</option>
        </select>
      </div>

      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          keyField="orderId"
          emptyMessage={t.admin.noOrders}
        />
      </Card>
    </div>
  );
}
