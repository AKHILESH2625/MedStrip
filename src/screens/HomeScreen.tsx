import { useState } from 'react';
import { Check, ArrowRight, Clock, Cpu, Activity, Sparkles, AlertCircle, PlusCircle, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { PillSlot } from '../store/AppContext';
import StripConfigModal from '../components/StripConfigModal';

export default function HomeScreen() {
  const {
    pills,
    schedule,
    activities,
    pillsRemaining,
    dosesDetected,
    setActiveTab,
    simulateDose,
    reloadNewStrip,
    activeStrip,
    viewMode,
    currentTimeStr,
  } = useApp();

  const [showConfigModal, setShowConfigModal] = useState(false);

  const nextUpcoming = schedule.find(s => s.status === 'upcoming');
  const recentEvent = activities[0];
  const isMobile = viewMode === 'mobile';

  // Dynamic greeting based on current synchronized/manual time
  const getGreeting = () => {
    const isPM = currentTimeStr.includes('PM');
    const hourPart = parseInt(currentTimeStr.split(':')[0], 10);
    if (!isPM && (hourPart >= 5 && hourPart < 12)) return 'Good morning, Alex';
    if (isPM && (hourPart === 12 || hourPart < 5)) return 'Good afternoon, Alex';
    if (isPM && (hourPart >= 5 && hourPart < 10)) return 'Good evening, Alex';
    return 'Good night, Alex';
  };

  return (
    <div className={`screen-enter ${isMobile ? 'space-y-4' : 'space-y-6 sm:space-y-8'}`}>
      
      {/* Top Welcome & Quick Telemetry Banner */}
      <div className={`flex flex-col ${isMobile ? 'gap-2.5 pb-4' : 'lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 sm:pb-6'} border-b border-warm-gray-lighter`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sage-deep bg-sage-muted border border-sage/25 px-2.5 py-0.5 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-deep animate-pulse" />
              Live Telemetry
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-warm-gray ml-1">
              Synchronized via Bluetooth LE 5.2
            </span>
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-bold text-charcoal tracking-tight mt-1.5 sm:mt-2`}>
            {getGreeting()}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-warm-gray mt-0.5 sm:mt-1">
            Here is your real-time medication tracking & pressure sensor telemetry.
          </p>
        </div>

        {/* Action button on desktop */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('strip')}
            className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs'} rounded-xl bg-white hover:bg-ivory-warm border border-warm-gray-lighter font-bold text-charcoal transition-all shadow-2xs`}
          >
            <Cpu size={14} className="text-sage-deep" />
            <span>Interactive Studio</span>
          </button>
          
          {pillsRemaining === 0 ? (
            <button
              onClick={() => reloadNewStrip()}
              className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'} rounded-xl font-bold text-white bg-sage-deep hover:bg-sage-deep/90 transition-all shadow-xs`}
            >
              <PlusCircle size={14} />
              <span>Refill Strip ({activeStrip.size})</span>
            </button>
          ) : (
            <button
              onClick={simulateDose}
              className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'} rounded-xl font-bold text-white bg-sage-deep hover:bg-sage-deep/90 active:scale-95 transition-all shadow-xs`}
            >
              <Sparkles size={14} className="text-white" />
              <span>Simulate Dose ({pillsRemaining} left)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Stat Metric Cards Grid: Responsive 2x2 on Mobile, 4-in-a-row on Web */}
      <div className={isMobile ? 'grid grid-cols-2 gap-2.5' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'}>
        
        {/* Metric 1: Remaining Pills */}
        <div className={`bg-white ${isMobile ? 'p-3.5 rounded-xl' : 'p-5 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all group`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-sage-deep" />
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-warm-gray text-[11px] truncate">
              <span className="w-2 h-2 rounded-full bg-sage-deep shrink-0" />
              Strip Supply
            </span>
            <span className="text-sage-deep bg-sage-muted border border-sage/20 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
              Active
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline">
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-charcoal tabular-nums tracking-tight`}>
              {pillsRemaining}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-warm-gray ml-1">/{activeStrip.size} pills</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-ivory-warm rounded-full overflow-hidden">
            <div
              className="h-full bg-sage-deep rounded-full transition-all duration-500"
              style={{ width: `${(pillsRemaining / activeStrip.size) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Next Dose */}
        <div className={`bg-white ${isMobile ? 'p-3.5 rounded-xl' : 'p-5 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all group`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber" />
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-warm-gray text-[11px] truncate">
              <Clock size={12} className="text-amber shrink-0" />
              Next Dose
            </span>
            <span className="text-amber bg-amber-light border border-amber/20 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
              Scheduled
            </span>
          </div>
          <div className="mt-2.5">
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-charcoal tracking-tight truncate`}>
              {nextUpcoming ? nextUpcoming.timeLabel : 'Completed'}
            </div>
            <p className="text-[10.5px] sm:text-xs font-medium text-warm-gray mt-0.5 truncate">
              {nextUpcoming ? `${nextUpcoming.medication}` : 'All doses taken'}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-bold text-amber flex items-center gap-1 truncate">
            <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
            <span className="truncate">Clip armed</span>
          </div>
        </div>

        {/* Metric 3: Last Detected Event */}
        <div className={`bg-white ${isMobile ? 'p-3.5 rounded-xl' : 'p-5 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all group`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#5A8BA8]" />
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-warm-gray text-[11px] truncate">
              <Check size={12} className="text-[#5A8BA8] shrink-0" strokeWidth={2.5} />
              Last Event
            </span>
            <span className="text-[#3D6B88] bg-[#EBF3F8] border border-[#5A8BA8]/20 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
              Verified
            </span>
          </div>
          <div className="mt-2.5">
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-charcoal tracking-tight truncate`}>
              {recentEvent ? recentEvent.time : 'None today'}
            </div>
            <p className="text-[10.5px] sm:text-xs font-medium text-warm-gray mt-0.5 truncate">
              {recentEvent ? `${recentEvent.medication}` : 'Awaiting dose'}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-bold text-[#5A8BA8] flex items-center gap-1 truncate">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5A8BA8] shrink-0" />
            <span className="truncate">Pressure verified</span>
          </div>
        </div>

        {/* Metric 4: Hardware Clip */}
        <div className={`bg-white ${isMobile ? 'p-3.5 rounded-xl' : 'p-5 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all group`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-sage-deep" />
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-warm-gray text-[11px] truncate">
              <Cpu size={12} className="text-warm-gray shrink-0" />
              Smart Clip
            </span>
            <span className="flex items-center gap-1 text-sage-deep bg-sage-muted border border-sage/20 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-deep animate-pulse" />
              Connected
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline">
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-charcoal tabular-nums tracking-tight`}>
              87%
            </span>
            <span className="text-[10.5px] sm:text-xs font-semibold text-warm-gray ml-1">battery</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-mono font-bold">
            <span className="bg-sage-muted text-sage-deep border border-sage/20 px-1.5 py-0.2 rounded text-[9.5px]">BLE 5.2</span>
            <span className="bg-sage-muted text-sage-deep border border-sage/20 px-1.5 py-0.2 rounded text-[9.5px]">ESP32</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Body: 1-Column on Mobile, 2-Column on Web */}
      <div className={isMobile ? 'flex flex-col gap-5' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8'}>
        
        {/* Primary Column */}
        <div className={isMobile ? 'space-y-5' : 'lg:col-span-7 space-y-6 sm:space-y-8'}>
          
          {/* Card: Live Smart Strip Visualization */}
          <div className={`bg-white ${isMobile ? 'p-4 rounded-xl' : 'p-5 sm:p-7 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)]`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-warm-gray-lighter">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-charcoal tracking-tight">
                    Smart Strip Live Twin
                  </h2>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sage-deep bg-sage-muted border border-sage/20 px-2 py-0.5 rounded-full">
                    {activeStrip.size} CAVITIES
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-warm-gray mt-0.5">
                  Physical clip monitors pressure variations when pills are pushed out
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-charcoal bg-white hover:bg-ivory-warm px-2.5 py-1 rounded-xl border border-warm-gray-lighter transition-colors shadow-2xs"
                >
                  <SlidersHorizontal size={12} className="text-warm-gray" />
                  <span>Customize</span>
                </button>
                <button
                  onClick={() => setActiveTab('strip')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sage-deep hover:text-sage-deep/80 transition-colors"
                >
                  <span>Studio</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Visual Strip Container with Attached Clip */}
            <div className="mt-4 pt-1 pb-3">
              
              {/* Hardware Clip Graphic clamped to top edge */}
              <div
                className="relative mx-auto h-8 sm:h-9 rounded-t-xl bg-ivory-warm text-charcoal flex items-center justify-between px-3 sm:px-4 border border-warm-gray-light/60 shadow-2xs transition-all duration-300"
                style={{ width: `${Math.min(Math.max(180, Math.ceil(activeStrip.size / 2) * 56 + 32), 400)}px`, maxWidth: '100%' }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-deep animate-pulse" />
                  <span className="text-[9.5px] sm:text-[10px] font-bold tracking-widest uppercase text-sage-deep font-mono">
                    MEDSTRIP CLIP
                  </span>
                </div>
                <span className="text-[9px] font-bold font-mono text-warm-gray bg-white px-1.5 py-0.5 rounded border border-warm-gray-lighter">
                  ESP32 BLE
                </span>
              </div>

              {/* Realistic Blister Pack Surface */}
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-warm-gray-lighter relative overflow-hidden bg-white shadow-xs">
                {/* Perforation foil micro-pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#D9D4CE_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

                {/* Dynamic Cavity Cells Grid (Symmetrical 2 Rows) */}
                <div className="flex justify-center my-1">
                  <div
                    className="inline-grid gap-2 sm:gap-3 py-1 sm:py-2 justify-items-center"
                    style={{ gridTemplateColumns: `repeat(${Math.ceil(activeStrip.size / 2)}, minmax(0, 1fr))` }}
                  >
                    {pills.map((pill: PillSlot, i: number) => (
                      <button
                        key={pill.id}
                        onClick={() => setActiveTab('strip')}
                        className="group relative flex flex-col items-center focus:outline-none"
                        title={`Cavity #${i + 1}: ${pill.hasPill ? 'Pill Present' : 'Dose Taken'}`}
                      >
                        {/* Cavity Cell */}
                        <div
                          className="relative w-10 sm:w-13 h-14 sm:h-18 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 border border-warm-gray-lighter bg-ivory/50 shadow-2xs"
                        >
                          {pill.hasPill ? (
                            <div
                              className="w-6 sm:w-7 h-9 sm:h-11 rounded-md sm:rounded-lg flex items-center justify-center shadow-xs relative bg-gradient-to-b from-[#8EB896] to-[#6A8870]"
                            >
                              <div className="w-4 sm:w-5 h-[1.5px] bg-white/40" />
                              <div className="absolute top-1 left-1 right-1 h-1 rounded-full bg-white/30 pointer-events-none" />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                              <Check size={14} className="text-sage-deep" strokeWidth={2.5} />
                              <span className="text-[8.5px] font-bold text-warm-gray font-mono mt-0.5">
                                Q1Y1
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Perforation footer line */}
                <div className="mt-3 pt-2.5 border-t border-dashed border-warm-gray-lighter flex justify-between items-center text-[10px] sm:text-[11px] font-bold text-warm-gray font-mono uppercase tracking-wider">
                  <span>{activeStrip.name} · {activeStrip.dosage}</span>
                  <span className="hidden sm:inline">{activeStrip.size} Cavities</span>
                  <span>Lot #{activeStrip.lotNumber}</span>
                </div>
              </div>
            </div>

            {/* Quick Strip Summary & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-warm-gray-lighter">
              <div className="flex items-center gap-3 text-xs font-bold">
                <div>
                  <span className="text-charcoal font-black text-sm">{pillsRemaining}</span>
                  <span className="text-warm-gray ml-1">remaining</span>
                </div>
                <div className="w-px h-3.5 bg-warm-gray-lighter" />
                <div>
                  <span className="text-sage-deep font-black text-sm">{dosesDetected}</span>
                  <span className="text-warm-gray ml-1">detected</span>
                </div>
              </div>

              {pillsRemaining === 0 ? (
                <button
                  onClick={() => reloadNewStrip()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
                >
                  <PlusCircle size={14} />
                  <span>Refill Strip</span>
                </button>
              ) : (
                <button
                  onClick={simulateDose}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
                >
                  <Sparkles size={14} className="text-white" />
                  <span>Simulate Dose Press</span>
                </button>
              )}
            </div>
          </div>

          {/* Card: Today's Routine Schedule */}
          <div className={`bg-white ${isMobile ? 'p-4 rounded-xl' : 'p-5 sm:p-7 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)]`}>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-warm-gray-lighter">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-charcoal tracking-tight">
                  Today's Schedule
                </h2>
                <p className="text-[11px] sm:text-xs font-medium text-warm-gray mt-0.5">
                  Synchronized with the physical MedStrip Clip
                </p>
              </div>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs font-bold text-sage-deep hover:text-sage flex items-center gap-1"
              >
                <span>Routine</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 sm:space-y-3">
              {schedule.map((dose) => {
                const isTaken = dose.status === 'taken';
                return (
                  <div
                    key={dose.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isTaken
                        ? 'bg-sage-muted/50 border-sage/20'
                        : 'bg-ivory-warm/40 border-warm-gray-lighter'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isTaken
                          ? 'bg-sage-deep text-white'
                          : 'bg-amber-light text-amber'
                      }`}>
                        {isTaken ? <Check size={16} strokeWidth={2.5} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-charcoal">
                            {dose.medication}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-sage-deep">
                            · {dose.dose}
                          </span>
                        </div>
                        <p className="text-[10.5px] sm:text-xs font-medium text-warm-gray mt-0.5">
                          {dose.period} · {dose.timeLabel}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isTaken ? (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-sage-deep bg-sage-muted border border-sage/20 px-2 py-0.5 rounded-full">
                          <Check size={11} strokeWidth={2.5} />
                          Taken {dose.detectedAt ? `@ ${dose.detectedAt}` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-amber bg-amber-light border border-amber/20 px-2 py-0.5 rounded-full">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Secondary Column */}
        <div className={isMobile ? 'space-y-5' : 'lg:col-span-5 space-y-6 sm:space-y-8'}>
          
          {/* Card: Recent Detection Activity Log */}
          <div className={`bg-white ${isMobile ? 'p-4 rounded-xl' : 'p-5 sm:p-7 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)]`}>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-warm-gray-lighter">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-charcoal tracking-tight">
                  Recent Activity Log
                </h2>
                <p className="text-[11px] sm:text-xs font-medium text-warm-gray mt-0.5">
                  Real-time pressure telemetry
                </p>
              </div>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs font-bold text-sage-deep hover:text-sage flex items-center gap-1"
              >
                <span>Logs</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Activity Insight Alert */}
            <div className="mt-4 p-3 rounded-xl bg-amber-light/70 border border-amber/25 flex items-start gap-2">
              <AlertCircle size={15} className="text-amber shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-charcoal leading-relaxed font-normal">
                Your morning dose was confirmed 2 minutes after scheduled time. Pressure spike profile matched expected Metformin expulsion.
              </p>
            </div>

            {/* Event list */}
            <div className="mt-4 space-y-2">
              {activities.slice(0, 3).map((act, idx) => (
                <div key={act.id} className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-ivory-warm/40 border border-warm-gray-lighter flex items-center justify-between gap-2.5 transition-colors shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sage-muted text-sage-deep border border-sage/20 flex items-center justify-center shrink-0">
                      <Activity size={14} />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-charcoal truncate">
                        Dose Detected - {act.medication}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-medium text-warm-gray mt-0.5">
                        {act.dose} · Pressure confirmed
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold font-mono text-charcoal tabular-nums block">
                      {act.time}
                    </span>
                    <p className="text-[9.5px] font-medium text-warm-gray">
                      {idx === 0 ? 'Today' : 'Yesterday'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Hardware Concept Overview */}
          <div className={`bg-white ${isMobile ? 'p-4 rounded-xl' : 'p-5 sm:p-7 rounded-2xl'} border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)]`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray">
              About MedStrip Technology
            </h3>
            <p className="text-xs font-normal text-charcoal-light mt-1.5 sm:mt-2 leading-relaxed">
              MedStrip is an ultra-low-power reusable smart clip that clamps onto standard pharmacy blister packs. Built-in pressure sensors detect the physical deformation when a pill is popped through the foil, transmitting the verification timestamp immediately to this application via Bluetooth LE.
            </p>

            <div className="mt-3.5 pt-3.5 border-t border-warm-gray-lighter grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-warm-gray font-medium text-[10.5px] block">Sensor Type</span>
                <span className="font-bold text-charcoal">Pressure Micro-Array</span>
              </div>
              <div>
                <span className="text-warm-gray font-medium text-[10.5px] block">Wireless MCU</span>
                <span className="font-bold text-charcoal">ESP32-C3 BLE 5.2</span>
              </div>
              <div>
                <span className="text-warm-gray font-medium text-[10.5px] block">Hardware State</span>
                <span className="font-bold text-sage-deep">Active & Armed</span>
              </div>
              <div>
                <span className="text-warm-gray font-medium text-[10.5px] block">Foil Compatibility</span>
                <span className="font-bold text-charcoal">Universal Blister</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setActiveTab('device')}
                className="w-full py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl bg-sage-muted hover:bg-sage-muted/80 text-xs font-bold text-sage-deep transition-colors border border-sage/20 text-center block shadow-2xs"
              >
                Inspect Device & Hardware Specifications →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Strip Customization Modal */}
      <StripConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
}
