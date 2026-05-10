import { Bell, LogOut, Menu, Search, Settings, UserCircle2 } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const toggle = useUiStore((state) => state.setSidebarOpen);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/login');
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-4 shadow-glow backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => toggle(true)}>
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
          <h2 className="text-lg font-semibold text-slate-100">{user?.name || 'Traveler'}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
          <UserCircle2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
