import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrdersQuery } from '../hooks/useOrders';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { Card } from '../../../shared/components/Card';
import { PriceText } from '../../../shared/components/PriceText';
import { EmptyState } from '../../../shared/components/EmptyState';
import { orderStatusLabelMap, paymentMethodLabelMap } from '../../../shared/types/orders';
import { formatDate } from '../../../shared/utils/date';
import { Package, Eye } from 'lucide-react';

type OrderListItem = NonNullable<ReturnType<typeof useMyOrdersQuery>['data']>['items'][0];

export function CustomerOrdersListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrdersQuery({ page, pageSize: 12 });
  const { t } = useI18n();

  const columns: Column<OrderListItem>[] = [
    {
      header: t.orders.orderId,
      accessor: (row) => <span className="font-semibold text-primary-700">#{row.orderId}</span>,
    },
    {
      header: t.orders.orderDate,
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      header: t.orders.orderStatus,
      accessor: (row) => <StatusBadge label={orderStatusLabelMap[row.status]} variant={row.status === 0 ? 'warning' : row.status === 1 ? 'info' : row.status === 2 ? 'success' : 'default'} />,
    },
    {
      header: t.orders.orderTotal,
      accessor: (row) => <span className="font-bold"><PriceText amount={row.totalAmount} /></span>,
    },
    {
      header: t.orders.paymentMethod,
      accessor: (row) => paymentMethodLabelMap[row.paymentMethod],
    },
    {
      header: '',
      accessor: (row) => (
        <Link to={`/me/orders/${row.orderId}`} className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors">
          <Eye className="w-4 h-4" /> {t.actions.viewDetails}
        </Link>
      ),
    }
  ];

  if (!isLoading && (!data || data.items.length === 0)) {
    return (
      <div className="space-y-6">
        <PageHeader title={t.orders.title} />
        <EmptyState
          title={t.orders.noOrders}
          description={t.orders.noOrdersDesc}
          icon={<Package className="w-12 h-12 text-slate-300" />}
          action={<Link to="/products" className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors">{t.actions.goShopping}</Link>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t.orders.title} />
      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={data?.items || []}
          isLoading={isLoading}
          emptyMessage={t.orders.noOrdersDesc}
        />
      </Card>
      {data && data.totalCount > 0 && (
        <PaginationBar
          page={data.page}
          pageSize={data.pageSize}
          totalCount={data.totalCount}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
