import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff, ShoppingCart } from 'lucide-react';
import { ImageFallback } from './ImageFallback';
import { PriceText } from './PriceText';
import { StatusBadge } from './StatusBadge';
import { type ProductListItem } from '../types/products';

interface ProductCardProps {
  product: ProductListItem;
  onAddToCart?: (productId: number) => void;
  isAddingToCart?: boolean;
  linkPrefix?: string;
  className?: string;
  actionSlot?: ReactNode;
}

export function ProductCard({
  product,
  onAddToCart,
  isAddingToCart = false,
  linkPrefix = '/products',
  className = '',
  actionSlot,
}: ProductCardProps) {
  const isAvailable = product.status === 'ACTIVE' && product.quantity > 0;
  const primaryImage = product.images?.[0];

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/60 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <Link
        to={`${linkPrefix}/${product.id}`}
        className="block"
      >
        {/* Image */}
        <div className="h-52 bg-gradient-to-b from-slate-50 to-white relative flex items-center justify-center p-6 border-b border-slate-100">
          {primaryImage ? (
            <ImageFallback
              src={primaryImage.imageUrl}
              alt={product.name}
              className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              fallbackIconSize={48}
            />
          ) : (
            <ImageOff className="w-12 h-12 text-slate-300" />
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.quantity === 0 && <StatusBadge label="Out of Stock" variant="error" />}
            {product.quantity > 0 && product.quantity <= product.minQuantity && (
              <StatusBadge label="Low Stock" variant="warning" />
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`${linkPrefix}/${product.id}`}>
          <h3
            className="font-semibold text-slate-900 text-base line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-slate-900">
              <PriceText amount={product.price} />
            </span>

            {actionSlot ? (
              actionSlot
            ) : onAddToCart && isAvailable ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product.id);
                }}
                disabled={isAddingToCart}
                className="p-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-sm disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            ) : !isAvailable ? (
              <span className="text-xs font-medium text-slate-400">Unavailable</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
