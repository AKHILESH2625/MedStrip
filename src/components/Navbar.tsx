import { useState } from 'react';
import { Home, Cpu, Calendar, Activity, Radio, Menu, X, Sparkles, Layers, SlidersHorizontal, Bluetooth, Smartphone, Monitor, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import ESP32Modal from './ESP32Modal';
import StripConfigModal from './StripConfigModal';
import TimeSyncModal from './TimeSyncModal';

const navItems = [
  { id: 'home', label: 'Overview', Icon: Home },
  { id: 'strip', label: 'Smart Strip', Icon: Cpu, badge: 'Live Twin' },
  { id: 'schedule', label: 'Routine', Icon: Calendar },
  { id: 'activity', label: 'Activity Log', Icon: Activity },
  { id: 'device', label: 'Device Studio', Icon: Radio },
];

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    pillsRemaining,
    simulateDose,
    device,
    activeStrip,
    viewMode,
    setViewMode,
    currentTimeStr,
    isTimeLive,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [esp32ModalOpen, setEsp32ModalOpen] = useState(false);
  const [stripConfigModalOpen, setStripConfigModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-gray-lighter transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-2.5 group text-left focus:outline-none shrink-0"
              >
                {/* Minimal abstract sage badge */}
                <div className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-sage-deep text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="5" width="20" height="14" rx="4" stroke="#FFFFFF" strokeWidth="1.75" strokeOpacity="0.9" />
                    <circle cx="7" cy="12" r="2.2" fill="#E8F0EA" />
                    <path d="M12 9V15M12 9L15 12L18 9V15" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[17px] font-bold text-charcoal tracking-tight">
                      Med<span className="text-sage-deep">Strip</span>
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-sage-deep bg-sage-muted border border-sage/20 px-1.5 py-0.5 rounded-full">
                      Live Twin
                    </span>
                  </div>
                  <p className="hidden xl:block text-[11px] text-warm-gray tracking-tight -mt-0.5 font-medium">
                    Medication, without the guesswork.
                  </p>
                </div>
              </button>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 ml-1 pl-2 sm:pl-3 border-l border-warm-gray-lighter shrink-0">
                {navItems.map(({ id, label, Icon, badge }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`relative flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-[13px] font-bold transition-all duration-150 shrink-0 ${
                        isActive
                          ? 'text-sage-deep bg-sage-muted border border-sage/25 shadow-xs'
                          : 'text-warm-gray hover:text-charcoal hover:bg-warm-gray-lighter/30'
                      }`}
                    >
                      <Icon
                        size={15}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={isActive ? 'text-sage-deep' : 'text-warm-gray'}
                      />
                      <span>{label}</span>
                      {badge && (
                        <span className="hidden lg:inline-block text-[9.5px] font-extrabold text-sage-deep bg-sage-muted border border-sage/20 px-1.5 py-0.5 rounded-md">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Action & Controls Area */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Dual Mode Switcher: 💻 Web | 📱 Mobile */}
              <div className="flex items-center bg-warm-gray-lighter/60 p-0.5 rounded-xl border border-warm-gray-light/60 shadow-2xs">
                <button
                  onClick={() => setViewMode('web')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'web'
                      ? 'bg-white text-charcoal shadow-2xs'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                  title="Switch to Full Web Dashboard"
                >
                  <Monitor size={12} />
                  <span className="hidden sm:inline">Web</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'mobile'
                      ? 'bg-sage-deep text-white shadow-2xs'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                  title="Switch to Mobile Phone Prototype"
                >
                  <Smartphone size={12} />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              {/* Strip Switcher Pill: Metformin (∞) */}
              <button
                onClick={() => setStripConfigModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-muted hover:bg-sage-muted/80 text-sage-deep border border-sage/20 text-xs font-bold transition-all shadow-2xs shrink-0"
                title="Customize strip name and size"
              >
                <Layers size={13} className="text-sage-deep" />
                <span>{activeStrip.name.split(' ')[0]}</span>
              </button>

              {/* Time Sync / Controller Pill */}
              <button
                onClick={() => setTimeModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-ivory border border-warm-gray-lighter text-charcoal text-xs font-bold transition-all shadow-2xs shrink-0 group"
                title="Click to sync MedStrip time with laptop clock or set manual time"
              >
                <Clock size={13} className="text-sage-deep group-hover:rotate-45 transition-transform" />
                <span className="font-mono text-xs">{currentTimeStr}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isTimeLive ? 'bg-sage-deep animate-pulse' : 'bg-amber'}`}
                  title={isTimeLive ? 'Synced to Laptop' : 'Manual Time Override'}
                />
              </button>

              {/* Simulate Dose (Muted Sage Action Button) */}
              <button
                onClick={simulateDose}
                disabled={pillsRemaining === 0}
                className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 ${
                  pillsRemaining > 0
                    ? 'bg-sage-deep hover:bg-sage text-white shadow-xs active:scale-95'
                    : 'bg-warm-gray-lighter text-warm-gray cursor-not-allowed'
                }`}
                title="Click to simulate pill expulsion pressure event"
              >
                <Sparkles size={13} className="text-white" />
                <span>Simulate Dose</span>
              </button>

              {/* Live BLE ESP32 Hardware Badge */}
              <button
                onClick={() => setEsp32ModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white hover:bg-warm-gray-lighter/20 border border-warm-gray-lighter transition-all text-left shadow-2xs shrink-0"
                title="Click to manage ESP32 Bluetooth connection"
              >
                <div className="w-2 h-2 rounded-full bg-sage-deep shrink-0 animate-pulse" />
                <div className="hidden sm:block">
                  <p className="text-[11.5px] font-bold text-charcoal leading-none">
                    ESP32 Online
                  </p>
                  <p className="text-[10px] text-warm-gray font-mono mt-0.5 font-medium leading-none">
                    <span>{device.isRealBLE ? 'Real' : 'Demo'}</span>
                    <span> · </span>
                    <span className="text-sage-deep font-bold">D-{device.battery}%</span>
                  </p>
                </div>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-xl text-charcoal hover:bg-warm-gray-lighter/40 transition-colors shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-warm-gray-lighter bg-white px-4 pt-2 pb-4 space-y-2">
            {navItems.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-sage-muted text-sage-deep border border-sage/25 shadow-xs'
                      : 'text-charcoal hover:bg-warm-gray-lighter/30'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-sage-deep' : 'text-warm-gray'} />
                  <span>{label}</span>
                </button>
              );
            })}
            
            <div className="pt-2 border-t border-warm-gray-lighter flex items-center justify-between">
              <button
                onClick={() => {
                  setTimeModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-bold text-charcoal py-1"
              >
                <Clock size={14} className="text-sage-deep" />
                <span>Clock ({currentTimeStr})</span>
              </button>

              <button
                onClick={() => {
                  setStripConfigModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-bold text-charcoal py-1"
              >
                <SlidersHorizontal size={14} className="text-warm-gray" />
                <span>Strip Setup</span>
              </button>

              <button
                onClick={() => {
                  setEsp32ModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-bold text-sage-deep py-1"
              >
                <Bluetooth size={14} className="text-sage-deep" />
                <span>ESP32</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hardware Connection & Diagnostics Modal */}
      <ESP32Modal
        isOpen={esp32ModalOpen}
        onClose={() => setEsp32ModalOpen(false)}
      />

      {/* Strip Profile & Cavity Configuration Modal */}
      <StripConfigModal
        isOpen={stripConfigModalOpen}
        onClose={() => setStripConfigModalOpen(false)}
      />

      {/* Clock Synchronization & Time Controller Modal */}
      <TimeSyncModal
        isOpen={timeModalOpen}
        onClose={() => setTimeModalOpen(false)}
      />
    </>
  );
}
