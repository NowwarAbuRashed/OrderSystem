import { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, icon }: Props) {
  return (
    <div className="text-center bg-white rounded-2xl border border-slate-200/60 p-12">
      <div className="flex justify-center">
        {icon || <PackageOpen className="mx-auto h-12 w-12 text-slate-300" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
