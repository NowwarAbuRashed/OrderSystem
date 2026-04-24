import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { env } from '../../app/config/env';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIconSize?: number;
}

export function ImageFallback({ fallbackIconSize = 24, className, alt, ...props }: ImageFallbackProps) {
  const [hasError, setHasError] = useState(false);

  let finalSrc = props.src;
  if (finalSrc && finalSrc.startsWith('/uploads/')) {
    finalSrc = `${env.apiBaseUrl}${finalSrc}`;
  }

  if (hasError || !finalSrc) {
    return (
      <img
        {...props}
        src="/default-product.png"
        alt={alt || "Product placeholder"}
        className={className}
      />
    );
  }

  return (
    <img
      {...props}
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
