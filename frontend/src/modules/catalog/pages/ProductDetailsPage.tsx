import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductQuery } from '../hooks/useCatalog';
import { useAddCartItem } from '../../cart/hooks/useCart';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { ChevronLeft, ShoppingCart, ImageOff } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { ImageFallback } from '../../../shared/components/ImageFallback';

export function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const id = Number(productId);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState('');

  const { data: product, isLoading, error } = useProductQuery(id);
  const { mutate: addToCart, isPending } = useAddCartItem();

  if (isLoading) return <LoadingBlock />;
  if (error || !product) return <ErrorState message={error ? getApiErrorMessage(error) : 'Product not found'} />;

  const isAvailable = product.status === 'ACTIVE' && product.quantity > 0;

  const handleAddToCart = () => {
    addToCart(
      { productId: id, quantity },
      {
        onSuccess: () => {
          setAddedMessage('Added to cart!');
          setTimeout(() => setAddedMessage(''), 3000);
          setQuantity(1);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to products
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="h-64 md:h-full min-h-[400px] bg-slate-50 relative flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-200/60">
            {product.images?.length > 0 ? (
              <ImageFallback src={product.images[0].imageUrl} alt={product.name} className="max-h-full object-contain mix-blend-multiply drop-shadow-md" fallbackIconSize={64} />
            ) : (
              <div className="flex flex-col items-center text-slate-300">
                <ImageOff className="w-16 h-16 mb-2" />
                <span>No image available</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {!isAvailable ? (
                <StatusBadge label="Out of Stock" variant="error" />
              ) : product.quantity <= product.minQuantity ? (
                <StatusBadge label="Low Stock" variant="warning" />
              ) : null}
            </div>
          </div>

          {/* Details */}
          <div className="p-8 lg:p-12 flex flex-col bg-white">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
            <div className="mt-4 text-3xl text-primary-600 font-bold bg-primary-50/50 inline-block px-4 py-2 rounded-xl border border-primary-100 self-start">
              <PriceText amount={product.price} />
            </div>

            <div className="mt-8 prose prose-slate prose-lg text-slate-600">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-6">
              <div className="flex items-center justify-between text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium tracking-wide uppercase">Availability</span>
                {isAvailable ? (
                  <span className="font-bold text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    {product.quantity} in stock
                  </span>
                ) : (
                  <span className="font-bold text-red-600">Out of stock</span>
                )}
              </div>

              {isAvailable && (
                <div className="flex items-end gap-4 mt-2">
                  <div className="w-28">
                    <Input
                      label="Quantity"
                      type="number"
                      min={1}
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex-1">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isPending || quantity < 1 || quantity > product.quantity}
                      isLoading={isPending}
                      className="w-full text-lg py-6 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                      Add to cart
                    </Button>
                  </div>
                </div>
              )}
              {addedMessage && <p className="text-sm font-medium text-green-600 text-center bg-green-50 p-3 rounded-lg border border-green-100">{addedMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
