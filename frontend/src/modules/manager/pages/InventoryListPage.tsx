import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useManagerProductsQuery } from '../hooks/useManagerProducts';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { StatusBadge } from '../../../shared/components/StatusBadge';

type ProductListItem = NonNullable<ReturnType<typeof useManagerProductsQuery>['data']>['items'][0];

export function ManagerInventoryListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useManagerProductsQuery({ page, pageSize: 12, search });

  const columns: Column<ProductListItem>[] = [
    {
      header: 'ID',
      accessor: (row) => row.id,
    },
    {
      header: 'Name',
      accessor: (row) => row.name,
    },
    {
      header: 'Stock',
      accessor: (row) => (
        <span className={row.quantity <= row.minQuantity ? 'text-red-600 font-bold' : ''}>
          {row.quantity}
        </span>
      ),
    },
    {
      header: 'Min Qty',
      accessor: (row) => row.minQuantity,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge label={row.status} variant={row.status === 'ACTIVE' ? 'success' : 'default'} />,
    },
    {
      header: 'Actions',
      accessor: (row) => <Link to={`/manager/inventory/${row.id}`} className="text-blue-600 hover:text-blue-800 font-medium">Manage Stock</Link>,
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" />
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="block w-full max-w-sm rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      </div>

      <AppTable
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        emptyMessage="No products found."
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
