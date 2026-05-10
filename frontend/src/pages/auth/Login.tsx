import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useUiStore } from '../../store/uiStore';

const schema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginForm = z.infer<typeof schema>;

export const LoginPage = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.loading);
  const setToast = useUiStore((state) => state.setToast);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    setError(null);
  }, [setError]);

  const onSubmit = async (values: LoginForm) => {
    try {
      setLoading(true);
      const data = await login(values);
      setAuth(data.user, data.token);
      setToast({ type: 'success', message: 'Logged in successfully' });
      navigate('/');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unable to login');
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-8 shadow-glow backdrop-blur-xl md:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Sign in to your account</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Manage your trips, itinerary, budgets, and memories with one premium dashboard.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="name@traveloop.com" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="Enter your password" {...register('password')} error={errors.password?.message} />
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <Link to="/auth/forgot-password" className="text-violet-300 hover:text-violet-200">Forgot password?</Link>
          {authError && <span className="text-rose-400">{authError}</span>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Continue'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New to Traveloop? <Link to="/auth/signup" className="text-violet-300 hover:text-violet-200">Create an account</Link>
      </p>
    </div>
  );
};
