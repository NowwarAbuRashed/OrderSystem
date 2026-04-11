import { useState } from 'react';
import { useManagerCategoriesQuery, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useManagerCategories';
import { PageHeader } from '../../../shared/components/PageHeader';
import { AppTable, Column } from '../../../shared/components/AppTable';
import { Category } from '../../../shared/types/categories';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';

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
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="block w-full max-w-xs rounded-md border-0 py-1 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm px-2"
          />
          <button onClick={handleUpdate} disabled={isUpdating} className="text-sm text-blue-600 font-medium">Save</button>
          <button onClick={() => setIsEditingId(null)} className="text-sm text-slate-500 font-medium">Cancel</button>
        </div>
      ) : (
        row.name
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-3">
          <button onClick={() => startEdit(row)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
          <button onClick={() => setDeleteId(row.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Categories" />

      <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-end gap-4 max-w-md">
        <div className="flex-1">
          <label className="block text-sm font-medium leading-6 text-slate-900">New Category</label>
          <div className="mt-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Laptops"
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isCreating || !newName.trim()}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <AppTable
        columns={columns}
        data={categories || []}
        isLoading={isLoading}
        emptyMessage="No categories found."
      />

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
