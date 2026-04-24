import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-white border-slate-200/60',
  success: 'bg-success-50 border-success-100',
  warning: 'bg-warning-50 border-warning-100',
  danger: 'bg-danger-50 border-danger-100',
  info: 'bg-info-50 border-info-100',
};

const iconBgStyles = {
  default: 'bg-primary-50 text-primary-600',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  danger: 'bg-danger-100 text-danger-600',
  info: 'bg-info-100 text-info-600',
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border p-5 shadow-sm transition-all hover:shadow-md',
          variantStyles[variant],
          className
        )
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && trendLabel && (
            <p className={clsx(
              'text-xs font-medium mt-2 flex items-center gap-1',
              trend === 'up' && 'text-success-600',
              trend === 'down' && 'text-danger-600',
              trend === 'neutral' && 'text-slate-500',
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className={clsx('p-2.5 rounded-xl flex-shrink-0', iconBgStyles[variant])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
