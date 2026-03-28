import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-semibold text-[var(--text-muted)] ml-2 transition-colors">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "neu-input",
            error && "ring-2 ring-red-500/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium ml-2">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
