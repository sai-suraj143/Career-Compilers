import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { fetchTrips } from '../../services/trips';
import { addChecklistItem, deleteChecklistItem, updateChecklistItem } from '../../services/checklist';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/common/PageHeader';
import type { ChecklistItem, Trip } from '../../types';

const schema = z.object({
  itemName: z.string().min(2, { message: 'Add an item name' }),
  category: z.string().optional(),
});

type ChecklistForm = z.infer<typeof schema>;

export const ChecklistPage = () => {
  const user = useAuthStore((state) => state.user);
  const setToast = useUiStore((state) => state.setToast);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChecklistForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const allTrips = await fetchTrips();
        setTrips(allTrips);
        setTripId(allTrips[0]?.id ?? '');
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load trips' });
      }
    };
    loadTrips();
  }, [setToast]);

  const onSubmit = async (values: ChecklistForm) => {
    if (!user) {
      setToast({ type: 'error', message: 'Please log in to create checklist items.' });
      return;
    }

    if (!tripId) {
      setToast({ type: 'error', message: 'Select a trip to attach checklist items.' });
      return;
    }
    try {
      const item = await addChecklistItem({ tripId, userId: user.id, itemName: values.itemName, category: values.category, isPacked: false });
      setItems((current) => [item, ...current]);
      reset();
      setToast({ type: 'success', message: 'Item added.' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to add item' });
    }
  };

  const togglePacked = async (item: ChecklistItem) => {
    try {
      const updated = await updateChecklistItem(item.id, { isPacked: !item.isPacked });
      setItems((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setToast({ type: 'success', message: 'Checklist updated.' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to update item' });
    }
  };

  const removeItem = async (id: string) => {
    try {
      await deleteChecklistItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setToast({ type: 'success', message: 'Item removed.' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to delete item' });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Checklist" subtitle="Pack smarter for your next adventure." />

      <Card className="space-y-6">
        <div>
          <label className="block text-sm text-slate-800 dark:text-slate-200">
            <span className="mb-2 inline-block font-medium text-slate-700 dark:text-slate-300">Trip</span>
            <select
              value={tripId}
              onChange={(event) => setTripId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Select a trip</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>{trip.title}</option>
              ))}
            </select>
          </label>
        </div>
        <form className="grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Item name" placeholder="Passport, chargers, sunscreen" {...register('itemName')} error={errors.itemName?.message} />
          <Input label="Category" placeholder="Documents, Gear, Essentials" {...register('category')} error={errors.category?.message} />
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit">Add item</Button>
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Packing list</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Stay organized before departure.</h3>
        </div>
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">Add items to build your packing list.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.itemName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.category || 'General'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={item.isPacked ? 'secondary' : 'ghost'} size="sm" onClick={() => togglePacked(item)}>
                    {item.isPacked ? 'Packed' : 'Mark packed'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
