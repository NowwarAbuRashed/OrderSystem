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
import { ChevronLeft, Trash2, Image as ImageIcon, ImageOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { ImageFallback } from '../../../shared/components/ImageFallback';

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
      <Link to="/manager/products" className="inline-flex items-center text-sm text-primary-600 hover:underline">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to products
      </Link>

      <PageHeader title={isNew ? 'Create Product' : 'Edit Product'} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>{isNew ? 'Product Details' : 'Edit Details'}</CardTitle>
              </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Name"
                {...register('name')}
                type="text"
                error={errors.name?.message}
              />

              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Description</label>
                <textarea 
                  {...register('description')} 
                  rows={4} 
                  className={`block w-full rounded-lg border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 transition-all ${errors.description ? 'ring-red-300 focus:ring-red-500 text-red-900' : 'ring-slate-300 focus:ring-primary-600'}`} 
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price"
                  {...register('price')}
                  type="number"
                  step="0.01"
                  error={errors.price?.message}
                />

                <Input
                  label="Min Quantity"
                  {...register('minQuantity')}
                  type="number"
                  error={errors.minQuantity?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Category</label>
                  <select 
                    {...register('categoryId')} 
                    className={`block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm transition-all ${errors.categoryId ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-300 focus:ring-primary-600'}`}
                  >
                    <option value="">Select a category</option>
                    {categories?.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
                </div>

                {!isNew && (
                   <div>
                     <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Status</label>
                     <select {...register('status')} className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary-600 sm:text-sm transition-all">
                       <option value="ACTIVE">Active</option>
                       <option value="INACTIVE">Inactive</option>
                     </select>
                   </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  isLoading={isCreating || isUpdating}
                  className="w-full"
                >
                  {isCreating || isUpdating ? 'Saving...' : 'Save Product'}
                </Button>
              </div>
            </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          {!isNew && (
            <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <CardTitle className="flex items-center gap-2">
                   <ImageIcon className="w-5 h-5 text-primary-600" /> Product Images
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                 <div className="flex gap-2 mb-6">
                   <div className="flex-1">
                     <Input 
                       type="text" 
                       value={newImageUrl}
                       onChange={e => setNewImageUrl(e.target.value)}
                       placeholder="https://example.com/image.jpg" 
                     />
                   </div>
                   <Button onClick={handleAddImage} disabled={isAddingImage || !newImageUrl} variant="secondary">Add</Button>
                 </div>

                 {product?.images && product.images.length > 0 ? (
                   <ul className="grid grid-cols-2 gap-4">
                     {product.images.map((img, idx) => (
                       <li key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 aspect-square">
                         <ImageFallback src={img.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" fallbackIconSize={32} />
                         <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                         <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 shadow-sm">
                           {idx === 0 ? 'Primary' : 'Gallery'}
                         </div>
                         <button 
                           onClick={() => deleteImage({ imageId: img.id, productId: id})} 
                           className="absolute bottom-2 right-2 p-2 bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                     <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                     <p className="text-sm">No images added yet.</p>
                   </div>
                 )}
               </CardContent>
            </Card>
          )}
          {isNew && (
             <div className="bg-slate-50/80 p-8 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
               <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
               <h4 className="text-slate-900 font-medium mb-1">Image Gallery</h4>
               <p className="text-sm text-slate-500 max-w-[200px]">Save this product first before you can attach any media.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
