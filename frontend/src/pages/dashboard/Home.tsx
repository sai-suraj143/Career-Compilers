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
import { useAuthStore } from '../../store/authStore';
import { fetchChecklistRecent } from '../../services/checklist';
import { fetchBudgetSummary } from '../../services/budget';
import type { Analytics, ChecklistItem, Trip } from '../../types';

export const DashboardPage = () => {
  const setTrips = useTripStore((state) => state.setTrips);
  const trips = useTripStore((state) => state.trips);
  const setToast = useUiStore((state) => state.setToast);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);
  const [totalBudget, setTotalBudget] = useState(0);
  const [recentChecklist, setRecentChecklist] = useState<{ trip: Trip; items: ChecklistItem[] } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [tripsData, budgetData] = await Promise.all([
          fetchTrips(),
          user ? fetchBudgetSummary(user.id.toString()) : Promise.resolve({ totalBudget: 0 })
        ]);
        
        setTrips(tripsData);
        setTotalBudget(budgetData.totalBudget);

        if (user) {
          const checklist = await fetchChecklistRecent(user.id.toString());
          setRecentChecklist(checklist);
        }
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load dashboard' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setTrips, setToast, user]);


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
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="rounded-3xl bg-indigo-500/10 p-3 text-indigo-300">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total planned expenses across trips.</p>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Checklist</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                {recentChecklist ? `${recentChecklist.items.filter(i => i.packed).length}/${recentChecklist.items.length}` : '0/0'}
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-500/10 p-3 text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Packing progress for your latest trip.</p>
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
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent Trip Checklist</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
              {recentChecklist?.trip.title || 'No recent trip'}
            </h3>
          </div>
          <div className="space-y-4">
            {!recentChecklist || recentChecklist.items.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                No items in your latest trip checklist.
              </div>
            ) : (
              <div className="space-y-3">
                {recentChecklist.items.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/70 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.packed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-700'}`}>
                        {item.packed && <Sparkles className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`font-medium ${item.packed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{item.title}</span>
                    </div>
                  </div>
                ))}
                {recentChecklist.items.length > 5 && (
                  <Link to="/checklist" className="block text-center text-sm font-medium text-violet-400 hover:text-violet-300 pt-2">
                    View all {recentChecklist.items.length} items
                  </Link>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
