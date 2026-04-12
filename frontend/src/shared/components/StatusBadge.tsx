import clsx from 'clsx';

type Props = {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
};

export function StatusBadge({ label, variant }: Props) {
  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      variant === 'success' && "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      variant === 'warning' && "bg-amber-50 text-amber-700 border-amber-200/60",
      variant === 'error' && "bg-red-50 text-red-700 border-red-200/60",
      variant === 'info' && "bg-primary-50 text-primary-700 border-primary-200/60",
      variant === 'default' && "bg-slate-50 text-slate-700 border-slate-200/60"
    )}>
      {label}
    </span>
  );
}
