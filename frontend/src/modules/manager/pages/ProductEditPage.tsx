import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm, Path } from 'react-hook-form';
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
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage, getApiErrorMap } from '../../../shared/utils/error';
import { ChevronLeft, Trash2, Image as ImageIcon, ImageOff, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { ImageFallback } from '../../../shared/components/ImageFallback';

export function ManagerProductEditPage() {
  const { productId } = useParams();
  const isNew = productId === 'new';
  const id = isNew ? 0 : Number(productId);
  const navigate = useNavigate();
  const { t } = useI18n();

  const { data: product, isLoading: isLoadingProduct, error: loadError } = useManagerProductQuery(id);
  const { data: categories } = useManagerCategoriesQuery();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const { mutate: addImage, isPending: isAddingImage } = useAddProductImage();
  const { mutate: deleteImage } = useDeleteProductImage();

  const location = useLocation();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(location.state?.created || false);

  useEffect(() => {
    if (location.state?.created) {
      setTimeout(() => setIsSuccess(false), 3000);
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state?.created, navigate]);

  const productSchema = useMemo(() => z.object({
    name: z.string().trim().min(1, t.validation?.required as string),
    description: z.string().trim().min(1, t.validation?.required as string),
    price: z.number({ message: t.validation?.required as string })
      .min(0.01, t.validation?.minNumber?.replace('{{min}}', '0.01') as string),
    quantity: z.number({ message: t.validation?.required as string }).min(0).optional(),
    minQuantity: z.number({ message: t.validation?.required as string })
      .min(0, t.validation?.minNumber?.replace('{{min}}', '0') as string),
    categoryId: z.number({ message: t.validation?.required as string })
      .min(1, t.validation?.required as string),
    status: z.string().optional(),
  }), [t]);

  type ProductForm = z.infer<typeof productSchema>;

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: 'ACTIVE', quantity: 0 }
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

  if (!isNew && isNaN(id)) return <ErrorState message="Invalid Product ID" />;
  if (!isNew && isLoadingProduct) return <LoadingBlock />;
  if (!isNew && loadError) return <ErrorState message={getApiErrorMessage(loadError)} />;

  const handleServerError = (err: any) => {
    const map = getApiErrorMap(err);
    if (Object.keys(map).length > 0) {
      for (const [key, msg] of Object.entries(map)) {
        setError(key as Path<ProductForm>, { type: 'server', message: msg });
      }
    } else {
      alert(getApiErrorMessage(err));
    }
  };

  const onSubmit = (data: ProductForm) => {
    if (isNew) {
      createProduct(
        { name: data.name, description: data.description, price: data.price, quantity: data.quantity || 0, minQuantity: data.minQuantity, categoryId: data.categoryId },
        { 
          onSuccess: (res) => navigate(`/manager/products/${res.id}`, { state: { created: true } }),
          onError: handleServerError
        }
      );
    } else {
      updateProduct(
        { id, name: data.name, description: data.description, price: data.price, minQuantity: data.minQuantity, categoryId: data.categoryId, status: data.status },
        { 
          onSuccess: () => {
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
          },
          onError: handleServerError
        }
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

  const inputClass = "block w-full rounded-xl border-0 py-2.5 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all bg-white";
  const errorInputClass = "ring-danger-300 focus:ring-danger-500";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/manager/products" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 font-medium transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> {t.manager.products}
      </Link>

      <PageHeader title={isNew ? t.manager.createProduct : t.manager.editProduct} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {isSuccess && (
            <div className="p-4 rounded-xl bg-success-50 border border-success-200 flex items-center text-success-700">
              <CheckCircle2 className="w-5 h-5 mr-3" />
              <span className="font-medium">
                {location.state?.created ? "Product created successfully!" : "Product updated successfully!"}
              </span>
            </div>
          )}
          <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
            <Card className="rounded-2xl shadow-sm border-slate-200/60">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle>{isNew ? t.manager.createProduct : t.manager.editProduct}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <Input label={t.manager.productName} {...register('name')} type="text" error={errors.name?.message} />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.manager.productDesc}</label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className={`${inputClass} ${errors.description ? errorInputClass : ''}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label={t.manager.productPrice} {...register('price', { valueAsNumber: true })} type="number" step="0.01" error={errors.price?.message} />
                  <Input label={t.manager.productMinQty} {...register('minQuantity', { valueAsNumber: true })} type="number" error={errors.minQuantity?.message} />
                </div>

                {isNew && (
                  <Input label={t.manager.productQuantity} {...register('quantity', { valueAsNumber: true })} type="number" error={errors.quantity?.message} />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.manager.productCategory}</label>
                    <select
                      {...register('categoryId', { valueAsNumber: true })}
                      className={`${inputClass} cursor-pointer ${errors.categoryId ? errorInputClass : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories?.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="mt-1 text-sm text-danger-600">{errors.categoryId.message}</p>}
                  </div>

                  {!isNew && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.manager.productStatus}</label>
                      <select {...register('status')} className={`${inputClass} cursor-pointer`}>
                        <option value="ACTIVE">{t.manager.active}</option>
                        <option value="INACTIVE">{t.manager.inactive}</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    isLoading={isCreating || isUpdating}
                    className="w-full rounded-xl"
                  >
                    {t.actions.save}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          {!isNew && (
            <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary-600" /> {t.manager.addImage}
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
                  <Button onClick={handleAddImage} disabled={isAddingImage || !newImageUrl} variant="secondary" className="rounded-xl">{t.actions.add}</Button>
                </div>

                {product?.images && product.images.length > 0 ? (
                  <ul className="grid grid-cols-2 gap-3">
                    {product.images.map((img, idx) => (
                      <li key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 aspect-square">
                        <ImageFallback src={img.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" fallbackIconSize={32} />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700">
                          {idx === 0 ? 'Primary' : 'Gallery'}
                        </div>
                        <button
                          onClick={() => deleteImage({ imageId: img.id, productId: id })}
                          className="absolute bottom-2 right-2 p-1.5 bg-white text-danger-500 hover:text-white hover:bg-danger-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
