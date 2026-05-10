import { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { fetchAnalytics } from '../../services/admin';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/ui/Badge';
import type { Analytics } from '../../types';

export const AdminPage = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const setToast = useUiStore((state) => state.setToast);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setAnalytics(await fetchAnalytics());
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load analytics' });
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [setToast]);

  const activityData = analytics
    ? analytics.popularActivities.map((item, index) => ({ name: item, value: Math.max(5, 15 - index * 3) * 10 }))
    : [];

  return (
    <div className="space-y-8">
      <PageHeader title="Admin dashboard" subtitle="Executive metrics for your travel platform." />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Users</p>
          <p className="text-4xl font-semibold text-white">{loading ? '...' : analytics?.totalUsers}</p>
          <p className="text-sm text-slate-400">Active members and platform growth.</p>
        </Card>
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trips</p>
          <p className="text-4xl font-semibold text-white">{loading ? '...' : analytics?.totalTrips}</p>
          <p className="text-sm text-slate-400">Total planned trips across the network.</p>
        </Card>
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Top cities</p>
          <div className="mt-3 space-y-2">
            {(analytics?.popularCities || []).map((city) => (
              <Badge key={city} variant="accent">{city}</Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.7fr_0.7fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Demand snapshot</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Activity heatmap</h3>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip wrapperStyle={{ backgroundColor: '#111827', borderRadius: 20, border: '1px solid #334155' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Popular activities</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Trending plans</h3>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="h-14 rounded-3xl bg-slate-800/60" />)}
              </div>
            ) : (
              analytics?.popularActivities.map((activity) => (
                <div key={activity} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p className="font-semibold text-white">{activity}</p>
                  <p className="mt-1 text-sm text-slate-400">High engagement and top choice among users.</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
