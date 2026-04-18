import { useAdminRevenueQuery } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { StatCard } from '../../../shared/components/StatCard';
import { Card } from '../../../shared/components/Card';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { DollarSign, CheckCircle2, Clock, XCircle, CreditCard, Banknote, TrendingUp, Download } from 'lucide-react';
import { downloadCSV } from '../../../shared/utils/exportUtils';

type DailyRevenue = {
  date: string;
  amount: number;
  orderCount: number;
};

type RevenueData = {
  totalRevenue: number;
  revenuePaid: number;
  revenuePending: number;
  totalPayments: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  revenueByMethod: Record<string, number>;
  dailyRevenue: DailyRevenue[];
};

export function AdminRevenueReportPage() {
  const { t } = useI18n();
  const { data, isLoading, error } = useAdminRevenueQuery(30);

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load revenue report." />;
  if (!data) return null;

  const d = data as RevenueData;

  const dailyColumns: Column<DailyRevenue>[] = [
    {
      header: t.admin.date,
      accessor: (row) => (
        <span className="font-medium text-slate-900">
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: t.admin.ordersCount,
      accessor: (row) => (
        <span className="font-semibold text-primary-700">{row.orderCount}</span>
      ),
    },
    {
      header: t.admin.revenue,
      accessor: (row) => (
        <span className="font-bold text-success-700">${row.amount.toFixed(2)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader title={t.admin.revenueReport} description={t.admin.revenueReportDesc} />
        <button
          onClick={() => {
            const headers = ['Date', 'Orders', 'Revenue'];
            const rows = d.dailyRevenue.map((r: DailyRevenue) => [
              r.date,
              String(r.orderCount),
              r.amount.toFixed(2),
            ]);
            downloadCSV('revenue_report', headers, rows);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label={t.admin.totalRevenue}
          value={`$${d.totalRevenue.toFixed(2)}`}
          variant="success"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label={t.admin.paidPayments}
          value={d.paidCount}
          variant="success"
          trendLabel={`$${d.revenuePaid.toFixed(2)}`}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label={t.admin.pendingPayments}
          value={d.pendingCount}
          variant="warning"
          trendLabel={`$${d.revenuePending.toFixed(2)}`}
        />
        <StatCard
          icon={<XCircle className="w-5 h-5" />}
          label={t.admin.failedPayments}
          value={d.failedCount}
          variant="danger"
        />
      </div>

      {/* Revenue by Method */}
      <Card className="rounded-2xl shadow-sm border-slate-200/60 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary-600" />
          {t.admin.revenueByMethod}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(d.revenueByMethod).map(([method, amount]) => (
            <div
              key={method}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                {method === 'CASH' ? (
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-success-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-800">
                    {method === 'CASH' ? t.orders.cash : t.orders.card}
                  </p>
                  <p className="text-xs text-slate-500">{t.admin.paymentMethodLabel}</p>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900">${amount.toFixed(2)}</span>
            </div>
          ))}
          {Object.keys(d.revenueByMethod).length === 0 && (
            <p className="text-sm text-slate-400 col-span-2">{t.admin.noDataYet}</p>
          )}
        </div>
      </Card>

      {/* Payment Summary Bar */}
      <Card className="rounded-2xl shadow-sm border-slate-200/60 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">{t.admin.paymentSummary}</h3>
        <div className="flex rounded-full overflow-hidden h-4 bg-slate-100">
          {d.totalPayments > 0 && (
            <>
              <div
                className="bg-success-500 transition-all"
                style={{ width: `${(d.paidCount / d.totalPayments) * 100}%` }}
                title={`${t.orders.paid}: ${d.paidCount}`}
              />
              <div
                className="bg-warning-500 transition-all"
                style={{ width: `${(d.pendingCount / d.totalPayments) * 100}%` }}
                title={`${t.orders.pending}: ${d.pendingCount}`}
              />
              <div
                className="bg-danger-500 transition-all"
                style={{ width: `${(d.failedCount / d.totalPayments) * 100}%` }}
                title={`${t.orders.failed}: ${d.failedCount}`}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-6 mt-3">
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-success-500" /> {t.orders.paid} ({d.paidCount})
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-warning-500" /> {t.orders.pending} ({d.pendingCount})
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-danger-500" /> {t.orders.failed} ({d.failedCount})
          </span>
        </div>
      </Card>

      {/* Daily Revenue Table */}
      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-base font-semibold text-slate-900">{t.admin.dailyRevenue}</h3>
        </div>
        <AppTable
          columns={dailyColumns}
          data={d.dailyRevenue}
          isLoading={false}
          keyField="date"
          emptyMessage={t.admin.noDataYet}
        />
      </Card>
    </div>
  );
}
