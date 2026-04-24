import { ReactNode } from 'react';

interface DetailListProps {
  items: { label: string; value: ReactNode }[];
  className?: string;
}

export function DetailList({ items, className = '' }: DetailListProps) {
  return (
    <dl className={`divide-y divide-slate-100 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex justify-between gap-4 py-3 text-sm">
          <dt className="text-slate-500 font-medium flex-shrink-0">{item.label}</dt>
          <dd className="text-slate-900 font-semibold text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
