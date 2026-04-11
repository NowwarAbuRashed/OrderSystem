import clsx from 'clsx';

type Props = {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
};

export function StatusBadge({ label, variant }: Props) {
  return (
    <span className={clsx(
      "px-2.5 py-0.5 rounded-full text-xs font-medium",
      variant === 'success' && "bg-green-100 text-green-800",
      variant === 'warning' && "bg-yellow-100 text-yellow-800",
      variant === 'error' && "bg-red-100 text-red-800",
      variant === 'info' && "bg-blue-100 text-blue-800",
      variant === 'default' && "bg-slate-100 text-slate-800"
    )}>
      {label}
    </span>
  );
}
