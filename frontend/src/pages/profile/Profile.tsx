import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchProfile, updateProfile } from '../../services/users';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
});

type ProfileForm = z.infer<typeof schema>;

export const ProfilePage = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);
  const setToast = useUiStore((state) => state.setToast);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        reset(profile);
        setAuth(profile, 'static-token-placeholder');
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load profile' });
      }
    };
    loadProfile();
  }, [reset, setAuth, setToast]);

  const onSubmit = async (values: ProfileForm) => {
    try {
      const updated = await updateProfile(values);
      setAuth(updated, 'static-token-placeholder');
      setToast({ type: 'success', message: 'Profile updated' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to update profile' });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Profile settings" subtitle="Review and update your account preferences." />
      <Card>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Personal</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Account details</h3>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
            Saved destinations: <span className="font-semibold text-white">{user?.name ?? 'Traveler'}</span>
          </div>
        </div>
        <form className="grid gap-6 max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full name" defaultValue={user?.name ?? ''} {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" defaultValue={user?.email ?? ''} {...register('email')} error={errors.email?.message} />
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
