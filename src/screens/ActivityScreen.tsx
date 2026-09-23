import { Activity, Info, CheckCircle2, ShieldCheck, Download, Search } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function ActivityScreen() {
  const { activities } = useApp();

  // Group by dateLabel
  const grouped = activities.reduce<Record<string, typeof activities>>((acc, act) => {
    if (!acc[act.dateLabel]) acc[act.dateLabel] = [];
    acc[act.dateLabel].push(act);
    return acc;
  }, {});

  return (
    <div className="screen-enter space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-warm-gray-lighter">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-deep bg-sage-muted border border-sage/25 px-3 py-1 rounded-full shadow-2xs">
              Audit Stream
            </span>
            <span className="text-xs text-warm-gray font-semibold">
              Immutable time-stamped records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight mt-2">
            Detection Activity
          </h1>
          <p className="text-sm text-warm-gray font-medium mt-1">
            Factual log of all physical pressure events detected by the MedStrip Clip.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              type="text"
              readOnly
              value="Filter: All Events"
              className="pl-8 pr-3.5 py-2 text-xs bg-white border border-warm-gray-lighter rounded-xl text-charcoal font-bold shadow-2xs cursor-default"
            />
          </div>
          <button
            onClick={() => alert('Log exported as CSV (Demo Prototype)')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-warm-gray-lighter hover:border-sage/40 text-xs font-bold text-charcoal transition-all shadow-2xs hover:shadow-xs active:scale-95"
          >
            <Download size={14} className="text-sage-deep" />
            <span>Export CSV Log</span>
          </button>
        </div>
      </div>

      {/* Insight Section */}
      <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/80 flex items-start gap-4 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-amber text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <Info size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-amber-950">
            Dose Timing Analysis
          </h3>
          <p className="text-xs text-amber-900 font-medium mt-1 leading-relaxed">
            Your morning dose was detected <span className="font-bold text-amber-950 underline decoration-amber-400">2 minutes after</span> the scheduled 08:00 AM time. The pressure curve matched an intentional expulsion with no false triggers.
          </p>
        </div>
      </div>

      {/* Modern Desktop Event Table & Stream View */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-gray-lighter shadow-2xs">
        <div className="space-y-8">
          {Object.entries(grouped).map(([dateLabel, events]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black text-charcoal bg-ivory px-3 py-1 rounded-lg uppercase tracking-wider font-mono border border-warm-gray-lighter">
                  {dateLabel}
                </span>
                <div className="flex-1 h-px bg-warm-gray-lighter/80" />
                <span className="text-xs text-warm-gray font-bold">
                  {events.length} {events.length === 1 ? 'event' : 'events'} recorded
                </span>
              </div>

              {/* Responsive Event Table / Grid */}
              <div className="divide-y divide-warm-gray-lighter/60">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-ivory/60 px-3 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-sage-muted text-sage-deep flex items-center justify-center shrink-0 border border-sage/20 shadow-2xs">
                        <Activity size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-charcoal">
                            Dose Detected
                          </span>
                          <span className="text-xs font-bold text-sage-deep bg-sage-muted border border-sage/25 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 size={12} strokeWidth={2.5} />
                            Pressure Verified
                          </span>
                        </div>
                        <p className="text-xs text-warm-gray font-medium mt-1">
                          {event.medication} · {event.dose} · Expelled through blister cavity
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-right">
                      <div className="hidden md:block text-left font-mono text-[11px] text-warm-gray font-semibold">
                        <span>BLE Channel: 0x3F</span>
                        <span className="block text-[11px] text-sage-deep font-bold font-mono">Δp = 1.42 bar</span>
                      </div>
                      <div>
                        <span className="font-mono font-black text-charcoal text-sm tabular-nums block">
                          {event.time}
                        </span>
                        <span className="text-[11px] text-warm-gray font-bold">
                          Hardware Clip Confirmed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Telemetry Assurance Footer */}
        <div className="mt-8 pt-6 border-t border-warm-gray-lighter flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-warm-gray font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-sage-deep" />
            <span>Cryptographically signed by ESP32 hardware enclave</span>
          </div>
          <span className="font-mono text-xs font-bold text-warm-gray">Synced: Just now via BLE 5.2</span>
        </div>
      </div>
    </div>
  );
}
