import { useAdminLowStockQuery } from '../hooks/useAdmin';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { Card, CardContent } from '../../../shared/components/Card';
import { AlertTriangle, Tag } from 'lucide-react';
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
        let label = 'Healthy';
        let variant: any = 'success';
        if (row.quantity <= 0) {
          label = 'Out of Stock';
          variant = 'error';
        } else if (row.quantity <= row.minQuantity) {
          label = 'Low Stock';
          variant = 'warning';
        }
        return <StatusBadge label={label} variant={variant} />;
      }
    }
  ];

  const totalAlerts = data.length;
  const criticalItems = data.filter((i: AdminInventoryStatusDto) => i.quantity <= 0).length;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Low Stock Alerts" 
        description="Products currently at or below their minimum required quantity."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Products Need Reordering</p>
              <h4 className="text-2xl font-bold text-slate-900">{totalAlerts}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Out of Stock</p>
              <h4 className="text-2xl font-bold text-slate-900">{criticalItems}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
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
