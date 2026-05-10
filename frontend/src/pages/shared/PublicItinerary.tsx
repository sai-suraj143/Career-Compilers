import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { copyTrip, fetchShareLink } from '../../services/sharing';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';

export const PublicItineraryPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [link, setLink] = useState('');
  const setToast = useUiStore((state) => state.setToast);

  useEffect(() => {
    const load = async () => {
      if (!tripId) return;
      try {
        const data = await fetchShareLink(tripId);
        setLink(data.link);
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load public itinerary' });
      }
    };
    load();
  }, [tripId, setToast]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setToast({ type: 'success', message: 'Link copied to clipboard' });
    } catch {
      setToast({ type: 'error', message: 'Unable to copy link' });
    }
  };

  const duplicateTrip = async () => {
    if (!tripId) return;
    try {
      await copyTrip(tripId);
      setToast({ type: 'success', message: 'Duplicate trip created' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to duplicate trip' });
    }
  };

  return (
    <div className="space-y-8 py-10">
      <PageHeader title="Shared itinerary" subtitle="Read-only preview of a public travel plan." />
      <div className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Preview</p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Trip details</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">Title</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Weekend in Tokyo</p>
            </div>
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">Description</p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">A dynamic public itinerary built for exploring nightlife, culture, and cuisine in Tokyo.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">Highlights</p>
              <ul className="mt-3 space-y-3 text-slate-700 dark:text-slate-300">
                <li>Shibuya crossing and evening lights</li>
                <li>Food tour in Asakusa</li>
                <li>Day trip to Mount Fuji</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Public link</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Share this itinerary</h3>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">URL</p>
            <div className="mt-3 rounded-3xl bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{link || 'Loading link...'}</div>
          </div>
          <div className="space-y-3">
            <Button className="w-full" onClick={copyToClipboard} disabled={!link}>Copy link</Button>
            <Button variant="secondary" className="w-full" onClick={duplicateTrip}>Copy trip</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
