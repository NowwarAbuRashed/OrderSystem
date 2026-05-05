import { useAdminDashboardQuery } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { StatCard } from '../../../shared/components/StatCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { Card } from '../../../shared/components/Card';
import { AppTable, Column } from '../../../shared/components/AppTable';
import {
  ShoppingCart,
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { formatDate } from '../../../shared/utils/date';

type RecentOrder = {
  orderId: number;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
};

type DashboardData = {
  totalOrders: number;
  ordersToday: number;
  totalRevenue: number;
  revenueToday: number;
  totalCost: number;
  costToday: number;
  totalProfit: number;
  profitToday: number;
  totalUsers: number;
  newUsersToday: number;
  lowStockCount: number;
  outOfStockCount: number;
  ordersByStatus: Record<string, number>;
  revenueByPaymentMethod: Record<string, number>;
  recentOrders: RecentOrder[];
};

const statusVariantMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  PROCESSING: 'warning',
  READY: 'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
};

const statusLabelMap: Record<string, string> = {
  PROCESSING: 'Processing',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

export function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminDashboardQuery();
  const { t, locale } = useI18n();
  const dateLocale = locale === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US';

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load dashboard." />;
  if (!data) return null;

  const d = data as DashboardData;

  const recentOrderColumns: Column<RecentOrder>[] = [
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
      header: t.admin.date,
      accessor: (row) => (
        <span className="text-slate-500 text-sm">
          {formatDate(row.createdAt, undefined, dateLocale)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={t.admin.dashboard}
        description={t.admin.dashboardDesc}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<ShoppingCart className="w-5 h-5" />}
          label={t.admin.totalOrders}
          value={d.totalOrders}
          variant="default"
          trend={d.ordersToday > 0 ? 'up' : 'neutral'}
          trendLabel={`${d.ordersToday} ${t.admin.today}`}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label={t.admin.totalRevenue}
          value={`$${d.totalRevenue.toFixed(2)}`}
          variant="success"
          trend={d.revenueToday > 0 ? 'up' : 'neutral'}
          trendLabel={`$${d.revenueToday.toFixed(2)} ${t.admin.today}`}
        />
        <StatCard
          icon={<TrendingDown className="w-5 h-5" />}
          label={t.admin.totalCostOutgoing || 'Total Cost (Outgoing)'}
          value={`$${d.totalCost.toFixed(2)}`}
          variant="danger"
          trend={d.costToday > 0 ? 'down' : 'neutral'}
          trendLabel={`$${d.costToday.toFixed(2)} ${t.admin.today}`}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label={t.admin.netProfit || 'Net Profit'}
          value={`$${d.totalProfit.toFixed(2)}`}
          variant={d.totalProfit >= 0 ? 'success' : 'danger'}
          trend={d.profitToday > 0 ? 'up' : d.profitToday < 0 ? 'down' : 'neutral'}
          trendLabel={`$${d.profitToday.toFixed(2)} ${t.admin.today}`}
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label={t.admin.totalUsers}
          value={d.totalUsers}
          variant="info"
          trend={d.newUsersToday > 0 ? 'up' : 'neutral'}
          trendLabel={`${d.newUsersToday} ${t.admin.today}`}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label={t.admin.stockAlerts}
          value={d.lowStockCount + d.outOfStockCount}
          variant={d.outOfStockCount > 0 ? 'danger' : d.lowStockCount > 0 ? 'warning' : 'success'}
          trendLabel={`${d.outOfStockCount} ${t.products.outOfStock}`}
        />
      </div>

      {/* Orders by Status + Revenue by Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-2xl shadow-sm border-slate-200/60 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-600" />
            {t.admin.ordersByStatus}
          </h3>
          <div className="space-y-3">
            {Object.entries(d.ordersByStatus).map(([status, count]) => {
              const total = d.totalOrders || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-600">
                      {statusLabelMap[status] || status}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        status === 'DELIVERED'
                          ? 'bg-success-500'
                          : status === 'PROCESSING'
                          ? 'bg-warning-500'
                          : 'bg-primary-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(d.ordersByStatus).length === 0 && (
              <p className="text-sm text-slate-400">{t.admin.noDataYet}</p>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-200/60 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success-600" />
            {t.admin.revenueByMethod}
          </h3>
          <div className="space-y-4">
            {Object.entries(d.revenueByPaymentMethod).map(([method, amount]) => (
              <div
                key={method}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {method === 'CASH' ? (
                    <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                      <Banknote className="w-5 h-5 text-success-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                  <span className="font-medium text-slate-700">
                    {method === 'CASH' ? t.orders.cash : t.orders.card}
                  </span>
                </div>
                <span className="text-lg font-bold text-slate-900">
                  ${amount.toFixed(2)}
                </span>
              </div>
            ))}
            {Object.keys(d.revenueByPaymentMethod).length === 0 && (
              <p className="text-sm text-slate-400">{t.admin.noDataYet}</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-base font-semibold text-slate-900">{t.admin.recentOrders}</h3>
        </div>
        <AppTable
          columns={recentOrderColumns}
          data={d.recentOrders}
          isLoading={false}
          keyField="orderId"
          emptyMessage={t.admin.noDataYet}
        />
      </Card>
    </div>
  );
}
