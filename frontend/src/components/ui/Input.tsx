import { forwardRef, type ForwardedRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputComponent = ({ className, label, error, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <label className="block text-sm text-slate-800 dark:text-slate-200">
      {label && <span className="mb-2 inline-block font-medium text-slate-700 dark:text-slate-300">{label}</span>}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          error && 'border-rose-500 focus:border-rose-400 focus:ring-rose-500/20',
          className
        )}
        {...props}
      />
      {error && <span className="mt-2 block text-xs text-rose-400">{error}</span>}
    </label>
  );
};

export const Input = forwardRef<HTMLInputElement, InputProps>(InputComponent);
Input.displayName = 'Input';
