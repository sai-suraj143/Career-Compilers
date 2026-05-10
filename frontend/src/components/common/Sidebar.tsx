import { LayoutDashboard, MapPin, Notebook, Percent, Settings2, Sparkles, ShieldCheck, Tag, Compass } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Trips', path: '/trips', icon: Compass },
  { label: 'Itinerary', path: '/itinerary', icon: MapPin },
  { label: 'Activities', path: '/activities', icon: Sparkles },
  { label: 'Budget', path: '/budget', icon: Percent },
  { label: 'Checklist', path: '/checklist', icon: ShieldCheck },
  { label: 'Notes', path: '/notes', icon: Notebook },
  { label: 'Analytics', path: '/admin', icon: Tag },
  { label: 'Profile', path: '/profile', icon: Settings2 },
];

export const Sidebar = () => {
  const close = useUiStore((state) => state.setSidebarOpen);
  const isOpen = useUiStore((state) => state.sidebarOpen);

  return (
    <aside className={isOpen ? 'fixed inset-0 z-40 bg-slate-950/70 lg:static lg:block' : 'hidden lg:block'}>
      <div className="flex h-full min-h-screen w-full max-w-xs flex-col gap-6 border-r border-white/10 bg-slate-950/95 px-5 py-6 shadow-glow backdrop-blur-xl lg:sticky lg:top-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">Traveloop</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Planner</h1>
          </div>
          {isOpen && (
            <button onClick={() => close(false)} className="rounded-full bg-white/5 p-2 text-slate-200 transition hover:bg-white/10">
              ✕
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => close(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-white shadow-glow' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-100">Quick tip</p>
          <p className="mt-2 text-sm leading-6">Use the itinerary module to sync stops and activities in one trip flow.</p>
        </div>
      </div>
    </aside>
  );
};
