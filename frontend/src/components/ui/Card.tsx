import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children?: ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div className={cn('rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl', className)}>
      {children}
    </div>
  );
};
