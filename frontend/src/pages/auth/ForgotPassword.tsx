import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/auth';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const schema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }),
});

type ForgotForm = z.infer<typeof schema>;

export const ForgotPasswordPage = () => {
  const setToast = useUiStore((state) => state.setToast);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: ForgotForm) => {
    try {
      await forgotPassword(values.email);
      setToast({ type: 'success', message: 'Password reset link sent to your email' });
      navigate('/auth/login');
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to send reset link' });
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-8 shadow-glow backdrop-blur-xl md:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Reset your password</h2>
        <p className="mt-3 text-sm text-slate-400">Enter the email address associated with your account.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="name@traveloop.com" {...register('email')} error={errors.email?.message} />
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>
    </div>
  );
};
