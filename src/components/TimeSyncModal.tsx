import { useState } from 'react';
import { Clock, Check, X, Laptop, Edit2 } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface TimeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TimeSyncModal({ isOpen, onClose }: TimeSyncModalProps) {
  const { currentTimeStr, isTimeLive, syncLaptopTime, setManualTime } = useApp();
  const [inputTime, setInputTime] = useState('08:00');

  if (!isOpen) return null;

  const handleApplyCustomTime = () => {
    if (!inputTime) return;
    const [h, m] = inputTime.split(':');
    let hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    const formatted = `${displayHour}:${m} ${ampm}`;
    setManualTime(formatted);
    onClose();
  };

  const handlePresetSelect = (timeStr: string) => {
    setManualTime(timeStr);
    onClose();
  };

  const handleSyncLaptop = () => {
    syncLaptopTime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-xs screen-enter">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-warm-gray-lighter shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sage-muted text-sage-deep flex items-center justify-center border border-sage/20 shadow-2xs">
              <Clock size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal tracking-tight">
                Clock & Time Controller
              </h2>
              <p className="text-xs text-warm-gray font-medium">
                Sync with laptop or set demo time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-warm-gray hover:text-charcoal hover:bg-ivory-warm transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Time Display */}
        <div className="p-4 rounded-2xl bg-ivory-warm/60 border border-warm-gray-lighter flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-warm-gray uppercase tracking-wider block">
              Active MedStrip Time
            </span>
            <div className="text-3xl font-black text-charcoal font-mono tracking-tight mt-0.5">
              {currentTimeStr}
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isTimeLive
                ? 'bg-sage-muted text-sage-deep border-sage/25'
                : 'bg-amber-light text-amber border-amber/25'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isTimeLive ? 'bg-sage-deep animate-pulse' : 'bg-amber'}`} />
              {isTimeLive ? 'Synced to Laptop' : 'Manual Override'}
            </span>
          </div>
        </div>

        {/* Option 1: Sync to Real Laptop Time */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray">
            Option A: Live System Clock
          </h3>
          <button
            onClick={handleSyncLaptop}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 ${
              isTimeLive
                ? 'bg-sage-muted text-sage-deep border border-sage/30'
                : 'bg-white hover:bg-ivory-warm text-charcoal border border-warm-gray-lighter'
            }`}
          >
            <Laptop size={15} className="text-sage-deep" />
            <span>Sync Real-Time with Laptop System Clock</span>
            {isTimeLive && <Check size={14} className="text-sage-deep ml-1" />}
          </button>
        </div>

        {/* Option 2: Quick Demo Presets */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray">
            Option B: Quick Demo Time Jumps
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handlePresetSelect('8:00 AM')}
              className="p-2.5 rounded-xl bg-ivory hover:bg-ivory-warm border border-warm-gray-lighter text-left transition-colors font-medium text-charcoal"
            >
              <span className="font-bold text-sage-deep block">8:00 AM</span>
              <span className="text-[11px] text-warm-gray">Morning Regimen</span>
            </button>
            <button
              onClick={() => handlePresetSelect('8:02 AM')}
              className="p-2.5 rounded-xl bg-ivory hover:bg-ivory-warm border border-warm-gray-lighter text-left transition-colors font-medium text-charcoal"
            >
              <span className="font-bold text-amber block">8:02 AM</span>
              <span className="text-[11px] text-warm-gray">Late Expulsion Spike</span>
            </button>
            <button
              onClick={() => handlePresetSelect('2:00 PM')}
              className="p-2.5 rounded-xl bg-ivory hover:bg-ivory-warm border border-warm-gray-lighter text-left transition-colors font-medium text-charcoal"
            >
              <span className="font-bold text-sage-deep block">2:00 PM</span>
              <span className="text-[11px] text-warm-gray">Afternoon Vitamin D</span>
            </button>
            <button
              onClick={() => handlePresetSelect('8:00 PM')}
              className="p-2.5 rounded-xl bg-ivory hover:bg-ivory-warm border border-warm-gray-lighter text-left transition-colors font-medium text-charcoal"
            >
              <span className="font-bold text-sage-deep block">8:00 PM</span>
              <span className="text-[11px] text-warm-gray">Night Regimen</span>
            </button>
          </div>
        </div>

        {/* Option 3: Precise Manual Input */}
        <div className="space-y-2 pt-2 border-t border-warm-gray-lighter">
          <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray">
            Option C: Custom Time Picker
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-warm-gray-lighter text-charcoal font-mono text-sm font-bold focus:outline-none focus:border-sage-deep"
            />
            <button
              onClick={handleApplyCustomTime}
              className="px-4 py-2 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <Edit2 size={13} />
              <span>Apply Time</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
