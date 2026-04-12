import { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="text-center bg-white rounded-lg border border-slate-200/60 p-12">
      <PackageOpen className="mx-auto h-12 w-12 text-slate-300" />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
