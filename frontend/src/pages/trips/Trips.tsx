import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchTrips, deleteTrip, updateTrip } from '../../services/trips';
import { useTripStore } from '../../store/tripStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { formatDate } from '../../utils/format';
import type { Trip } from '../../types';

const schema = z.object({
  title: z.string().min(2, { message: 'Title is required' }),
  description: z.string().optional(),
  startDate: z.string().min(1, { message: 'Select a start date' }),
  endDate: z.string().min(1, { message: 'Select an end date' }),
  coverImage: z.string().url().optional(),
});

type TripForm = z.infer<typeof schema>;

export const TripsPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const setTrips = useTripStore((state) => state.setTrips);
  const trips = useTripStore((state) => state.trips);
  const [loading, setLoading] = useState(true);
  const setToast = useUiStore((state) => state.setToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load trips' });
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [setTrips, setToast]);

  const filteredTrips = useMemo(
    () => trips.filter((trip) => trip.title.toLowerCase().includes(query.toLowerCase()) || trip.description?.toLowerCase().includes(query.toLowerCase())),
    [query, trips]
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteTrip(id);
      setTrips(trips.filter((trip) => trip.id !== id));
      setToast({ type: 'success', message: 'Trip deleted successfully' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to delete trip' });
    }
  };

  const onSubmit = async (values: TripForm) => {
    if (!selectedTrip) return;
    try {
      const updated = await updateTrip(selectedTrip.id, values);
      const nextTrips = trips.map((trip) => (trip.id === updated.id ? updated : trip));
      setTrips(nextTrips);
      setSelectedTrip(updated);
      setToast({ type: 'success', message: 'Trip updated successfully' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to update trip' });
    }
  };

  const openEditor = (trip: Trip) => {
    setSelectedTrip(trip);
    reset({
      title: trip.title,
      description: trip.description ?? '',
      startDate: trip.startDate.slice(0, 10),
      endDate: trip.endDate.slice(0, 10),
      coverImage: trip.coverImage ?? '',
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Trips" subtitle="Manage all your travel plans in one place." actions={<Button onClick={() => navigate('/trips/new')}><Plus className="mr-2 h-4 w-4" />New trip</Button>} />

      <Card className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trip inventory</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Search and refine your travel library.</h3>
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search trips"
              className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-24 rounded-3xl bg-slate-800/60" />
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center text-slate-400">No trips match your search. Create a new trip to begin planning.</div>
        ) : (
          <div className="grid gap-4">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="group rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:border-violet-400/30 hover:bg-slate-900/90">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{trip.title}</p>
                    <p className="mt-2 text-sm text-slate-400">{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.25em]">{trip.visibility ?? 'PRIVATE'}</span>
                    <Button variant="ghost" size="sm" onClick={() => openEditor(trip)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(trip.id)}>
                      <Trash2 className="h-4 w-4 text-rose-400" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{trip.description || 'No description available.'}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedTrip ? (
        <Card className="rounded-[32px] border-white/10 bg-slate-950/90 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Edit trip</h3>
              <p className="text-sm text-slate-400">Adjust your trip details and preserve your planning flow.</p>
            </div>
            <Button variant="secondary" onClick={() => setSelectedTrip(null)}>Close</Button>
          </div>
          <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Title" {...register('title')} error={errors.title?.message} />
            <Input label="Cover image URL" {...register('coverImage')} error={errors.coverImage?.message} />
            <Input label="Start date" type="date" {...register('startDate')} error={errors.startDate?.message} />
            <Input label="End date" type="date" {...register('endDate')} error={errors.endDate?.message} />
            <div className="lg:col-span-2">
              <Input label="Description" {...register('description')} error={errors.description?.message} />
            </div>
            <div className="lg:col-span-2 flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
};
