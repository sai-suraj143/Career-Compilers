import { Bell, LogOut, Menu, Search, Sun, Moon, UserCircle2 } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const toggle = useUiStore((state) => state.setSidebarOpen);
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 px-5 py-4 shadow-sm dark:shadow-glow backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => toggle(true)} className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'Traveler'}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
          <UserCircle2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 text-rose-500" />
        </Button>
      </div>
    </div>
  );
};
