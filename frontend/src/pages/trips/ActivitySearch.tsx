import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, MapPin, Clock, DollarSign, Activity as ActivityIcon, Compass } from 'lucide-react';
import { fetchTrip, fetchTrips } from '../../services/trips';
import { searchActivities, createActivity, deleteActivity } from '../../services/activities';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/format';
import type { Activity, Trip } from '../../types';

const schema = z.object({
  query: z.string(),
  stopId: z.string().min(1, { message: 'Select a destination stop' }),
});

type ActivityForm = z.infer<typeof schema>;

export const ActivitySearchPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<string>('');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [results, setResults] = useState<Activity[]>([]);
  const [addedActivities, setAddedActivities] = useState<Activity[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const setToast = useUiStore((state) => state.setToast);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ActivityForm>({ 
    resolver: zodResolver(schema), 
    defaultValues: { query: '', stopId: '' } 
  });

  const selectedStopId = watch('stopId');

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const allTrips = await fetchTrips();
        setTrips(allTrips);
        if (allTrips.length > 0) setTripId(allTrips[0].id);
      } catch (error: any) {
        setToast({ type: 'error', message: error.message || 'Unable to load trips' });
      }
    };
    loadTrips();
  }, [setToast]);

  const loadTrip = async (id: string) => {
    try {
      const data = await fetchTrip(id);
      setTrip(data);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message || 'Unable to load trip details' });
    }
  };

  useEffect(() => {
    if (tripId) loadTrip(tripId);
  }, [tripId]);

  useEffect(() => {
    if (!trip || !selectedStopId) {
      setAddedActivities([]);
      setResults([]);
      return;
    }
    const stop = trip.stops?.find((s) => s.id === selectedStopId);
    if (stop && stop.activities) {
      setAddedActivities(stop.activities);
    } else {
      setAddedActivities([]);
    }
    
    // Auto-search recommendations when a stop is selected
    handleSearch({ query: '', stopId: selectedStopId });
  }, [trip, selectedStopId]);

  const stops = useMemo(() => trip?.stops ?? [], [trip]);

  const handleSearch = async (values: ActivityForm) => {
    if (!values.stopId) return;
    try {
      setSearching(true);
      const data = await searchActivities(values.query, values.stopId);
      setResults(data);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message || 'Unable to search activities' });
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
      setAddingId(activity.id);
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
      setAddedActivities((current) => [...current, created]);
      setToast({ type: 'success', message: 'Activity added to itinerary' });
      loadTrip(trip.id);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message || 'Unable to add activity' });
    } finally {
      setAddingId(null);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteActivity(id);
      setAddedActivities((current) => current.filter((activity) => activity.id !== id));
      setToast({ type: 'success', message: 'Activity removed' });
      if (trip) loadTrip(trip.id);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message || 'Unable to remove activity' });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Experience Planner" subtitle="Discover and curate unforgettable activities for your journey." />

      <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-950 shadow-sm">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Where are you heading?</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Trip</label>
              <select
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
              >
                {trips.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Destination</label>
              <select
                {...register('stopId')}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
              >
                <option value="">Choose a stop...</option>
                {stops.map((stop) => (
                  <option key={stop.id} value={stop.id}>{stop.cityName}, {stop.country}</option>
                ))}
              </select>
              {errors.stopId && <p className="text-xs text-rose-500 font-medium">{errors.stopId.message}</p>}
            </div>

            <form className="space-y-2" onSubmit={handleSubmit(handleSearch)}>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Find Activities</label>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                <input
                  {...register('query')}
                  placeholder="e.g. food tour, temple, hiking..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-11 pr-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                />
                <button 
                  type="submit" 
                  disabled={searching}
                  className="absolute right-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {searching ? '...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Curated Experiences</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Recommendations based on your destination</p>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {results.length} found
            </div>
          </div>

          {!selectedStopId ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
              <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select a destination</h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">Choose a trip and a stop above to discover amazing things to do.</p>
            </div>
          ) : searching ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-4 p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/50">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
             <div className="text-center py-12 text-slate-500">No experiences found. Try another search.</div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {results.map((activity, index) => {
                  const isAdded = addedActivities.some(a => a.title === activity.title);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex flex-col sm:flex-row gap-5 p-5 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isAdded ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/50 dark:bg-indigo-900/10' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'} `}
                    >
                      <div className="hidden sm:flex shrink-0 items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-600 dark:text-indigo-400">
                        <ActivityIcon className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
                            {activity.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1.5">{activity.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {activity.description || 'Enjoy a wonderful experience tailored for your trip.'}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span>{formatCurrency(activity.cost)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-sky-500" />
                            <span>{activity.duration} mins</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center sm:pl-4 sm:border-l border-slate-100 dark:border-slate-800">
                        <Button 
                          disabled={!selectedStopId || addingId === activity.id || isAdded} 
                          onClick={() => addActivity(activity, selectedStopId)}
                          className={`w-full sm:w-auto rounded-xl shadow-sm ${isAdded ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : ''}`}
                        >
                          {addingId === activity.id ? 'Adding...' : isAdded ? 'Added' : <><Plus className="w-4 h-4 mr-1.5" /> Add</>}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="sticky top-8">
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Planned Itinerary</span>
                  <span className="text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">{addedActivities.length}</span>
                </h3>
              </div>
              
              <div className="p-6 min-h-[300px]">
                {addedActivities.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60 py-10">
                    <ActivityIcon className="w-10 h-10 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-500 font-medium">No activities planned yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Start adding experiences from the left.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {addedActivities.map((activity) => (
                        <motion.div 
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group relative bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                        >
                          <button 
                            onClick={() => remove(activity.id)}
                            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{activity.category}</p>
                          <p className="font-bold text-slate-900 dark:text-white pr-8 mb-3 leading-tight">{activity.title}</p>
                          
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              <DollarSign className="w-3 h-3 text-emerald-500" /> {formatCurrency(activity.cost)}
                            </span>
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              <Clock className="w-3 h-3 text-sky-500" /> {activity.duration || 60}m
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center px-1">
                      <span className="text-sm font-semibold text-slate-500">Total Est. Cost</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(addedActivities.reduce((acc, act) => acc + act.cost, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
