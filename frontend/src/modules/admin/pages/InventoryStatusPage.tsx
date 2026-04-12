import { useAdminInventoryStatusQuery } from '../hooks/useAdmin';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { AdminInventoryStatusDto } from '../../../shared/types/inventory';
import { Card, CardContent } from '../../../shared/components/Card';
import { Package, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

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

  const totalProducts = data.length;
  const inStock = data.filter((i: AdminInventoryStatusDto) => i.quantity > i.minQuantity).length;
  const lowStock = data.filter((i: AdminInventoryStatusDto) => i.quantity > 0 && i.quantity <= i.minQuantity).length;
  const outOfStock = data.filter((i: AdminInventoryStatusDto) => i.quantity <= 0).length;

  return (
    <div className="space-y-8">
      <PageHeader title="Inventory Health Status" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <h4 className="text-2xl font-bold text-slate-900">{totalProducts}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Healthy Stock</p>
              <h4 className="text-2xl font-bold text-slate-900">{inStock}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock</p>
              <h4 className="text-2xl font-bold text-slate-900">{lowStock}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Out of Stock</p>
              <h4 className="text-2xl font-bold text-slate-900">{outOfStock}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
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
