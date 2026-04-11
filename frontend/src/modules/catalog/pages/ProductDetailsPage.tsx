import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductQuery } from '../hooks/useCatalog';
import { useAddCartItem } from '../../cart/hooks/useCart';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { ChevronLeft, ShoppingCart } from 'lucide-react';

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
      <Link to="/products" className="inline-flex items-center text-sm text-blue-600 hover:underline">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to products
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="h-64 md:h-full min-h-[300px] bg-slate-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-200">
            {product.images?.length > 0 ? (
              <img src={product.images[0].imageUrl} alt={product.name} className="max-h-full object-contain" />
            ) : (
              <span className="text-slate-400">No image available</span>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <div className="mt-4 text-2xl text-blue-600">
              <PriceText amount={product.price} />
            </div>

            <div className="mt-6 prose prose-slate text-sm">
              <p>{product.description}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex-1 flex flex-col justify-end gap-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Availability</span>
                {isAvailable ? (
                  <span className="font-medium text-green-600">{product.quantity} in stock</span>
                ) : (
                  <span className="font-medium text-red-600">Out of stock</span>
                )}
              </div>

              {isAvailable && (
                <div className="flex items-end gap-4">
                  <div className="w-24">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isPending || quantity < 1 || quantity > product.quantity}
                    className="flex-1 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isPending ? 'Adding...' : 'Add to cart'}
                  </button>
                </div>
              )}
              {addedMessage && <p className="text-sm font-medium text-green-600 text-center">{addedMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
