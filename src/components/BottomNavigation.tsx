import { Home, Cpu, Calendar, Activity, Radio } from 'lucide-react';
import { useApp } from '../store/AppContext';

const tabs = [
  { id: 'home', label: 'Today', Icon: Home },
  { id: 'strip', label: 'Smart Strip', Icon: Cpu },
  { id: 'schedule', label: 'Routine', Icon: Calendar },
  { id: 'activity', label: 'Activity', Icon: Activity },
  { id: 'device', label: 'Device', Icon: Radio },
];

export default function BottomNavigation() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-warm-gray-lighter shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around px-2 pt-2.5 pb-5">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="group relative flex flex-col items-center gap-1 py-1 px-2.5 transition-transform duration-150 active:scale-95"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator dot */}
              <div
                className={`
                  w-1.5 h-1.5 rounded-full bg-sage-deep transition-all duration-300
                  ${isActive ? 'opacity-100 scale-100 mb-0.5' : 'opacity-0 scale-0 -mb-1'}
                `}
              />
              <Icon
                size={19}
                strokeWidth={isActive ? 2.5 : 1.75}
                className={`
                  transition-colors duration-200
                  ${isActive ? 'text-sage-deep' : 'text-warm-gray group-hover:text-charcoal'}
                `}
              />
              <span
                className={`
                  text-[10.5px] tracking-tight transition-colors duration-200
                  ${isActive ? 'text-charcoal font-bold' : 'text-warm-gray group-hover:text-charcoal font-medium'}
                `}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
