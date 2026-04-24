import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useManagerProductsQuery } from '../hooks/useManagerProducts';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { TableToolbar } from '../../../shared/components/TableToolbar';
import { Card } from '../../../shared/components/Card';
import { Settings } from 'lucide-react';

type ProductListItem = NonNullable<ReturnType<typeof useManagerProductsQuery>['data']>['items'][0];

export function ManagerInventoryListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useManagerProductsQuery({ page, pageSize: 12, search });
  const { t } = useI18n();

  const columns: Column<ProductListItem>[] = [
    { header: t.manager.productName, accessor: (row) => <span className="font-medium">{row.name}</span> },
    {
      header: t.manager.productQuantity,
      accessor: (row) => (
        <span className={row.quantity <= row.minQuantity ? 'text-danger-600 font-bold' : 'font-semibold'}>
          {row.quantity}
        </span>
      ),
    },
    { header: t.manager.productMinQty, accessor: (row) => row.minQuantity },
    {
      header: t.common.status,
      accessor: (row) => {
        if (row.quantity === 0) return <StatusBadge label={t.products.outOfStock} variant="error" />;
        if (row.quantity <= row.minQuantity) return <StatusBadge label={t.products.lowStock} variant="warning" />;
        return <StatusBadge label={t.manager.active} variant="success" />;
      },
    },
    {
      header: '',
      accessor: (row) => (
        <Link to={`/manager/inventory/${row.id}`} className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-medium text-sm">
          <Settings className="w-3.5 h-3.5" /> {t.manager.manageInventory}
        </Link>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t.manager.inventory} description={t.manager.inventoryDesc} />

      <TableToolbar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder={t.products.searchPlaceholder}
      />

      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable columns={columns} data={data?.items || []} isLoading={isLoading} emptyMessage={t.products.noProducts} />
      </Card>
      {data && data.totalCount > 0 && (
        <PaginationBar page={data.page} pageSize={data.pageSize} totalCount={data.totalCount} onPageChange={setPage} />
      )}
    </div>
  );
}
