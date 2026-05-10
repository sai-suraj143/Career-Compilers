import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { Toast } from '../components/common/Toast';

export const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_20%),linear-gradient(180deg,_rgba(15,23,42,0.96)_0%,_rgba(15,23,42,0.94)_100%)] p-5 md:p-8 lg:p-10">
          <div className="mx-auto max-w-screen-2xl space-y-6">
            <Navbar />
            <Outlet />
          </div>
        </main>
      </div>
      <Toast />
    </div>
  );
};
