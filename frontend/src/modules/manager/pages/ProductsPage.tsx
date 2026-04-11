import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useManagerProductsQuery } from '../hooks/useManagerProducts';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { PriceText } from '../../../shared/components/PriceText';

type ProductListItem = NonNullable<ReturnType<typeof useManagerProductsQuery>['data']>['items'][0];

export function ManagerProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useManagerProductsQuery({ page, pageSize: 12, search });

  const columns: Column<ProductListItem>[] = [
    {
      header: 'ID',
      accessor: (row) => row.id,
    },
    {
      header: 'Image',
      accessor: (row) => row.images?.[0] ? (
        <img src={row.images[0].imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
      ) : (
        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">None</div>
      ),
    },
    {
      header: 'Name',
      accessor: (row) => row.name,
    },
    {
      header: 'Price',
      accessor: (row) => <PriceText amount={row.price} />,
    },
    {
      header: 'Stock',
      accessor: (row) => row.quantity,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge label={row.status} variant={row.status === 'ACTIVE' ? 'success' : 'default'} />,
    },
    {
      header: 'Actions',
      accessor: (row) => <Link to={`/manager/products/${row.id}`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>,
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Products" 
        action={
          <Link to="/manager/products/new" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
            Add Product
          </Link>
        }
      />
      
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
