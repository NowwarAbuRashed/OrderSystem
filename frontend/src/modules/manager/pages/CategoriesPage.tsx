import { useState, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useManagerCategoriesQuery, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useManagerCategories';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { Category } from '../../../shared/types/categories';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { FolderPlus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';

import { getApiErrorMessage, getApiErrorMap } from '../../../shared/utils/error';

export function ManagerCategoriesPage() {
  const { data: categories, isLoading } = useManagerCategoriesQuery();
  const { mutate: createCat, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCat, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCat, isPending: isDeleting } = useDeleteCategory();
  const { t } = useI18n();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = () => {
    setSuccessMessage(t.common.success);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const categorySchema = useMemo(() => z.object({
    name: z.string().trim()
     .min(2, t.validation?.minLength?.replace('{{min}}', '2') as string)
     .max(100, t.validation?.maxLength?.replace('{{max}}', '100') as string)
  }), [t]);

  type CategoryFormType = z.infer<typeof categorySchema>;

  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, setError: setErrorCreate, formState: { errors: createErrors } } = useForm<CategoryFormType>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' }
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setError: setErrorEdit, formState: { errors: editErrors } } = useForm<CategoryFormType>({
    resolver: zodResolver(categorySchema)
  });

  const handleCreate = (data: CategoryFormType) => {
    createCat({ name: data.name }, { 
      onSuccess: () => {
        resetCreate();
        showSuccess();
      },
      onError: (err) => {
        const map = getApiErrorMap(err);
        if (map && map.name) {
          setErrorCreate('name', { type: 'server', message: map.name });
        } else {
          setErrorCreate('name', { type: 'server', message: getApiErrorMessage(err) });
        }
      }
    });
  };

  const startEdit = (cat: Category) => {
    setIsEditingId(cat.id);
    resetEdit({ name: cat.name });
  };

  const handleUpdate = (data: CategoryFormType) => {
    if (!isEditingId) return;
    updateCat({ id: isEditingId, name: data.name }, { 
      onSuccess: () => {
        setIsEditingId(null);
        showSuccess();
      },
      onError: (err) => {
        const map = getApiErrorMap(err);
        if (map && map.name) {
          setErrorEdit('name', { type: 'server', message: map.name });
        } else {
          setErrorEdit('name', { type: 'server', message: getApiErrorMessage(err) });
        }
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCat(deleteId, { 
      onSuccess: () => {
        setDeleteId(null);
        showSuccess();
      }
    });
  };

  const columns: Column<Category>[] = [
    { header: 'ID', accessor: (row) => <span className="text-slate-400 font-mono text-xs">#{row.id}</span> },
    {
      header: t.common.name,
      accessor: (row) => isEditingId === row.id ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="max-w-xs">
              <Input type="text" {...registerEdit('name')} error={editErrors.name?.message} />
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleSubmitEdit(handleUpdate)()} isLoading={isUpdating} className="text-primary-600 font-bold">{t.actions.save}</Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingId(null)} className="text-slate-500">{t.actions.cancel}</Button>
          </div>
        </div>
      ) : (
        <span className="font-medium text-slate-700">{row.name}</span>
      ),
    },
    {
      header: '',
      accessor: (row) => (
        <div className="flex gap-3">
          <button onClick={() => startEdit(row)} className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-semibold text-sm transition-colors"><Pencil className="w-3.5 h-3.5" /> {t.actions.edit}</button>
          <button onClick={() => setDeleteId(row.id)} className="inline-flex items-center gap-1 text-danger-600 hover:text-danger-800 font-semibold text-sm transition-colors"><Trash2 className="w-3.5 h-3.5" /> {t.actions.delete}</button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t.manager.categories} description={t.manager.categoriesDesc} />

      {successMessage && (
        <div className="bg-success-50 text-success-700 p-4 rounded-2xl border border-success-100 font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-success-500 hover:text-success-700 transition-colors bg-white/50 w-6 h-6 rounded-full flex items-center justify-center">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200/60 overflow-hidden rounded-2xl">
            <AppTable columns={columns} data={categories || []} isLoading={isLoading} emptyMessage={t.products.noProducts} />
          </Card>
        </div>

        <div>
          <Card className="shadow-sm border-slate-200/60 rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary-600" />
                {t.manager.createCategory}
              </CardTitle>
              <CardDescription>{t.manager.categoriesDesc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitCreate(handleCreate)} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Input label={t.common.name} type="text" {...registerCreate('name')} placeholder="e.g. Dairy Products" error={createErrors.name?.message} />
                </div>
                <Button type="submit" disabled={isCreating} isLoading={isCreating} className="w-full rounded-xl py-6 font-bold">
                  {t.manager.createCategory}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t.manager.deleteConfirmTitle}
        description={t.manager.deleteConfirmDesc}
        confirmText={t.actions.delete}
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
