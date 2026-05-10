import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'accent';
  children: ReactNode;
}

const variants = {
  default: 'bg-slate-800 text-slate-100',
  success: 'bg-emerald-500/15 text-emerald-300',
  warning: 'bg-amber-500/15 text-amber-300',
  accent: 'bg-violet-500/15 text-violet-300',
};

export const Badge = ({ variant = 'default', children }: BadgeProps) => (
  <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]', variants[variant])}>
    {children}
  </span>
);
