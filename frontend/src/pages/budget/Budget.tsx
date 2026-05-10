import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchBudget, updateBudget } from '../../services/budget';
import { fetchTrips } from '../../services/trips';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '../../utils/format';
import type { Budget, Trip } from '../../types';

const schema = z.object({
  transportCost: z.coerce.number().min(0),
  stayCost: z.coerce.number().min(0),
  foodCost: z.coerce.number().min(0),
  activityCost: z.coerce.number().min(0),
});

type BudgetForm = z.infer<typeof schema>;

export const BudgetPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState('');
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const setToast = useUiStore((state) => state.setToast);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BudgetForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const allTrips = await fetchTrips();
        setTrips(allTrips);
        if (allTrips[0]) {
          setTripId(allTrips[0].id);
        }
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load budget data' });
      }
    };
    loadTrips();
  }, [setToast]);

  useEffect(() => {
    const loadBudget = async () => {
      if (!tripId) return;
      try {
        const data = await fetchBudget(tripId);
        setBudget(data);
        reset(data);
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load budget' });
      } finally {
        setLoading(false);
      }
    };
    loadBudget();
  }, [tripId, reset, setToast]);

  const onSubmit = async (values: BudgetForm) => {
    if (!tripId) return;
    try {
      const updated = await updateBudget(tripId, values);
      setBudget(updated);
      setToast({ type: 'success', message: 'Budget updated' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to update budget' });
    }
  };

  const data = budget
    ? [
        { name: 'Transport', value: budget.transportCost },
        { name: 'Stay', value: budget.stayCost },
        { name: 'Food', value: budget.foodCost },
        { name: 'Activities', value: budget.activityCost },
      ]
    : [];

  const COLORS = ['#7c3aed', '#2563eb', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-8">
      <PageHeader title="Budget" subtitle="Track spending across all your trips." />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.6fr]">
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trip budget</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Manage your cost projections.</h3>
            </div>
            <select
              value={tripId}
              onChange={(event) => setTripId(event.target.value)}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {trips.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800/60" />
          ) : budget ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total cost</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">{formatCurrency(budget.totalCost)}</p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Daily average based on planned transport, stay, food, and activities.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                      {data.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">Budget not configured. Create a trip or set values to initialize.</div>
          )}
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Expense breakdown</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Update your spending assumptions</h3>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Transport" type="number" step="10" {...register('transportCost')} error={errors.transportCost?.message} />
            <Input label="Stay" type="number" step="10" {...register('stayCost')} error={errors.stayCost?.message} />
            <Input label="Food" type="number" step="10" {...register('foodCost')} error={errors.foodCost?.message} />
            <Input label="Activities" type="number" step="10" {...register('activityCost')} error={errors.activityCost?.message} />
            <Button type="submit" className="w-full">Update budget</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
