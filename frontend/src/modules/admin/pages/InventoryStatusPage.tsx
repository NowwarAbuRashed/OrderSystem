import { useAdminInventoryStatusQuery } from '../hooks/useAdmin';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { AdminInventoryStatusDto } from '../../../shared/types/inventory';

export function AdminInventoryStatusPage() {
  const { data, isLoading, error } = useAdminInventoryStatusQuery();

  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState message="Could not load inventory status." />;
  if (!data) return null;

  const columns: Column<AdminInventoryStatusDto>[] = [
    { header: 'Product ID', accessor: (row) => row.productId },
    { header: 'Product Name', accessor: (row) => row.name },
    { header: 'Quantity', accessor: (row) => row.quantity },
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
      <PageHeader title="Inventory Health Status" />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <AppTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          keyField="productId"
        />
      </div>
    </div>
  );
}
