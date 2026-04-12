import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useManagerProductQuery } from '../hooks/useManagerProducts';
import { useAddInventory, useRemoveInventory, useInventoryHistoryQuery } from '../hooks/useManagerInventory';
import { PageHeader } from '../../../shared/components/PageHeader';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { formatDateTime } from '../../../shared/utils/date';
import { InventoryMovement } from '../../../shared/types/inventory';
import { ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

export function ManagerInventoryManagePage() {
  const { productId } = useParams();
  const id = Number(productId);

  const { data: product, isLoading: isLoadingProduct, error: loadError } = useManagerProductQuery(id);
  const { data: history, isLoading: isLoadingHistory } = useInventoryHistoryQuery(id);
  
  const { mutate: addStock, isPending: isAdding } = useAddInventory();
  const { mutate: removeStock, isPending: isRemoving } = useRemoveInventory();

  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'add' | 'remove'>('add');

  if (isLoadingProduct) return <LoadingBlock />;
  if (loadError) return <ErrorState message="Could not load product." />;
  if (!product) return null;

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(qty, 10);
    if (!amount || amount <= 0 || !reason.trim()) return;

    const delta = action === 'add' ? amount : -amount;
    const payload = { quantityDelta: delta, reason: reason.trim() };
    const opts = {
      onSuccess: () => {
        setQty('');
        setReason('');
      }
    };

    if (action === 'add') {
      addStock({ productId: id, ...payload }, opts);
    } else {
      removeStock({ productId: id, ...payload }, opts);
    }
  };

  const columns: Column<InventoryMovement>[] = [
    { header: 'Date', accessor: (row) => formatDateTime(row.createdAt) },
    { 
      header: 'Change', 
      accessor: (row) => (
        <span className={row.changeQty > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {row.changeQty > 0 ? '+' : ''}{row.changeQty}
        </span>
      )
    },
    { header: 'Reason', accessor: (row) => row.reason },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/manager/inventory" className="inline-flex items-center text-sm text-primary-600 hover:underline">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to inventory
      </Link>

      <PageHeader title={`Manage Stock: ${product.name}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Current Stock</dt>
                <dd className={`mt-1 text-3xl font-semibold tracking-tight ${product.quantity <= product.minQuantity ? 'text-red-600' : 'text-slate-900'}`}>
                  {product.quantity}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Minimum Required</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                  {product.minQuantity}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adjust Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdjust} className="space-y-4 text-sm">
              <div className="flex gap-4 pb-2">
                <label className="flex items-center gap-2 font-medium text-slate-900 cursor-pointer">
                  <input type="radio" value="add" checked={action === 'add'} onChange={() => setAction('add')} className="text-primary-600 focus:ring-primary-600" />
                  Add Stock
                </label>
                <label className="flex items-center gap-2 font-medium text-slate-900 cursor-pointer">
                  <input type="radio" value="remove" checked={action === 'remove'} onChange={() => setAction('remove')} className="text-primary-600 focus:ring-primary-600" />
                  Remove Stock
                </label>
              </div>

              <Input 
                label={`Quantity to ${action}`}
                type="number" 
                min="1" 
                value={qty} 
                onChange={e => setQty(e.target.value)} 
                required
              />

              <Input 
                label="Reason"
                type="text" 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                placeholder={action === 'add' ? 'e.g. Received new shipment' : 'e.g. Damaged goods'}
                required
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isAdding || isRemoving || !qty || !reason.trim()}
                isLoading={isAdding || isRemoving}
              >
                {`Confirm ${action === 'add' ? 'Addition' : 'Removal'}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Movement History</h3>
        </div>
        <AppTable
          columns={columns}
          data={history || []}
          isLoading={isLoadingHistory}
          emptyMessage="No movement history for this product."
        />
      </div>
    </div>
  );
}
