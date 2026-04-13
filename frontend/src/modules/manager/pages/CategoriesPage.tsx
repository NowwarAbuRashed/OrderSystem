import { useState, useMemo } from 'react';
import { z } from 'zod';
import { useManagerCategoriesQuery, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useManagerCategories';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { Category } from '../../../shared/types/categories';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { FolderPlus, Pencil, Trash2 } from 'lucide-react';

import { getApiErrorMessage } from '../../../shared/utils/error';

export function ManagerCategoriesPage() {
  const { data: categories, isLoading } = useManagerCategoriesQuery();
  const { mutate: createCat, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCat, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCat, isPending: isDeleting } = useDeleteCategory();
  const { t } = useI18n();

  const categoryNameSchema = useMemo(() => 
    z.string().trim()
     .min(2, t.validation?.minLength?.replace('{{min}}', '2') || 'Category name must be at least 2 characters')
     .max(100, t.validation?.maxLength?.replace('{{max}}', '100') || 'Name too long'), 
  [t]);

  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  
  const [newName, setNewName] = useState('');
  const [createError, setCreateError] = useState('');
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = categoryNameSchema.safeParse(newName);
    if (!result.success) {
      setCreateError(result.error.issues[0].message);
      return;
    }
    setCreateError('');
    createCat({ name: result.data }, { 
      onSuccess: () => { setNewName(''); setCreateError(''); },
      onError: (err) => {
        setCreateError(getApiErrorMessage(err));
      }
    });
  };

  const startEdit = (cat: Category) => {
    setIsEditingId(cat.id);
    setEditName(cat.name);
    setEditError('');
  };

  const handleUpdate = () => {
    if (!isEditingId) return;
    const result = categoryNameSchema.safeParse(editName);
    if (!result.success) {
      setEditError(result.error.issues[0].message);
      return;
    }
    updateCat({ id: isEditingId, name: result.data }, { 
      onSuccess: () => { setIsEditingId(null); setEditName(''); setEditError(''); },
      onError: (err) => {
        setEditError(getApiErrorMessage(err));
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCat(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const columns: Column<Category>[] = [
    { header: 'ID', accessor: (row) => <span className="text-slate-400 font-mono text-xs">#{row.id}</span> },
    {
      header: t.common.name,
      accessor: (row) => isEditingId === row.id ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="max-w-xs">
              <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <Button variant="ghost" size="sm" onClick={handleUpdate} isLoading={isUpdating} className="text-primary-600">{t.actions.save}</Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingId(null)} className="text-slate-500">{t.actions.cancel}</Button>
          </div>
          {editError && <span className="text-xs text-danger-500">{editError}</span>}
        </div>
      ) : (
        <span className="font-medium">{row.name}</span>
      ),
    },
    {
      header: '',
      accessor: (row) => (
        <div className="flex gap-3">
          <button onClick={() => startEdit(row)} className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-medium text-sm"><Pencil className="w-3.5 h-3.5" /> {t.actions.edit}</button>
          <button onClick={() => setDeleteId(row.id)} className="inline-flex items-center gap-1 text-danger-600 hover:text-danger-800 font-medium text-sm"><Trash2 className="w-3.5 h-3.5" /> {t.actions.delete}</button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t.manager.categories} description={t.manager.categoriesDesc} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200/60 overflow-hidden rounded-2xl">
            <AppTable columns={columns} data={categories || []} isLoading={isLoading} emptyMessage={t.products.noProducts} />
          </Card>
        </div>

        <div>
          <Card className="shadow-sm border-slate-200/60 rounded-2xl">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary-600" />
                {t.manager.createCategory}
              </CardTitle>
              <CardDescription>{t.manager.categoriesDesc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Input label={t.common.name} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Dairy Products" />
                  {createError && <span className="text-xs text-danger-500 pl-1">{createError}</span>}
                </div>
                <Button type="submit" disabled={isCreating} isLoading={isCreating} className="w-full rounded-xl">
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
