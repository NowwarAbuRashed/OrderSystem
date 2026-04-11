import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useManagerProductQuery, 
  useCreateProduct, 
  useUpdateProduct,
  useAddProductImage,
  useDeleteProductImage
} from '../hooks/useManagerProducts';
import { useManagerCategoriesQuery } from '../hooks/useManagerCategories';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { ChevronLeft, Trash2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  quantity: z.coerce.number().min(0, 'Quantity must be positive').optional(),
  minQuantity: z.coerce.number().min(0, 'Min quantity must be positive'),
  categoryId: z.coerce.number().min(1, 'Category is required'),
  status: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export function ManagerProductEditPage() {
  const { productId } = useParams();
  const isNew = productId === 'new';
  const id = isNew ? 0 : Number(productId);
  const navigate = useNavigate();

  const { data: product, isLoading: isLoadingProduct, error: loadError } = useManagerProductQuery(id);
  const { data: categories } = useManagerCategoriesQuery();
  
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const { mutate: addImage, isPending: isAddingImage } = useAddProductImage();
  const { mutate: deleteImage } = useDeleteProductImage();

  const [newImageUrl, setNewImageUrl] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      status: 'ACTIVE',
      quantity: 0,
    }
  });

  useEffect(() => {
    if (product && !isNew) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        minQuantity: product.minQuantity,
        categoryId: product.categoryId,
        status: product.status || 'ACTIVE',
      });
    }
  }, [product, isNew, reset]);

  if (!isNew && isLoadingProduct) return <LoadingBlock />;
  if (!isNew && loadError) return <ErrorState message={getApiErrorMessage(loadError)} />;

  const onSubmit = (data: ProductForm) => {
    if (isNew) {
      createProduct(
        { name: data.name, description: data.description, price: data.price, quantity: data.quantity || 0, minQuantity: data.minQuantity, categoryId: data.categoryId },
        { onSuccess: (res) => navigate(`/manager/products/${res.id}`) }
      );
    } else {
      updateProduct(
        { id, name: data.name, description: data.description, price: data.price, minQuantity: data.minQuantity, categoryId: data.categoryId, status: data.status },
        { onSuccess: () => alert('Product updated!') }
      );
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim() || isNew) return;
    addImage({
      productId: id,
      imageUrl: newImageUrl,
      altText: product?.name || "",
      sortOrder: (product?.images?.length || 0) + 1,
      isPrimary: product?.images?.length === 0,
    }, {
      onSuccess: () => setNewImageUrl('')
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/manager/products" className="inline-flex items-center text-sm text-blue-600 hover:underline">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to products
      </Link>

      <PageHeader title={isNew ? 'Create Product' : 'Edit Product'} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Name</label>
              <input {...register('name')} type="text" className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Description</label>
              <textarea {...register('description')} rows={4} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Price</label>
                <input {...register('price')} type="number" step="0.01" className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Min Quantity</label>
                <input {...register('minQuantity')} type="number" className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
                {errors.minQuantity && <p className="mt-1 text-sm text-red-600">{errors.minQuantity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Category</label>
                <select {...register('categoryId')} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm">
                  <option value="">Select a category</option>
                  {categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
              </div>

              {!isNew && (
                 <div>
                   <label className="block text-sm font-medium leading-6 text-slate-900">Status</label>
                   <select {...register('status')} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm">
                     <option value="ACTIVE">Active</option>
                     <option value="INACTIVE">Inactive</option>
                   </select>
                 </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {!isNew && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
               <h3 className="text-lg font-medium text-slate-900 mb-4">Images</h3>
               
               <div className="flex gap-2 mb-4">
                 <input 
                   type="text" 
                   value={newImageUrl}
                   onChange={e => setNewImageUrl(e.target.value)}
                   placeholder="Image URL" 
                   className="block w-full rounded-md border-0 py-1 px-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                 />
                 <button onClick={handleAddImage} disabled={isAddingImage || !newImageUrl} className="rounded bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200 border border-slate-300">Add</button>
               </div>

               {product?.images && product.images.length > 0 ? (
                 <ul className="space-y-2">
                   {product.images.map(img => (
                     <li key={img.id} className="flex items-center gap-2 p-2 border border-slate-100 rounded">
                       <img src={img.imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                       <div className="flex-1 truncate text-xs text-slate-500">{img.imageUrl}</div>
                       <button onClick={() => deleteImage({ imageId: img.id, productId: id})} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-slate-500">No images added yet.</p>
               )}
            </div>
          )}
          {isNew && (
             <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center text-sm text-slate-500">
               Save the product first to add images.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
