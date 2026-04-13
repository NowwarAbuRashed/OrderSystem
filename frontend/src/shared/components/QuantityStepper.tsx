import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  size = 'md',
}: QuantityStepperProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const sizeStyles = size === 'sm'
    ? 'h-8 gap-0'
    : 'h-10 gap-0';

  const btnSize = size === 'sm'
    ? 'w-8 h-8'
    : 'w-10 h-10';

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className={`inline-flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white ${sizeStyles}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        className={`${btnSize} flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </button>
      <span className="px-3 text-sm font-semibold text-slate-900 tabular-nums min-w-[2.5rem] text-center select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        className={`${btnSize} flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
