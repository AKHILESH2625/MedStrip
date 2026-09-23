import { useState } from 'react';
import { useApp } from './store/AppContext';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import Toast from './components/Toast';
import TimeSyncModal from './components/TimeSyncModal';
import HomeScreen from './screens/HomeScreen';
import StripScreen from './screens/StripScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import ActivityScreen from './screens/ActivityScreen';
import DeviceScreen from './screens/DeviceScreen';
import { Smartphone, Monitor, Clock } from 'lucide-react';

function AppShell() {
  const { activeTab, viewMode, setViewMode, currentTimeStr, isTimeLive } = useApp();
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen key="home" />;
      case 'strip':
        return <StripScreen key="strip" />;
      case 'schedule':
        return <ScheduleScreen key="schedule" />;
      case 'activity':
        return <ActivityScreen key="activity" />;
      case 'device':
        return <DeviceScreen key="device" />;
      default:
        return <HomeScreen key="home" />;
    }
  };

  // Mobile App Prototype Mode (Original Step 0 Phone Frame)
  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center bg-[#EDE9E3] p-3 sm:p-6 transition-colors">
        {/* Top Control Bar for Presentation / Demo */}
        <div className="w-full max-w-[420px] flex items-center justify-between mb-3 px-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sage-deep bg-sage-muted px-2.5 py-1 rounded-full border border-sage/20">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-deep animate-pulse" />
              Phone Prototype
            </span>

            {/* Clickable Time Pill in Top Demo Bar */}
            <button
              onClick={() => setTimeModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal bg-white px-2.5 py-1 rounded-full border border-warm-gray-lighter shadow-2xs hover:bg-ivory transition-colors group"
              title="Click to sync with laptop clock or pick demo time"
            >
              <Clock size={12} className="text-sage-deep group-hover:rotate-45 transition-transform" />
              <span className="font-mono">{currentTimeStr}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isTimeLive ? 'bg-sage-deep animate-pulse' : 'bg-amber'}`} />
            </button>
          </div>

          <div className="flex items-center bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-warm-gray-lighter shadow-xs">
            <button
              onClick={() => setViewMode('mobile')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all bg-sage-deep text-white shadow-2xs"
            >
              <Smartphone size={13} />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-charcoal hover:text-charcoal-light transition-all"
            >
              <Monitor size={13} />
              <span>Web</span>
            </button>
          </div>
        </div>

        {/* Desktop Phone Mockup Frame */}
        <div className="relative w-full max-w-[390px] shrink-0">
          {/* Outer Bezel (Desktop only - sleek graphite titanium) */}
          <div className="hidden sm:block absolute -inset-[12px] rounded-[3rem] bg-[#2E312F] pointer-events-none shadow-2xl shadow-charcoal/20 border border-[#454B47]" />

          {/* Dynamic Island (Desktop only) */}
          <div className="hidden sm:flex absolute top-[3px] left-1/2 -translate-x-1/2 z-40 w-[114px] h-[28px] bg-[#2E312F] rounded-full items-center justify-between px-3 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1C1E1D] border border-[#3E423F]" />
            <div className="w-2 h-2 rounded-full bg-sage-deep animate-pulse" />
          </div>

          {/* Phone Screen Container */}
          <div className="relative bg-[#FAF8F5] sm:rounded-[2.4rem] min-h-screen sm:min-h-0 sm:h-[810px] overflow-hidden flex flex-col shadow-inner border border-warm-gray-lighter/80">
            {/* Status bar with interactive time */}
            <div className="h-11 flex items-end justify-between px-6 pb-1 shrink-0 z-30 bg-white/50 backdrop-blur-xs">
              <button
                onClick={() => setTimeModalOpen(true)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-charcoal hover:text-sage-deep transition-colors"
                title="Click to change or sync time"
              >
                <span>{currentTimeStr}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isTimeLive ? 'bg-sage-deep' : 'bg-amber'}`} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-warm-gray">BLE 5.2</span>
                <span className="w-2 h-2 rounded-full bg-sage-deep" />
              </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 px-4 pt-2">
              {renderScreen()}
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation />

            {/* Floating Toast */}
            <Toast />
          </div>
        </div>

        {/* Time Controller Modal in Mobile Mode */}
        <TimeSyncModal
          isOpen={timeModalOpen}
          onClose={() => setTimeModalOpen(false)}
        />
      </div>
    );
  }

  // Web Dashboard Mode (Original Full-Width Laptop Layout)
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-charcoal transition-colors duration-200">
      {/* Top Web Navigation Header */}
      <Navbar />

      {/* Main Web Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {renderScreen()}
      </main>

      {/* Web Footer */}
      <footer className="border-t border-warm-gray-lighter py-6 mt-12 bg-white/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-warm-gray">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-charcoal">
              Med<span className="text-sage-deep">Strip</span>
            </span>
            <span>·</span>
            <span>Physical Smart Clip Blister Monitoring System</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage-muted text-sage-deep font-bold border border-sage/20 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-deep animate-pulse" />
              ESP32-C3 Active
            </span>
            <span>Proof of Concept Prototype</span>
          </div>
        </div>
      </footer>

      {/* Floating Web Toast */}
      <Toast />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
