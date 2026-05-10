import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords must match',
});

type SignupForm = z.infer<typeof schema>;

export const SignupPage = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const setToast = useUiStore((state) => state.setToast);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: SignupForm) => {
    try {
      setLoading(true);
      const user = await signup({ name: values.name, email: values.email, password: values.password });
      setAuth(user, 'static-token-placeholder');
      setToast({ type: 'success', message: 'Sign up successful' });
      navigate('/');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Signup failed');
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-8 shadow-glow backdrop-blur-xl md:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Create your Traveloop account</h2>
        <p className="mt-3 text-sm text-slate-400">Build a premium planning workspace for your next adventures.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full name" type="text" placeholder="Avery Taylor" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" placeholder="name@traveloop.com" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="Create a secure password" {...register('password')} error={errors.password?.message} />
        <Input label="Confirm password" type="password" placeholder="Repeat password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered? <Link to="/auth/login" className="text-violet-300 hover:text-violet-200">Log in</Link>
      </p>
    </div>
  );
};
