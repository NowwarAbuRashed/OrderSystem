import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useManagerProductsQuery } from '../hooks/useManagerProducts';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { PaginationBar } from '../../../shared/components/PaginationBar';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { PriceText } from '../../../shared/components/PriceText';
import { ImageFallback } from '../../../shared/components/ImageFallback';
import { TableToolbar } from '../../../shared/components/TableToolbar';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Plus, Pencil } from 'lucide-react';

type ProductListItem = NonNullable<ReturnType<typeof useManagerProductsQuery>['data']>['items'][0];

export function ManagerProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useManagerProductsQuery({ page, pageSize: 12, search });
  const { t } = useI18n();

  const columns: Column<ProductListItem>[] = [
    {
      header: '',
      accessor: (row) => row.images?.[0] ? (
        <ImageFallback src={row.images[0].imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" fallbackIconSize={16} />
      ) : (
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">—</div>
      ),
    },
    {
      header: t.manager.productName,
      accessor: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: t.common.price,
      accessor: (row) => <span className="font-bold"><PriceText amount={row.price} /></span>,
    },
    {
      header: t.manager.productQuantity,
      accessor: (row) => (
        <span className={row.quantity <= row.minQuantity ? 'text-danger-600 font-bold' : ''}>
          {row.quantity}
        </span>
      ),
    },
    {
      header: t.common.status,
      accessor: (row) => <StatusBadge label={row.status === 'ACTIVE' ? t.manager.active : t.manager.inactive} variant={row.status === 'ACTIVE' ? 'success' : 'default'} />,
    },
    {
      header: '',
      accessor: (row) => (
        <Link to={`/manager/products/${row.id}`} className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-medium text-sm">
          <Pencil className="w-3.5 h-3.5" /> {t.actions.edit}
        </Link>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.manager.products}
        description={t.manager.productsDesc}
        action={
          <Link to="/manager/products/new">
            <Button size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1.5" /> {t.manager.createProduct}
            </Button>
          </Link>
        }
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder={t.products.searchPlaceholder}
      />

      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={data?.items || []}
          isLoading={isLoading}
          emptyMessage={t.products.noProducts}
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
