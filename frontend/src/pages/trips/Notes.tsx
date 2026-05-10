import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchNotes, createNote, deleteNote, updateNote } from '../../services/notes';
import { fetchTrips } from '../../services/trips';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/common/PageHeader';
import { formatDate } from '../../utils/format';
import type { Note, Trip } from '../../types';

const schema = z.object({
  content: z.string().min(5, { message: 'Enter at least 5 characters' }),
});

type NoteForm = z.infer<typeof schema>;

export const NotesPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setToast = useUiStore((state) => state.setToast);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteForm>({ 
    resolver: zodResolver(schema),
    defaultValues: { content: '' }
  });

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const allTrips = await fetchTrips();
        setTrips(allTrips);
        setTripId(allTrips[0]?.id ?? '');
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load trips' });
      }
    };
    loadTrips();
  }, [setToast]);

  useEffect(() => {
    if (!tripId) return;
    const loadNotes = async () => {
      try {
        setLoading(true);
        setNotes(await fetchNotes(tripId));
      } catch (error: unknown) {
        setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to load notes' });
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [tripId, setToast]);

  const onSubmit = async (values: NoteForm) => {
    if (!user) {
      setToast({ type: 'error', message: 'Please log in to add notes.' });
      return;
    }
    if (!tripId) {
      setToast({ type: 'error', message: 'Select a trip to attach notes.' });
      return;
    }
    try {
      setSubmitting(true);
      const note = await createNote({ tripId, userId: user.id, content: values.content });
      setNotes((current) => [note, ...current]);
      reset();
      setToast({ type: 'success', message: 'Note saved' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to save note' });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    reset({ content: note.content });
  };

  const saveEdit = async (values: NoteForm) => {
    if (!editingId) return;
    try {
      const updated = await updateNote(editingId, { content: values.content });
      setNotes((current) => current.map((note) => (note.id === updated.id ? updated : note)));
      setEditingId(null);
      reset();
      setToast({ type: 'success', message: 'Note updated' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to update note' });
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((current) => current.filter((note) => note.id !== id));
      setToast({ type: 'success', message: 'Note deleted' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Unable to delete note' });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Notes" subtitle="Capture travel ideas, journal entries, and trip memories." />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_0.6fr]">
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trip journal</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Stay organized with notes.</h3>
          </div>
          <select
            value={tripId}
            onChange={(event) => setTripId(event.target.value)}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {trips.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <form className="space-y-4" onSubmit={handleSubmit(editingId ? saveEdit : onSubmit)}>
            <Input label="Note" placeholder="Write your note here..." {...register('content')} error={errors.content?.message} />
            <div className="flex justify-end gap-3">
              {editingId ? <Button variant="secondary" onClick={() => { setEditingId(null); reset(); }}>Cancel</Button> : null}
              <Button type="submit" disabled={submitting || !tripId}>
                {submitting ? 'Processing...' : editingId ? 'Save note' : 'Add note'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent notes</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Your travel journal.</h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/60" />)}
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">No notes yet. Start journaling your trip ideas.</div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(note.createdAt)}</p>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(note)}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(note.id)}>Delete</Button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-900 dark:text-slate-100">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
