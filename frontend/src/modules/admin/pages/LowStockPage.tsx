import { useAdminLowStockQuery } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { StatCard } from '../../../shared/components/StatCard';
import { Card } from '../../../shared/components/Card';
import { AlertTriangle, Tag } from 'lucide-react';
import { AdminInventoryStatusDto } from '../../../shared/types/inventory';

export function AdminLowStockPage() {
  const { data, isLoading, error } = useAdminLowStockQuery();
  const { t } = useI18n();

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load low stock products." />;
  if (!data) return null;

  const columns: Column<AdminInventoryStatusDto>[] = [
    { header: t.admin.productName, accessor: (row) => <span className="font-medium">{row.name}</span> },
    {
      header: t.admin.quantity,
      accessor: (row) => <span className="font-bold text-danger-600">{row.quantity}</span>
    },
    { header: t.admin.minQty, accessor: (row) => row.minQuantity },
    {
      header: t.admin.stockStatus,
      accessor: (row) => {
        if (row.quantity <= 0) return <StatusBadge label={t.products.outOfStock} variant="error" />;
        return <StatusBadge label={t.products.lowStock} variant="warning" />;
      }
    }
  ];

  const totalAlerts = data.length;
  const criticalItems = data.filter((i: AdminInventoryStatusDto) => i.quantity <= 0).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title={t.admin.lowStock}
        description={t.admin.lowStockDesc}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label={t.admin.productsNeedReordering} value={totalAlerts} variant="warning" />
        <StatCard icon={<Tag className="w-5 h-5" />} label={t.products.outOfStock} value={criticalItems} variant="danger" />
      </div>

      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <AppTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyMessage="All products have sufficient stock levels! No alerts right now."
          keyField="productId"
        />
      </Card>
    </div>
  );
}
