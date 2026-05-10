import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTrip } from '../../services/trips';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { PageHeader } from '../../components/common/PageHeader';

const schema = z.object({
  title: z.string().min(3, { message: 'Please enter a title' }),
  description: z.string().optional(),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().min(1, { message: 'End date is required' }),
  coverImage: z.string().url().optional(),
});

type CreateTripForm = z.infer<typeof schema>;

export const CreateTripPage = () => {
  const user = useAuthStore((state) => state.user);
  const setToast = useUiStore((state) => state.setToast);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTripForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({ startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10) });
  }, [reset]);

  const onSubmit = async (values: CreateTripForm) => {
    if (!user) {
      setToast({ type: 'error', message: 'You must be logged in to create a trip' });
      return;
    }
    try {
      await createTrip({ ...values, userId: user.id });
      setToast({ type: 'success', message: 'Trip created successfully' });
      navigate('/trips');
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to create trip' });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Create trip" subtitle="Create a new travel plan with all the essentials" />
      <Card>
        <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Trip title" placeholder="Weekend in Lisbon" {...register('title')} error={errors.title?.message} />
          <Input label="Cover image URL" placeholder="https://...jpg" {...register('coverImage')} error={errors.coverImage?.message} />
          <Input label="Start date" type="date" {...register('startDate')} error={errors.startDate?.message} />
          <Input label="End date" type="date" {...register('endDate')} error={errors.endDate?.message} />
          <div className="lg:col-span-2">
            <Textarea label="Description" placeholder="Outline your dream itinerary" {...register('description')} error={errors.description?.message} />
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <Button type="submit">Start trip</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
