import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIconSize?: number;
}

export function ImageFallback({ fallbackIconSize = 24, className, alt, ...props }: ImageFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !props.src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        <ImageOff size={fallbackIconSize} className="opacity-50" />
      </div>
    );
  }

  return (
    <img
      {...props}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
