import { useState, useCallback } from 'react';
import { Check, Activity as ActivityIcon, Sparkles, Radio, Layers, RefreshCw, PlusCircle, X, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { PillSlot } from '../store/AppContext';
import StripConfigModal from '../components/StripConfigModal';

export default function StripScreen() {
  const { pills, pillsRemaining, dosesDetected, simulateDose, reloadNewStrip, selectedPill, selectPill, setActiveTab, activeStrip } = useApp();
  const [poppingPill, setPoppingPill] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [recentDoseAlert, setRecentDoseAlert] = useState<string | null>(null);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const activeInspectionPill = selectedPill || pills[0];
  const gridColumns = Math.ceil(activeStrip.size / 2);
  const clipWidth = Math.min(Math.max(220, gridColumns * 72 + 40), 500);

  const handleSimulateDose = useCallback(() => {
    if (isSimulating || pillsRemaining === 0) return;

    const firstPillIndex = pills.findIndex(p => p.hasPill);
    if (firstPillIndex === -1) return;

    setIsSimulating(true);
    setPoppingPill(firstPillIndex);

    setTimeout(() => {
      simulateDose();
      setPoppingPill(null);
      setIsSimulating(false);
      setRecentDoseAlert(`Dose confirmed at cavity position #${firstPillIndex + 1}`);

      setTimeout(() => {
        setRecentDoseAlert(null);
      }, 4000);
    }, 450);
  }, [pills, pillsRemaining, isSimulating, simulateDose]);

  const handleConfirmRefill = () => {
    reloadNewStrip();
    setShowRefillModal(false);
  };

  return (
    <div className="screen-enter space-y-8">
      
      {/* Header with Title & Telemetry Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-warm-gray-lighter">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sensor Array Active
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-warm-gray">
              ESP32-C3 Clip · BLE 5.2 Real-Time Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Smart Strip Studio
          </h1>
          <p className="text-sm font-semibold text-slate-600 dark:text-warm-gray mt-1">
            Interactive digital twin of the physical blister pack and attached MedStrip clip.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-950 font-bold border border-teal-200 transition-colors shadow-2xs text-xs dark:bg-[#181C1B] dark:text-teal-300 dark:border-[#252C28]"
            title="Configure strip name and cavity count"
          >
            <SlidersHorizontal size={13} className="text-teal-700 dark:text-teal-400" />
            <span>Customize Strip</span>
          </button>

          <button
            onClick={() => setShowRefillModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold border border-emerald-200 transition-colors shadow-2xs text-xs dark:bg-[#181C1B] dark:text-emerald-300 dark:border-[#252C28]"
          >
            <PlusCircle size={14} className="text-emerald-700 dark:text-emerald-400" />
            <span>Clamp New Strip</span>
          </button>
          
          <button
            onClick={() => setActiveTab('device')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-2xs hidden sm:block dark:bg-[#151917] dark:border-[#262E2A] dark:text-white"
          >
            Device Specs
          </button>
        </div>
      </div>

      {/* Main 2-Column Hardware Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Center Stage: Realistic Blister Pack (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#151917] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-warm-gray-lighter/90 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-warm-gray-lighter">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Physical Blister Pack Digital Twin
                </h2>
                <p className="text-xs font-semibold text-slate-600 dark:text-warm-gray mt-0.5">
                  Click any cavity position to inspect its real-time pressure sensor readings
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-slate-600 dark:text-warm-gray">Pills:</span>
                <span className="font-black text-slate-900 dark:text-white tabular-nums">{pillsRemaining} present</span>
                <span className="text-slate-400">·</span>
                <span className="font-black text-emerald-700 dark:text-emerald-400 tabular-nums">{dosesDetected} expelled</span>
              </div>
            </div>

            {/* The Physical Blister Pack Hardware Assembly */}
            <div className="mt-8 mb-6">
              
              {/* Attached MedStrip Smart Clip Gripping the Pack — Match User Reference Screenshot */}
              <div
                className="relative mx-auto h-10 rounded-t-xl bg-white dark:bg-[#1E2421] text-slate-900 dark:text-white flex items-center justify-between px-4 border border-sky-200/90 dark:border-slate-700 shadow-2xs transition-all duration-300"
                style={{ width: `${clipWidth}px`, maxWidth: '100%' }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-teal-800 dark:text-teal-300 font-mono">
                    MedStrip Clip
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/70 dark:text-sky-300 px-2.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                  <ActivityIcon size={12} className="text-sky-600" />
                  <span>ESP32 BLE</span>
                </div>
              </div>

              {/* Photorealistic Aluminum/PVDC Foil Blister Strip Body */}
              <div
                className="blister-foil-surface relative rounded-2xl p-6 sm:p-8 border border-slate-300 dark:border-warm-gray-lighter/90 overflow-hidden shadow-sm"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 50%, #E2E8F0 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 14px rgba(0,0,0,0.04)',
                }}
              >
                {/* Perforation foil micro-pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#94A3B8_0.85px,transparent_0.85px)] [background-size:10px_10px] opacity-25 pointer-events-none" />

                {/* Dynamic Blister Cavity Chambers Grid (Symmetrical 2 Rows) */}
                <div className="flex justify-center my-1 sm:my-2">
                  <div
                    className="inline-grid gap-3.5 sm:gap-4.5 py-3 justify-items-center"
                    style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
                  >
                    {pills.map((pill: PillSlot, i: number) => {
                      const isSelected = activeInspectionPill?.id === pill.id;
                      const isPopping = poppingPill === i;

                      return (
                        <button
                          key={pill.id}
                          onClick={() => selectPill(pill)}
                          className={`group relative flex flex-col items-center focus:outline-none transition-transform duration-200 ${
                            isSelected ? 'scale-105' : 'hover:scale-102'
                          }`}
                          title={`Cavity #${i + 1}: Click to inspect`}
                        >
                          {/* Selected Indicator Ring */}
                          {isSelected && (
                            <div className="absolute -inset-1.5 rounded-2xl ring-2 ring-emerald-500/80 pointer-events-none" />
                          )}

                          {/* Blister Bubble Dome */}
                          <div
                            className={`
                              relative w-14 sm:w-16 h-20 sm:h-24 rounded-2xl flex items-center justify-center
                              transition-all duration-300
                              ${pill.hasPill ? 'blister-cavity-full' : 'blister-cavity-empty'}
                              ${isPopping ? 'pill-pop' : ''}
                            `}
                            style={{
                              background: pill.hasPill
                                ? 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #E2E8F0 100%)'
                                : 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)',
                              boxShadow: pill.hasPill
                                ? '0 4px 8px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -2px 3px rgba(0,0,0,0.04)'
                                : 'inset 0 3px 6px rgba(16, 185, 129, 0.18), inset 0 -1px 0 rgba(255,255,255,0.6)',
                              border: pill.hasPill ? '1px solid #CBD5E1' : '1.5px dashed #6EE7B7',
                            }}
                          >
                            {/* Bubble highlight sheen */}
                            <div className="absolute top-2 left-2.5 right-2.5 h-3 rounded-full bg-white/75 blur-[0.5px] pointer-events-none" />

                            {/* Pill Tablet or Ruptured Foil State */}
                            {pill.hasPill ? (
                              <div
                                className="relative w-8 sm:w-9 h-12 sm:h-14 rounded-[12px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-xs"
                                style={{
                                  background: 'linear-gradient(135deg, #8EB896 0%, #7C9A82 50%, #5B7D62 100%)',
                                  boxShadow: '0 4px 10px rgba(91, 125, 98, 0.25), inset 0 1px 1px rgba(255,255,255,0.45)',
                                }}
                              >
                                {/* Debossed Tablet Score Line */}
                                <div className="w-6 h-[1.5px] bg-white/50 shadow-[0_1px_0_rgba(0,0,0,0.15)]" />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-8 h-12 rounded-[12px] flex items-center justify-center">
                                  <Check size={18} className="text-sage-deep" strokeWidth={2.5} />
                                </div>
                                <span className="text-[9.5px] font-bold text-sage-deep uppercase mt-0.5 tracking-wider">
                                  OUT
                                </span>
                              </div>
                            )}

                            {/* Cavity Index Number */}
                            <span className="absolute bottom-1.5 text-[10.5px] font-extrabold text-slate-700 font-mono blister-foil-text">
                              #{i + 1}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Perforation foil information footer */}
                <div className="mt-5 pt-3 border-t border-dashed border-slate-300 dark:border-warm-gray-lighter flex justify-between items-center text-xs font-bold text-slate-600 dark:text-warm-gray font-mono uppercase tracking-wider blister-foil-text">
                  <span>{activeStrip.name} · {activeStrip.dosage}</span>
                  <span className="hidden sm:inline">{activeStrip.size} Cavities · Oral Tablets</span>
                  <span>Lot #{activeStrip.lotNumber} · Exp {activeStrip.expDate}</span>
                </div>
              </div>
            </div>

            {/* Dose Confirmation Alert Banner */}
            {recentDoseAlert && (
              <div className="fade-in-up mb-6 bg-emerald-100 text-emerald-950 px-5 py-3.5 rounded-2xl border-2 border-emerald-300 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3 text-xs font-extrabold">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check size={14} strokeWidth={3.5} />
                  </div>
                  <span>{recentDoseAlert} · Pressure spike confirmed</span>
                </div>
                <span className="text-xs text-emerald-800 font-mono font-bold">Synchronized to Routine</span>
              </div>
            )}

            {/* Primary Simulation Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-warm-gray-lighter">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Hardware Demonstration Trigger
                </h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-warm-gray mt-0.5">
                  Simulates pushing a tablet out of the aluminum foil cavity
                </p>
              </div>

              <div className="flex items-center gap-3">
                {pillsRemaining === 0 ? (
                  <button
                    onClick={() => setShowRefillModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <PlusCircle size={15} />
                    <span>Clamp New Strip (Refill {activeStrip.size} Pills)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSimulateDose}
                    disabled={isSimulating}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-sage-deep hover:bg-sage text-white active:scale-95 transition-all shadow-xs"
                  >
                    <Sparkles size={14} className="text-white" />
                    <span>
                      {isSimulating
                        ? 'Measuring pressure deformation...'
                        : `Simulate Expelling Pill #${activeStrip.size - pillsRemaining + 1}`}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setShowRefillModal(true)}
                  className="p-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-950 border border-teal-200 text-xs font-bold transition-colors shadow-2xs dark:bg-ivory-warm dark:text-charcoal dark:border-warm-gray-lighter"
                  title="Refill or Clamp New Strip"
                >
                  <RefreshCw size={14} className="text-teal-700 dark:text-warm-gray" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Cavity Inspector & Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Cavity Detailed Diagnostic Panel */}
          <div className="bg-white dark:bg-[#151917] rounded-2xl p-6 border border-slate-200/90 dark:border-[#222825] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-warm-gray-lighter">
              <div className="flex items-center gap-2">
                <Layers size={17} className="text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Cavity #{activeInspectionPill.id} Diagnostic Telemetry
                </h3>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${
                !activeInspectionPill.hasPill
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800'
              }`}>
                {!activeInspectionPill.hasPill ? 'Dose Confirmed' : 'Pill In Cavity'}
              </span>
            </div>

            {/* Visual Real-Time Pressure Strain Meter Gauge */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ActivityIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
                  Real-time Foil Strain Delta
                </span>
                <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {!activeInspectionPill.hasPill ? '1.42 bar (Spike Peak)' : '0.04 bar (Baseline)'}
                </span>
              </div>
              <div className="w-full h-3 bg-white dark:bg-slate-800 rounded-full overflow-hidden border border-emerald-300/60 dark:border-slate-700 p-0.5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    !activeInspectionPill.hasPill
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600'
                      : 'bg-gradient-to-r from-sky-400 to-teal-400'
                  }`}
                  style={{ width: !activeInspectionPill.hasPill ? '94%' : '5%' }}
                />
              </div>
              <div className="flex justify-between text-[10.5px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                <span>0.00 bar (Armed)</span>
                <span>Threshold: 0.85 bar</span>
                <span>2.00 bar Max</span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-warm-gray-lighter/50">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Physical State</span>
                <span className={`font-extrabold px-2 py-0.5 rounded-lg border text-[11px] ${
                  !activeInspectionPill.hasPill
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                    : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200'
                }`}>
                  {activeInspectionPill.hasPill ? 'Foil Intact (Armed)' : 'Foil Ruptured (Expelled)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-warm-gray-lighter/50">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Detection Timestamp</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeInspectionPill.detectedAt
                    ? `${activeInspectionPill.detectedDate}, ${activeInspectionPill.detectedAt}`
                    : 'Awaiting push event'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-warm-gray-lighter/50">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Assigned Medication</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{activeStrip.name} ({activeStrip.dosage})</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Clip Sensor Channel</span>
                <span className="font-mono font-extrabold text-indigo-900 bg-gradient-to-r from-indigo-50 to-purple-50 px-2.5 py-0.5 rounded-lg border border-indigo-200/90 shadow-2xs">
                  CH_0{activeInspectionPill.id} (Piezoresistive)
                </span>
              </div>
            </div>
          </div>

          {/* Live Hardware Specifications Card */}
          <div className="bg-white dark:bg-[#151917] rounded-3xl p-6 border border-slate-200 dark:border-warm-gray-lighter/90 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-warm-gray-lighter">
              <div className="flex items-center gap-2">
                <Radio size={17} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Clip Hardware Status
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-gentle" />
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-warm-gray-lighter/40">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Hardware Module</span>
                <span className="font-extrabold text-slate-900 dark:text-white">ESP32-C3 RISC-V</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-warm-gray-lighter/40">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Firmware</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">v1.2.0-esp</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-warm-gray-lighter/40">
                <span className="text-slate-600 dark:text-warm-gray font-bold">BLE RSSI</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">-54 dBm (Strong)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-warm-gray-lighter/40">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Battery Level</span>
                <span className="font-extrabold text-slate-900 dark:text-white">87% (~45 days left)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-warm-gray font-bold">Sampling Rate</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">100 Hz Continuous</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-warm-gray-lighter">
              <button
                onClick={() => setShowRefillModal(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <PlusCircle size={14} className="text-emerald-200" />
                <span>Pair / Clamp New Blister Strip</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: How to Add / Clamp a New Blister Strip */}
      {showRefillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-xs screen-enter">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-warm-gray-lighter text-charcoal space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sage-muted text-sage-deep flex items-center justify-center border border-sage/20 shadow-2xs">
                  <RefreshCw size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-charcoal">
                    Clamp New Blister Strip
                  </h3>
                  <p className="text-xs text-warm-gray font-semibold">
                    Hardware Attachment & Sensor Calibration Workflow
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRefillModal(false)}
                className="p-2 rounded-xl text-warm-gray hover:text-charcoal hover:bg-ivory-warm transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 3 Step Physical Instructions for Evaluators */}
            <div className="space-y-4 text-xs">
              <p className="text-charcoal font-bold">
                How patients attach a new medicine pack in real life:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-ivory border border-warm-gray-lighter flex items-start gap-3.5 shadow-2xs">
                  <span className="w-7 h-7 rounded-xl bg-sage-deep text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    1
                  </span>
                  <div>
                    <span className="font-extrabold text-charcoal block text-sm">Unclamp Reusable Clip</span>
                    <span className="text-warm-gray text-xs mt-0.5 block leading-relaxed font-medium">
                      Press the rear spring release on the MedStrip Clip to remove it from the depleted, empty foil pack.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-warm-gray-lighter flex items-start gap-3.5 shadow-2xs">
                  <span className="w-7 h-7 rounded-xl bg-sage text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    2
                  </span>
                  <div>
                    <span className="font-extrabold text-charcoal block text-sm">Clamp Onto Fresh Blister Pack</span>
                    <span className="text-warm-gray text-xs mt-0.5 block leading-relaxed font-medium">
                      Slide the clip jaws over the top rim of the new pharmacy strip (e.g. {activeStrip.name} {activeStrip.dosage}). The pressure sensor array automatically aligns over the cavities.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-warm-gray-lighter flex items-start gap-3.5 shadow-2xs">
                  <span className="w-7 h-7 rounded-xl bg-amber text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    3
                  </span>
                  <div>
                    <span className="font-extrabold text-charcoal block text-sm">Automatic Baseline Recalibration</span>
                    <span className="text-warm-gray text-xs mt-0.5 block leading-relaxed font-medium">
                      The ESP32 firmware reads nominal baseline resistance across all {activeStrip.size} channels, confirming intact cavities, and syncs immediately with the app.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Action Button */}
            <div className="pt-3 border-t border-warm-gray-lighter flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRefillModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-warm-gray hover:bg-warm-gray-lighter/40 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRefill}
                className="px-5 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
              >
                <ShieldCheck size={16} />
                <span>Confirm & Calibrate {activeStrip.size} Fresh Cavities</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Strip Setup Modal */}
      <StripConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
}
