import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductQuery } from '../hooks/useCatalog';
import { useAddCartItem } from '../../cart/hooks/useCart';
import { useI18n } from '../../../app/i18n/i18n-context';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { ErrorState } from '../../../shared/components/ErrorState';
import { getApiErrorMessage } from '../../../shared/utils/error';
import { PriceText } from '../../../shared/components/PriceText';
import { QuantityStepper } from '../../../shared/components/QuantityStepper';
import { ChevronLeft, ChevronRight, ShoppingCart, ImageOff, Shield, Truck, RefreshCw } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { ImageFallback } from '../../../shared/components/ImageFallback';

export function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const id = Number(productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedMessage, setAddedMessage] = useState('');
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  const { data: product, isLoading, error } = useProductQuery(id);
  const { mutate: addToCart, isPending } = useAddCartItem();

  // Reset selected image when navigating to a different product
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setAddedMessage('');
  }, [productId]);

  // Auto-scroll thumbnails to keep selected one visible
  useEffect(() => {
    if (thumbnailsRef.current) {
      const container = thumbnailsRef.current;
      const activeThumb = container.children[selectedImage] as HTMLElement;
      if (activeThumb) {
        const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedImage]);

  if (isLoading) return <LoadingBlock />;
  if (isNaN(id)) return <ErrorState message="Invalid product reference" />;
  if (error || !product) return <ErrorState message={error ? getApiErrorMessage(error) : 'Product not found'} />;

  const isAvailable = product.status === 'ACTIVE' && product.quantity > 0;

  const handleAddToCart = () => {
    addToCart(
      { productId: id, quantity },
      {
        onSuccess: () => {
          setAddedMessage(t.products.addedToCart);
          setTimeout(() => setAddedMessage(''), 3000);
          setQuantity(1);
        },
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 me-1" /> {t.products.backToProducts}
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="min-h-[400px] bg-gradient-to-b from-slate-50 to-white relative flex flex-col border-b md:border-b-0 md:border-r border-slate-200/60 overflow-hidden">
            {/* Main Image with Arrow Navigation */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <ImageFallback src={product.images?.[selectedImage]?.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-md max-h-[350px]" />
              {/* Left/Right Arrow Buttons */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => prev === 0 ? product.images!.length - 1 : prev - 1)}
                    className="absolute start-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => prev === product.images!.length - 1 ? 0 : prev + 1)}
                    className="absolute end-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div
                ref={thumbnailsRef}
                className="flex items-center gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide"
              >
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 overflow-hidden transition-all flex-shrink-0 ${
                      idx === selectedImage
                        ? 'border-primary-500 ring-2 ring-primary-200 shadow-md scale-110'
                        : 'border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ImageFallback src={img.imageUrl} alt={img.altText || product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Status Badges */}
            <div className="absolute top-4 start-4 flex flex-col gap-2">
              {!isAvailable ? (
                <StatusBadge label={t.products.outOfStock} variant="error" />
              ) : product.quantity <= product.minQuantity ? (
                <StatusBadge label={t.products.lowStock} variant="warning" />
              ) : null}
            </div>
            {/* Image Counter */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-20 end-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 lg:p-12 flex flex-col bg-white">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
            <div className="mt-4 text-3xl text-primary-600 font-bold bg-primary-50/50 inline-block px-4 py-2 rounded-xl border border-primary-100 self-start">
              <PriceText amount={product.price} />
            </div>

            {product.description && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{t.products.description}</h3>
                <p className="text-slate-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-5">
              <div className="flex items-center justify-between text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium tracking-wide uppercase">{t.products.availability}</span>
                {isAvailable ? (
                  <span className="font-bold text-success-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
                    {product.quantity} {t.products.inStock}
                  </span>
                ) : (
                  <span className="font-bold text-danger-600">{t.products.outOfStock}</span>
                )}
              </div>

              {isAvailable && (
                <div className="flex items-end gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t.products.quantity}</label>
                    <QuantityStepper
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={product.quantity}
                    />
                  </div>
                  <div className="flex-1">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isPending || quantity < 1 || quantity > product.quantity}
                      isLoading={isPending}
                      className="w-full text-base py-4 flex items-center justify-center gap-2 rounded-xl"
                    >
                      <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                      {t.actions.addToCart}
                    </Button>
                  </div>
                </div>
              )}
              {addedMessage && <p className="text-sm font-medium text-success-600 text-center bg-success-50 p-3 rounded-xl border border-success-100">{addedMessage}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Truck, label: 'Fast Delivery', desc: 'Same-day delivery available' },
          { icon: Shield, label: 'Quality Guarantee', desc: '100% fresh products' },
          { icon: RefreshCw, label: 'Easy Returns', desc: 'Hassle-free return policy' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
