import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '../../store/uiStore';

export const Toast = () => {
  const toast = useUiStore((state) => state.toast);
  const clearToast = useUiStore((state) => state.clearToast);

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 w-[320px] rounded-3xl border border-white/10 bg-slate-900/95 p-4 shadow-glow backdrop-blur-xl"
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}</p>
              <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
            </div>
            <button onClick={clearToast} className="text-slate-400 transition hover:text-slate-100">
              ✕
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
