import { useEffect, useState } from 'react';
import { ArrowRight, Compass, Sparkles, Wallet } from 'lucide-react';
import { fetchTrips } from '../../services/trips';
// import { fetchAnalytics } from '../../services/admin';
import { useTripStore } from '../../store/tripStore';
import { useUiStore } from '../../store/uiStore';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate, formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';
import type { Analytics } from '../../types';

export const DashboardPage = () => {
  const setTrips = useTripStore((state) => state.setTrips);
  const trips = useTripStore((state) => state.trips);
  const setToast = useUiStore((state) => state.setToast);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load dashboard' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setTrips, setToast]);

  const budgetSummary = trips.reduce((acc, trip) => acc + (trip.budget?.totalCost ?? 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Hello, planner" subtitle="The latest insights from your travel universe" actions={<Link to="/trips/new"><Button>Create trip</Button></Link>} />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trips</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{trips.length}</p>
            </div>
            <div className="rounded-3xl bg-violet-500/10 p-3 text-violet-300">
              <Compass className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Keep planning. Your next journey is waiting.</p>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Budget</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{formatCurrency(budgetSummary)}</p>
            </div>
            <div className="rounded-3xl bg-indigo-500/10 p-3 text-indigo-300">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">A quick pulse of your planning overhead.</p>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Highlights</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{analytics?.popularCities?.length ?? 0}</p>
            </div>
            <div className="rounded-3xl bg-fuchsia-500/10 p-3 text-fuchsia-300">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Top travel destinations recommended for you.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Recent trips</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Plan or continue your journey</h3>
            </div>
            <Link to="/trips" className="text-sm text-violet-300 hover:text-violet-200">View all</Link>
          </div>
          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-3xl bg-slate-100 dark:bg-slate-800/60" />
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">No trips found. Create your first trip to get started.</div>
          ) : (
            <div className="grid gap-4">
              {trips.slice(0, 3).map((trip) => (
                <div key={trip.id} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-5 transition hover:border-violet-400/30 hover:bg-white dark:bg-slate-900/90">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{trip.title}</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</p>
                    </div>
                    <span className="rounded-full bg-slate-900/5 dark:bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-700 dark:text-slate-300">{trip.visibility ?? 'PRIVATE'}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{trip.description || 'No description added yet.'}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Insights</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Popular destinations</h3>
          </div>
          <div className="space-y-4">
            {(analytics?.popularCities || ['Paris', 'Tokyo', 'Bali']).map((city) => (
              <div key={city} className="flex items-center justify-between rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/70 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{city}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Trending city for curated experiences</p>
                </div>
                <ArrowRight className="h-4 w-4 text-violet-300" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
