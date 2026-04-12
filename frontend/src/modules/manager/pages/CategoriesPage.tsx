import { useState } from 'react';
import { useManagerCategoriesQuery, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useManagerCategories';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { Category } from '../../../shared/types/categories';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { FolderPlus } from 'lucide-react';

export function ManagerCategoriesPage() {
  const { data: categories, isLoading } = useManagerCategoriesQuery();
  const { mutate: createCat, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCat, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCat, isPending: isDeleting } = useDeleteCategory();

  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createCat({ name: newName }, {
      onSuccess: () => setNewName('')
    });
  };

  const startEdit = (cat: Category) => {
    setIsEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleUpdate = () => {
    if (!editName.trim() || !isEditingId) return;
    updateCat({ id: isEditingId, name: editName }, {
      onSuccess: () => {
        setIsEditingId(null);
        setEditName('');
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCat(deleteId, {
      onSuccess: () => setDeleteId(null)
    });
  };

  const columns: Column<Category>[] = [
    {
      header: 'ID',
      accessor: (row) => row.id,
    },
    {
      header: 'Name',
      accessor: (row) => isEditingId === row.id ? (
        <div className="flex items-center gap-2">
          <div className="max-w-xs">
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={handleUpdate} isLoading={isUpdating} className="text-primary-600">Save</Button>
          <Button variant="ghost" size="sm" onClick={() => setIsEditingId(null)} className="text-slate-500">Cancel</Button>
        </div>
      ) : (
        row.name
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-3">
          <button onClick={() => startEdit(row)} className="text-primary-600 hover:text-primary-800 font-medium text-sm">Edit</button>
          <button onClick={() => setDeleteId(row.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Categories" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Table Column */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200/60 overflow-hidden">
            <AppTable
              columns={columns}
              data={categories || []}
              isLoading={isLoading}
              emptyMessage="No categories found."
            />
          </Card>
        </div>

        {/* Sidebar Actions Column */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-primary-900">
                <FolderPlus className="w-5 h-5 text-primary-600" />
                Add Category
              </CardTitle>
              <CardDescription>Create a new product category</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="w-full">
                  <Input
                    label="Category Name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Laptops"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isCreating || !newName.trim()}
                  isLoading={isCreating}
                  className="w-full"
                >
                  Create Category
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
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
