import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ListChecks, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchTrip, fetchTrips } from '../../services/trips';
import { createStop, removeStop, reorderStops, updateStop } from '../../services/itinerary';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/common/PageHeader';
import { formatDate } from '../../utils/format';
import type { Stop, Trip } from '../../types';

const schema = z.object({
  cityName: z.string().min(2, { message: 'Enter a city name' }),
  country: z.string().min(2, { message: 'Enter a country' }),
  arrivalDate: z.string().min(1, { message: 'Select arrival date' }),
  departureDate: z.string().min(1, { message: 'Select departure date' }),
});

type StopForm = z.infer<typeof schema>;

export const ItineraryPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<string>('');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const setToast = useUiStore((state) => state.setToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StopForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const load = async () => {
      try {
        const allTrips = await fetchTrips();
        setTrips(allTrips);
        const selected = allTrips[0]?.id ?? '';
        setTripId(selected);
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load trips' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setToast]);

  useEffect(() => {
    if (!tripId) {
      setTrip(null);
      return;
    }
    const loadTrip = async () => {
      try {
        const result = await fetchTrip(tripId);
        setTrip(result);
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load itinerary' });
      }
    };
    loadTrip();
  }, [tripId, setToast]);

  const stops = useMemo(() => (trip?.stops ? [...trip.stops].sort((a, b) => a.orderIndex - b.orderIndex) : []), [trip]);

  const onSubmit = async (values: StopForm) => {
    if (!trip) {
      setToast({ type: 'error', message: 'Select a trip first' });
      return;
    }
    try {
      await createStop({
        tripId: trip.id,
        cityName: values.cityName,
        country: values.country,
        arrivalDate: values.arrivalDate,
        departureDate: values.departureDate,
        orderIndex: stops.length + 1,
      });
      const updated = await fetchTrip(trip.id);
      setTrip(updated);
      reset();
      setToast({ type: 'success', message: 'Stop added to itinerary' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to add stop' });
    }
  };

  const moveStop = async (stop: Stop, direction: 'up' | 'down') => {
    if (!trip) return;
    const index = stops.findIndex((item) => item.id === stop.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const targetStop = stops[targetIndex];
    const updatedStops = stops.map((item) => {
      if (item.id === stop.id) return { ...item, orderIndex: targetStop.orderIndex };
      if (item.id === targetStop.id) return { ...item, orderIndex: stop.orderIndex };
      return item;
    });
    try {
      await reorderStops(updatedStops.map((item) => ({ id: item.id, orderIndex: item.orderIndex })));
      const updated = await fetchTrip(trip.id);
      setTrip(updated);
      setToast({ type: 'success', message: 'Itinerary reordered' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to reorder stops' });
    }
  };

  const remove = async (id: string) => {
    if (!trip) return;
    try {
      await removeStop(id);
      const updated = await fetchTrip(trip.id);
      setTrip(updated);
      setToast({ type: 'success', message: 'Stop removed' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to remove stop' });
    }
  };

  if (loading) {
    return <div className="grid gap-6">{Array.from({ length: 4 }).map((_, idx) => <Card key={idx} className="h-32" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Itinerary builder" subtitle="Build your route with stops and manage order in one place." />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trip selector</p>
              <p className="mt-2 text-lg font-semibold text-white">Choose a trip to edit stops</p>
            </div>
            <select
              value={tripId}
              onChange={(event) => setTripId(event.target.value)}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {trips.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>
          {trip ? (
            <div className="space-y-4">
              {stops.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">Add stops to begin building your route.</div>
              ) : (
                <div className="space-y-4">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{stop.cityName}, {stop.country}</p>
                          <p className="mt-2 text-sm text-slate-400">{formatDate(stop.arrivalDate)} — {formatDate(stop.departureDate)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => moveStop(stop, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => moveStop(stop, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => remove(stop.id)}><Trash2 className="h-4 w-4 text-rose-400" /></Button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-400">Stop {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">No trip selected. Create a trip to start your itinerary.</div>
          )}
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3 text-white">
            <div className="rounded-3xl bg-indigo-500/10 p-3 text-indigo-300"><ListChecks className="h-5 w-5" /></div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Add stop</p>
              <h3 className="text-lg font-semibold">Create a new destination</h3>
            </div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="City" placeholder="Barcelona" {...register('cityName')} error={errors.cityName?.message} />
            <Input label="Country" placeholder="Spain" {...register('country')} error={errors.country?.message} />
            <Input label="Arrival" type="date" {...register('arrivalDate')} error={errors.arrivalDate?.message} />
            <Input label="Departure" type="date" {...register('departureDate')} error={errors.departureDate?.message} />
            <Button type="submit" className="w-full"><Plus className="mr-2 h-4 w-4" />Add stop</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
