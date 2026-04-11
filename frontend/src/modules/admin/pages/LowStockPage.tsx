import { useAdminLowStockQuery } from '../hooks/useAdmin';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { AdminInventoryStatusDto } from '../../../shared/types/inventory';

export function AdminLowStockPage() {
  const { data, isLoading, error } = useAdminLowStockQuery();

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load low stock products." />;
  if (!data) return null;

  const columns: Column<AdminInventoryStatusDto>[] = [
    { header: 'Product ID', accessor: (row) => row.productId },
    { header: 'Product Name', accessor: (row) => row.name },
    { 
      header: 'Quantity', 
      accessor: (row) => <span className="font-medium text-red-600">{row.quantity}</span> 
    },
    { header: 'Min Required', accessor: (row) => row.minQuantity },
    {
      header: 'Stock Status',
      accessor: (row) => {
        let variant: any = 'default';
        if (row.stockStatus.toLowerCase() === 'in stock') variant = 'success';
        if (row.stockStatus.toLowerCase() === 'low stock') variant = 'warning';
        if (row.stockStatus.toLowerCase() === 'out of stock') variant = 'error';
        return <StatusBadge label={row.stockStatus} variant={variant} />;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Low Stock Alerts" 
        description="Products currently at or below their minimum required quantity."
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <AppTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyMessage="All products have sufficient stock levels! No alerts right now."
          keyField="productId"
        />
      </div>
    </div>
  );
}
