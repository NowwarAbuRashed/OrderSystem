import { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  className?: string;
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
  className = '',
}: TableToolbarProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      {onSearchChange !== undefined && (
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all bg-white"
          />
        </div>
      )}
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
