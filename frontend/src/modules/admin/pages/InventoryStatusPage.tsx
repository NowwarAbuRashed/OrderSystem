import { useAdminInventoryStatusQuery } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { StatCard } from '../../../shared/components/StatCard';
import { AdminInventoryStatusDto } from '../../../shared/types/inventory';
import { Card } from '../../../shared/components/Card';
import { Package, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export function AdminInventoryStatusPage() {
  const { data, isLoading, error } = useAdminInventoryStatusQuery();
  const { t } = useI18n();

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load inventory status." />;
  if (!data) return null;

  const columns: Column<AdminInventoryStatusDto>[] = [
    { header: t.admin.productName, accessor: (row) => <span className="font-medium">{row.name}</span> },
    { header: t.admin.quantity, accessor: (row) => <span className={row.quantity <= row.minQuantity ? 'text-danger-600 font-bold' : 'font-semibold'}>{row.quantity}</span> },
    { header: t.admin.minQty, accessor: (row) => row.minQuantity },
    {
      header: t.admin.stockStatus,
      accessor: (row) => {
        if (row.quantity <= 0) return <StatusBadge label={t.products.outOfStock} variant="error" />;
        if (row.quantity <= row.minQuantity) return <StatusBadge label={t.products.lowStock} variant="warning" />;
        return <StatusBadge label={t.admin.ok} variant="success" />;
      }
    }
  ];

  const totalProducts = data.length;
  const inStock = data.filter((i: AdminInventoryStatusDto) => i.quantity > i.minQuantity).length;
  const lowStock = data.filter((i: AdminInventoryStatusDto) => i.quantity > 0 && i.quantity <= i.minQuantity).length;
  const outOfStock = data.filter((i: AdminInventoryStatusDto) => i.quantity <= 0).length;

  return (
    <div className="space-y-8">
      <PageHeader title={t.admin.inventoryStatus} description={t.admin.inventoryStatusDesc} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package className="w-5 h-5" />} label="Total Products" value={totalProducts} variant="default" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Healthy Stock" value={inStock} variant="success" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label={t.products.lowStock} value={lowStock} variant="warning" />
        <StatCard icon={<XCircle className="w-5 h-5" />} label={t.products.outOfStock} value={outOfStock} variant="danger" />
      </div>

      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          keyField="productId"
        />
      </Card>
    </div>
  );
}
