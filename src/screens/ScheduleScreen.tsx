import { useState } from 'react';
import { Check, BellRing, Sparkles, Calendar, Pill, Edit3, Plus } from 'lucide-react';
import { useApp } from '../store/AppContext';
import RoutineModal from '../components/RoutineModal';

export default function ScheduleScreen() {
  const { schedule, simulateDose, pillsRemaining } = useApp();
  const [showRoutineModal, setShowRoutineModal] = useState(false);

  const takenCount = schedule.filter(s => s.status === 'taken').length;
  const totalCount = schedule.length;
  const progressPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div className="screen-enter space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#262C29]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full shadow-2xs">
              Daily Regimen
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Synchronized with MedStrip Clip
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            Medication Routine
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
            Auto-verified through physical pressure sensing when tablets are pushed through foil.
          </p>
        </div>

        {/* Action Controls & Progress Counter */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={() => setShowRoutineModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Edit3 size={15} className="text-white" />
            <span>Edit Routine & Add Doses</span>
          </button>

          <div className="bg-white rounded-2xl p-4 border border-warm-gray-lighter shadow-xs flex items-center gap-4 sm:gap-5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-charcoal tabular-nums leading-none">
                  {takenCount} of {totalCount}
                </span>
                <span className="text-xs text-warm-gray font-bold uppercase">doses</span>
              </div>
              <p className="text-xs text-sage-deep font-bold mt-1">
                {progressPercent}% Complete Today
              </p>
            </div>

            <div className="w-16 h-2 bg-ivory-warm rounded-full overflow-hidden border border-warm-gray-lighter">
              <div
                className="h-full bg-sage-deep rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Routine Cards Grid (3 Columns on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedule.map((dose) => {
          const isTaken = dose.status === 'taken';

          // Color theme based on period
          const periodTheme = {
            Morning: {
              cardBg: isTaken ? 'bg-white' : 'bg-gradient-to-b from-amber-50/50 to-white',
              border: isTaken ? 'border-sage/40' : 'border-amber-200/80',
              iconBg: 'bg-amber-100/80 text-amber-800 border border-amber-300/80',
              periodBadge: 'bg-amber-50 text-amber-900 border border-amber-300/80',
            },
            Afternoon: {
              cardBg: isTaken ? 'bg-white' : 'bg-gradient-to-b from-sky-50/50 to-white',
              border: isTaken ? 'border-sage/40' : 'border-sky-200/80',
              iconBg: 'bg-sky-100/80 text-sky-800 border border-sky-300/80',
              periodBadge: 'bg-sky-50 text-sky-900 border border-sky-300/80',
            },
            Evening: {
              cardBg: isTaken ? 'bg-white' : 'bg-gradient-to-b from-indigo-50/50 to-white',
              border: isTaken ? 'border-sage/40' : 'border-indigo-200/80',
              iconBg: 'bg-indigo-100/80 text-indigo-800 border border-indigo-300/80',
              periodBadge: 'bg-indigo-50 text-indigo-900 border border-indigo-300/80',
            },
            Night: {
              cardBg: isTaken ? 'bg-white' : 'bg-gradient-to-b from-purple-50/50 to-white',
              border: isTaken ? 'border-sage/40' : 'border-purple-200/80',
              iconBg: 'bg-purple-100/80 text-purple-800 border border-purple-300/80',
              periodBadge: 'bg-purple-50 text-purple-900 border border-purple-300/80',
            },
          }[dose.period] || {
            cardBg: 'bg-white',
            border: 'border-warm-gray-lighter',
            iconBg: 'bg-sage-muted text-sage-deep',
            periodBadge: 'bg-ivory text-charcoal',
          };

          return (
            <div
              key={dose.id}
              className={`rounded-3xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-xs ${periodTheme.cardBg} ${periodTheme.border} ${
                isTaken ? 'ring-2 ring-sage/20' : ''
              }`}
            >
              <div>
                {/* Card Top: Period & Status Pill */}
                <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-charcoal uppercase tracking-wider font-mono">
                      {dose.timeLabel}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${periodTheme.periodBadge}`}>
                      {dose.period}
                    </span>
                  </div>

                  {isTaken ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sage-deep bg-sage-muted border border-sage/25 px-3 py-1 rounded-full shadow-2xs">
                      <Check size={13} strokeWidth={3} className="text-sage-deep" />
                      Verified Taken
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-warm-gray bg-ivory px-3 py-1 rounded-full border border-warm-gray-lighter">
                      Upcoming
                    </span>
                  )}
                </div>

                {/* Medication Details */}
                <div className="mt-5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 shadow-2xs ${
                    isTaken ? 'bg-sage-muted text-sage-deep border border-sage/30' : periodTheme.iconBg
                  }`}>
                    <Pill size={20} />
                  </div>
                  <h3 className="text-xl font-extrabold text-charcoal tracking-tight">
                    {dose.medication}
                  </h3>
                  <p className="text-sm text-warm-gray font-bold mt-1">
                    {dose.dose} · Oral Tablet
                  </p>
                </div>

                {/* Hardware Telemetry Note */}
                <div className="mt-6 pt-4 border-t border-warm-gray-lighter/60 text-xs">
                  {isTaken ? (
                    <div className="p-3.5 rounded-2xl bg-sage-muted/40 border border-sage/30 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-sage-deep">
                        <Check size={14} strokeWidth={3} className="text-sage-deep" />
                        <span>Pressure event confirmed</span>
                      </div>
                      <p className="text-xs text-sage-deep/80 font-medium">
                        Detected at {dose.detectedAt || '8:02 AM'} via MedStrip Clip
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <BellRing size={14} className="text-amber-600" />
                        <span>Awaiting physical dose</span>
                      </div>
                      <p className="text-xs text-amber-900/80 font-medium">
                        Clip will automatically verify when tablet is pushed out
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-6 pt-4 border-t border-warm-gray-lighter/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => setShowRoutineModal(true)}
                  className="text-warm-gray hover:text-charcoal flex items-center gap-1.5 font-bold transition-colors"
                >
                  <Edit3 size={13} />
                  <span>Edit Dose</span>
                </button>

                {!isTaken && (
                  <button
                    onClick={simulateDose}
                    disabled={pillsRemaining === 0}
                    className="text-xs font-bold text-white bg-sage-deep hover:bg-sage px-3.5 py-1.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Simulate Push</span>
                    <Sparkles size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Quick Add Dose Card */}
        <button
          onClick={() => setShowRoutineModal(true)}
          className="rounded-3xl p-6 sm:p-7 border-2 border-dashed border-sage/30 hover:border-sage transition-all flex flex-col items-center justify-center text-center group min-h-[260px] bg-sage-muted/20 hover:bg-sage-muted/40 shadow-2xs"
        >
          <div className="w-13 h-13 rounded-2xl bg-sage-muted text-sage-deep group-hover:scale-110 flex items-center justify-center transition-all mb-3 shadow-2xs border border-sage/20">
            <Plus size={22} strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-charcoal text-base">Add New Scheduled Dose</span>
          <span className="text-xs text-warm-gray font-semibold mt-1 max-w-[220px]">
            Configure custom times, drugs, and reminders
          </span>
        </button>
      </div>

      {/* Routine Compliance & Hardware Assurance Banner */}
      <div className="bg-ivory-warm rounded-3xl p-6 sm:p-7 border border-warm-gray-lighter shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-sage-muted text-sage-deep flex items-center justify-center shrink-0 border border-sage/20 shadow-2xs">
            <Calendar size={24} />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-charcoal">
              Zero Manual Logging Required
            </h4>
            <p className="text-xs text-warm-gray font-medium mt-0.5 max-w-xl leading-relaxed">
              Unlike traditional medicine reminder apps where users must manually check checkboxes, MedStrip detects physical blister pack pressure in real time to verify that pills are actually expelled.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 bg-white p-3.5 rounded-2xl border border-warm-gray-lighter shadow-2xs">
          <span className="text-xs font-mono font-bold text-warm-gray uppercase tracking-wider block">Next sync window</span>
          <span className="text-sm font-extrabold text-charcoal">02:00 PM Today</span>
        </div>
      </div>

      {/* Routine Editor Modal */}
      <RoutineModal
        isOpen={showRoutineModal}
        onClose={() => setShowRoutineModal(false)}
      />
    </div>
  );
}
