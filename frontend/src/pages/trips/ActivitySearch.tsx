import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchTrip, fetchTrips } from '../../services/trips';
import { searchActivities, createActivity, deleteActivity } from '../../services/activities';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/common/PageHeader';
import { formatDate, formatCurrency } from '../../utils/format';
import type { Activity, Stop, Trip } from '../../types';

const schema = z.object({
  query: z.string().min(1, { message: 'Search for activities' }),
  stopId: z.string().min(1, { message: 'Select a stop' }),
});

type ActivityForm = z.infer<typeof schema>;

export const ActivitySearchPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<string>('');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [results, setResults] = useState<Activity[]>([]);
  const [addedActivities, setAddedActivities] = useState<Activity[]>([]);
  const [searching, setSearching] = useState(false);
  const setToast = useUiStore((state) => state.setToast);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ActivityForm>({ resolver: zodResolver(schema), defaultValues: { query: '', stopId: '' } });

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

  useEffect(() => {
    if (!tripId) return;
    const loadTrip = async () => {
      try {
        setTrip(await fetchTrip(tripId));
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load activities' });
      }
    };
    loadTrip();
  }, [tripId, setToast]);

  const stops = useMemo(() => trip?.stops ?? [], [trip]);

  const handleSearch = async (values: ActivityForm) => {
    try {
      setSearching(true);
      const data = await searchActivities(values.query);
      setResults(data);
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to search activities' });
    } finally {
      setSearching(false);
    }
  };

  const addActivity = async (activity: Activity, stopId: string) => {
    if (!trip) {
      setToast({ type: 'error', message: 'Select a trip first' });
      return;
    }
    try {
      const created = await createActivity({
        tripId: trip.id,
        stopId,
        title: activity.title,
        category: activity.category,
        cost: activity.cost,
        duration: activity.duration ?? 60,
        activityDate: activity.activityDate,
        description: activity.description,
        imageUrl: activity.imageUrl,
      });
      setAddedActivities((current) => [created, ...current]);
      setToast({ type: 'success', message: 'Activity added to itinerary' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to add activity' });
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteActivity(id);
      setAddedActivities((current) => current.filter((activity) => activity.id !== id));
      setToast({ type: 'success', message: 'Activity removed' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to remove activity' });
    }
  };

  const selectedStopId = watch('stopId');

  return (
    <div className="space-y-8">
      <PageHeader title="Activity search" subtitle="Discover experiences and attach them to trip stops." />

      <Card className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_0.6fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trip</p>
            <select
              value={tripId}
              onChange={(event) => setTripId(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {trips.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Stop</p>
            <select
              {...register('stopId')}
              className="mt-3 w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Select a stop</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>{stop.cityName}, {stop.country}</option>
              ))}
            </select>
            {errors.stopId ? <p className="mt-2 text-xs text-rose-400">{errors.stopId.message}</p> : null}
          </div>
        </div>

        <form className="grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit(handleSearch)}>
          <Input label="Search activities" placeholder="food tour, hiking, museum" {...register('query')} error={errors.query?.message} />
          <Button type="submit" className="mt-6 h-fit" disabled={searching}>Search</Button>
        </form>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Search results</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Find experiences for your route.</h3>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{results.length} results</span>
          </div>
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">Search for activities to begin.</div>
          ) : (
            <div className="space-y-4">
              {results.map((activity) => (
                <div key={activity.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{activity.category} • {formatCurrency(activity.cost)}</p>
                    <p className="mt-2 text-sm text-slate-500">{activity.description || 'No description provided.'}</p>
                  </div>
                  <Button disabled={!selectedStopId} onClick={() => addActivity(activity, selectedStopId)}>
                    Add to stop
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Added activities</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Your itinerary experiences</h3>
          </div>
          {addedActivities.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">Added activities will appear here.</div>
          ) : (
            <div className="space-y-4">
              {addedActivities.map((activity) => (
                <div key={activity.id} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activity.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{formatCurrency(activity.cost)}</span>
                      <Button variant="ghost" size="sm" onClick={() => remove(activity.id)}>Remove</Button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Scheduled for {formatDate(activity.activityDate)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
