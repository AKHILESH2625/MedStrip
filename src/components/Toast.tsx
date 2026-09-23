import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function Toast() {
  const { toastMessage, dismissToast } = useApp();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
      setExiting(false);
    } else if (visible) {
      setExiting(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!visible) return null;

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => {
      dismissToast();
      setVisible(false);
      setExiting(false);
    }, 200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm">
      <button
        onClick={handleDismiss}
        className={`
          pointer-events-auto
          flex items-center gap-3 px-4.5 py-3.5
          bg-white dark:bg-[#1C1D1D] text-slate-900 dark:text-white
          rounded-2xl shadow-xl shadow-emerald-600/15 dark:shadow-black/40
          text-xs font-medium tracking-tight border-2 border-emerald-500/80 dark:border-emerald-500/40
          transition-transform active:scale-95 text-left
          ${exiting ? 'toast-exit' : 'toast-enter'}
        `}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
          <Check size={16} strokeWidth={3} />
        </div>
        <div>
          <p className="font-black text-slate-900 dark:text-white text-xs">Pressure Event Verified</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-0.5">{toastMessage}</p>
        </div>
      </button>
    </div>
  );
}
