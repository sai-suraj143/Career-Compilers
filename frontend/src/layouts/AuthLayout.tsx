import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 p-8 shadow-glow backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <span className="text-xs uppercase tracking-[0.32em] text-violet-300/80">Traveloop</span>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Your travel planning command center</h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-slate-400">Secure your journey with elegant tools for trips, itinerary, budgets, and journal planning.</p>
        </div>
        <Outlet />
        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:justify-between">
          <p>Need an account? <Link to="/auth/signup" className="text-violet-300 hover:text-violet-200">Sign up</Link></p>
          <p>Forgot password? <Link to="/auth/forgot-password" className="text-violet-300 hover:text-violet-200">Reset it</Link></p>
        </div>
      </div>
    </div>
  );
};
