import { LucideIcon, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  action?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, action }: EmptyStateProps) => (
  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center shadow-glow backdrop-blur-xl">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
      <Sparkles className="h-8 w-8" />
    </div>
    <h3 className="mt-6 text-xl font-semibold text-slate-100">{title}</h3>
    <p className="mt-3 text-sm text-slate-400">{description}</p>
    {action && actionLabel ? (
      <div className="mt-6 flex justify-center">
        <Button onClick={action}>{actionLabel}</Button>
      </div>
    ) : null}
  </div>
);
