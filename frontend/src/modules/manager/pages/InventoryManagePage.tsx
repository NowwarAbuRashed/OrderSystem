import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useManagerProductQuery } from '../hooks/useManagerProducts';
import { useAddInventory, useRemoveInventory, useInventoryHistoryQuery } from '../hooks/useManagerInventory';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage, getApiErrorMap } from '../../../shared/utils/error';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { formatDateTime } from '../../../shared/utils/date';
import { InventoryMovement } from '../../../shared/types/inventory';
import { ChevronLeft, Plus, Minus, TrendingUp, TrendingDown, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

export function ManagerInventoryManagePage() {
  const { productId } = useParams();
  const id = Number(productId);
  const { t } = useI18n();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: product, isLoading: isLoadingProduct, error: loadError } = useManagerProductQuery(id);
  const { data: history, isLoading: isLoadingHistory } = useInventoryHistoryQuery(id);

  const { mutate: addStock, isPending: isAdding } = useAddInventory();
  const { mutate: removeStock, isPending: isRemoving } = useRemoveInventory();

  const inventorySchema = useMemo(() => z.object({
    action: z.enum(['add', 'remove']),
    qty: z.number({ message: t.validation?.required as string }).min(1, t.validation?.minNumber?.replace('{{min}}', '1') as string)
  }).superRefine((data, ctx) => {
    if (data.action === 'remove' && product && data.qty > product.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation?.maxNumber?.replace('{{max}}', String(product.quantity)) as string,
        path: ['qty']
      });
    }
  }), [t, product]);

  type InventoryFormType = z.infer<typeof inventorySchema>;

  const { register, handleSubmit, reset, watch, setValue, setError, formState: { errors } } = useForm<InventoryFormType>({
    resolver: zodResolver(inventorySchema),
    defaultValues: { action: 'add' }
  });

  const actionValue = watch('action');

  if (isLoadingProduct) return <LoadingBlock />;
  if (loadError) return <ErrorState message="Could not load product." />;
  if (!product || isNaN(id)) return <ErrorState message="Invalid product." />;

  const onSubmit = (data: InventoryFormType) => {
    const delta = data.action === 'add' ? data.qty : -data.qty;
    const payload = { quantityDelta: delta };
    const opts = { 
      onSuccess: () => {
        setSuccessMessage(t.common.success);
        reset();
        setTimeout(() => setSuccessMessage(null), 3000);
      },
      onError: (err: any) => {
        const map = getApiErrorMap(err);
        if (Object.keys(map).length > 0) {
          for (const [key, msg] of Object.entries(map)) {
            if (key === 'quantityDelta' || key === 'quantity') {
              setError('qty', { type: 'server', message: msg });
            } else {
              setError(key as keyof InventoryFormType, { type: 'server', message: msg });
            }
          }
        } else {
          setError('root.serverError', { type: 'server', message: getApiErrorMessage(err) });
        }
      }
    };

    if (data.action === 'add') {
      addStock({ productId: id, ...payload }, opts);
    } else {
      removeStock({ productId: id, ...payload }, opts);
    }
  };

  const columns: Column<InventoryMovement>[] = [
    { header: t.orders.orderDate, accessor: (row) => formatDateTime(row.createdAt) },
    {
      header: t.manager.quantityDelta,
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1 font-bold ${row.changeQty > 0 ? 'text-success-600' : 'text-danger-600'}`}>
          {row.changeQty > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {row.changeQty > 0 ? '+' : ''}{row.changeQty}
        </span>
      )
    },
    { header: t.manager.reason, accessor: (row) => row.reason },
  ];

  const isLow = product.quantity <= product.minQuantity;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/manager/inventory" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 font-medium transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> {t.manager.inventory}
      </Link>

      <PageHeader title={`${t.manager.manageInventory}: ${product.name}`} />

      {successMessage && (
        <div className="bg-success-50 text-success-700 p-4 rounded-2xl border border-success-100 font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 mb-6 shadow-sm">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-success-500 hover:text-success-700 transition-colors bg-white/50 w-6 h-6 rounded-full flex items-center justify-center">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Overview Card */}
        <Card className="rounded-2xl shadow-sm border-slate-200/60">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary-600" /> {t.manager.productQuantity}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <dt className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.manager.productQuantity}</dt>
                <dd className={`mt-1 text-3xl font-bold tracking-tight ${isLow ? 'text-danger-600' : 'text-slate-900'}`}>
                  {product.quantity}
                </dd>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <dt className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.manager.productMinQty}</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {product.minQuantity}
                </dd>
              </div>
            </dl>
            {isLow && (
              <div className="mt-4 bg-warning-50 text-warning-700 p-3 rounded-xl text-sm font-medium border border-warning-200">
                ⚠️ {t.products.lowStock} — Stock is below minimum threshold
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adjust Stock Card */}
        <Card className="rounded-2xl shadow-sm border-slate-200/60">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle>{t.manager.adjustInventory}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errors.root?.serverError?.message && (
                <div className="bg-danger-50 text-danger-700 p-3 rounded-xl border border-danger-100 text-sm font-medium flex gap-2 items-start">
                   <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                   {errors.root.serverError.message}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('action', 'add')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${actionValue === 'add' ? 'border-success-500 bg-success-50 text-success-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  <Plus className="w-4 h-4" /> Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setValue('action', 'remove')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${actionValue === 'remove' ? 'border-danger-500 bg-danger-50 text-danger-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  <Minus className="w-4 h-4" /> Remove
                </button>
              </div>

              <Input
                label={t.common.quantity}
                type="number"
                min="1"
                {...register('qty', { valueAsNumber: true })}
                error={errors.qty?.message}
              />

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={isAdding || isRemoving}
                isLoading={isAdding || isRemoving}
              >
                {t.actions.confirm}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Movement History */}
      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2">{t.manager.movementHistory}</CardTitle>
        </CardHeader>
        <AppTable
          columns={columns}
          data={history || []}
          isLoading={isLoadingHistory}
          emptyMessage="No movement history for this product."
        />
      </Card>
    </div>
  );
}
