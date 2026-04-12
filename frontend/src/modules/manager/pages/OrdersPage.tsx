import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useManagerOrdersQuery } from '../hooks/useManagerOrders';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { PriceText } from '../../../shared/components/PriceText';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { orderStatusLabelMap, paymentMethodLabelMap, OrderStatus } from '../../../shared/types/orders';

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
      header: 'Payment',
      accessor: (row) => paymentMethodLabelMap[row.paymentMethod],
    },
    {
      header: 'Total',
      accessor: (row) => <PriceText amount={row.totalAmount} />,
    },
    {
      header: 'Status',
      accessor: (row) => (
        <StatusBadge 
          label={orderStatusLabelMap[row.status]} 
          variant={getOrderStatusVariant(row.status)} 
        />
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => <Link to={`/manager/orders/${row.orderId}`} className="text-primary-600 hover:text-primary-800 font-medium">View</Link>,
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Orders" />
      <AppTable
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        emptyMessage="No orders found."
      />
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

