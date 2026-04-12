import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrdersQuery } from '../hooks/useOrders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { Card } from '../../../shared/components/Card';
import { PriceText } from '../../../shared/components/PriceText';
import { orderStatusLabelMap, paymentMethodLabelMap } from '../../../shared/types/orders';

type OrderListItem = NonNullable<ReturnType<typeof useMyOrdersQuery>['data']>['items'][0];

export function CustomerOrdersListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrdersQuery({ page, pageSize: 12 });

  const columns: Column<OrderListItem>[] = [
    {
      header: 'Order ID',
      accessor: (row) => `#${row.orderId}`,
    },
    {
      header: 'Date',
      accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge label={orderStatusLabelMap[row.status]} variant={row.status === 0 ? 'warning' : row.status === 1 ? 'info' : row.status === 2 ? 'success' : 'default'} />,
    },
    {
      header: 'Total',
      accessor: (row) => <PriceText amount={row.totalAmount} />,
    },
    {
      header: 'Payment',
      accessor: (row) => paymentMethodLabelMap[row.paymentMethod],
    },
    {
      header: 'Actions',
      accessor: (row) => <Link to={`/me/orders/${row.orderId}`} className="text-primary-600 hover:text-primary-800 font-medium">View</Link>,
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Orders" />
      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={data?.items || []}
          isLoading={isLoading}
          emptyMessage="You haven't placed any orders yet."
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
