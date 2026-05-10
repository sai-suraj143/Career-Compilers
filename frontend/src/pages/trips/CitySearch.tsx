import { useState } from 'react';
import { Search, Globe, Filter } from 'lucide-react';
import { searchCities } from '../../services/cities';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/common/PageHeader';

export const CitySearchPage = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<{ name: string; country: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const setToast = useUiStore((state) => state.setToast);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchCities(query);
      setCities(results);
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to search cities' });
    } finally {
      setLoading(false);
    }
  };

  const options = ['All', 'France', 'Japan', 'USA'];
  const filtered = selectedCountry === 'All' ? cities : cities.filter((item) => item.country === selectedCountry);

  return (
    <div className="space-y-8">
      <PageHeader title="City search" subtitle="Explore recommended destinations and filter by country." />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.6fr]">
        <Card className="space-y-6">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="rounded-3xl bg-indigo-500/10 p-3 text-indigo-300"><Globe className="h-5 w-5" /></div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Search cities</p>
              <h3 className="text-xl font-semibold">Find travel hotspots.</h3>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Input
              label="Destination"
              placeholder="Begin typing a destination"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button onClick={handleSearch} disabled={loading}>Search</Button>
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
            <Filter className="h-4 w-4" />
            <select className="bg-transparent outline-none" value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)}>
              {options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Explorer</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Available cities</h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="h-14 rounded-3xl bg-slate-100 dark:bg-slate-800/60" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">Search a destination to see city suggestions.</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((city) => (
                <div key={city.name} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{city.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{city.country}</p>
                    </div>
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-violet-300">Popular</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
