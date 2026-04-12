import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, leftIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium leading-6 text-slate-900 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={twMerge(
              clsx(
                "block w-full outline-none rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3 bg-white transition-all",
                error
                  ? "ring-red-300 focus:ring-red-500 pr-10 text-red-900 placeholder:text-red-300"
                  : "ring-slate-300 focus:ring-primary-600",
                leftIcon && "pl-10",
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
