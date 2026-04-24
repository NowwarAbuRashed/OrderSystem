import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useManagerOrdersQuery } from '../hooks/useManagerOrders';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { PriceText } from '../../../shared/components/PriceText';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { Card } from '../../../shared/components/Card';
import { orderStatusLabelMap, paymentMethodLabelMap, OrderStatus } from '../../../shared/types/orders';
import { formatDate } from '../../../shared/utils/date';
import { Eye } from 'lucide-react';

type OrderListItem = NonNullable<ReturnType<typeof useManagerOrdersQuery>['data']>['items'][0];

function getOrderStatusVariant(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PROCESSING: return 'warning' as const;
    case OrderStatus.READY: return 'info' as const;
    case OrderStatus.OUT_FOR_DELIVERY: return 'default' as const;
    case OrderStatus.DELIVERED: return 'success' as const;
    default: return 'default' as const;
  }
}

export function ManagerOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useManagerOrdersQuery({ page, pageSize: 12 });
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
      header: t.orders.paymentMethod,
      accessor: (row) => paymentMethodLabelMap[row.paymentMethod],
    },
    {
      header: t.orders.orderTotal,
      accessor: (row) => <span className="font-bold"><PriceText amount={row.totalAmount} /></span>,
    },
    {
      header: t.orders.orderStatus,
      accessor: (row) => (
        <StatusBadge
          label={orderStatusLabelMap[row.status]}
          variant={getOrderStatusVariant(row.status)}
        />
      ),
    },
    {
      header: '',
      accessor: (row) => (
        <Link to={`/manager/orders/${row.orderId}`} className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-medium text-sm">
          <Eye className="w-4 h-4" /> {t.actions.viewDetails}
        </Link>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t.manager.orders} description={t.manager.ordersDesc} />
      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={data?.items || []}
          isLoading={isLoading}
          emptyMessage={t.orders.noOrders}
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
