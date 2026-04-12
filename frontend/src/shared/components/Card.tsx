import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(
        clsx("rounded-xl border border-slate-200/60 bg-white text-slate-950 shadow-sm", className)
      )}
      {...props}
    />
  )
);
Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(clsx("flex flex-col space-y-1.5 p-6", className))}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={twMerge(clsx("text-lg font-semibold leading-none tracking-tight", className))}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={twMerge(clsx("text-sm text-slate-500", className))}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={twMerge(clsx("p-6 pt-0", className))} {...props} />
  )
);
CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(clsx("flex items-center p-6 pt-0", className))}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter"
