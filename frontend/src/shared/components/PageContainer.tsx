import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageContainer({ children, className = '', narrow = false }: PageContainerProps) {
  return (
    <div className={`w-full mx-auto ${narrow ? 'max-w-3xl' : 'max-w-7xl'} ${className}`}>
      {children}
    </div>
  );
}
