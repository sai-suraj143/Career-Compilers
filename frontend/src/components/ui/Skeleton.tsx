import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export const Skeleton = ({ className, children }: SkeletonProps) => {
  return (
    <div className={cn('animate-pulse rounded-3xl bg-slate-800/60', className)}>
      {children}
    </div>
  );
};
