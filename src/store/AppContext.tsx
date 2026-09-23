import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface PillSlot {
  id: number;
  hasPill: boolean;
  detectedAt?: string;
  detectedDate?: string;
}

export interface ActivityEvent {
  id: string;
  time: string;
  date: string;
  dateLabel: string;
  medication: string;
  dose: string;
  type: 'dose_detected' | 'reminder' | 'device_connected';
}

export interface DoseSchedule {
  id: string;
  time: string;
  timeLabel: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  medication: string;
  dose: string;
  status: 'taken' | 'upcoming' | 'missed';
  detectedAt?: string;
}

export interface StripProfile {
  id: string;
  name: string;
  size: number;
  dosage: string;
  lotNumber: string;
  expDate: string;
  pills: PillSlot[];
}

export interface ESP32Device {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'scanning';
  battery: number;
  rssi: number;
  firmware: string;
  isRealBLE: boolean;
  macAddress: string;
  sensorChannels: number;
}

interface AppState {
  // Active Strip & Profiles
  activeStrip: StripProfile;
  stripProfiles: StripProfile[];
  pills: PillSlot[];
  pillsRemaining: number;
  dosesDetected: number;

  // Routine & Activity
  schedule: DoseSchedule[];
  activities: ActivityEvent[];
  selectedPill: PillSlot | null;
  activeTab: string;
  toastMessage: string | null;

  // Theme & View Mode
  isDarkMode: boolean;
  viewMode: 'web' | 'mobile';

  // Live / Manual Time Controller
  currentTimeStr: string;
  isTimeLive: boolean;

  // Hardware ESP32 State
  device: ESP32Device;
  availableDevices: ESP32Device[];
  bleLogs: string[];
}

interface AppContextType extends AppState {
  // Actions
  simulateDose: () => void;
  reloadNewStrip: (count?: number, name?: string) => void;
  updateActiveStrip: (name: string, size: number, dosage: string) => void;
  addStripProfile: (name: string, size: number, dosage: string) => void;
  switchStripProfile: (id: string) => void;

  // Schedule Management
  addScheduleDose: (dose: Omit<DoseSchedule, 'id'>) => void;
  updateScheduleDose: (id: string, updated: Partial<DoseSchedule>) => void;
  deleteScheduleDose: (id: string) => void;

  // Navigation & UI
  selectPill: (pill: PillSlot | null) => void;
  setActiveTab: (tab: string) => void;
  dismissToast: () => void;
  toggleDarkMode: () => void;
  setViewMode: (mode: 'web' | 'mobile') => void;

  // Time Controller
  syncLaptopTime: () => void;
  setManualTime: (timeString: string) => void;

  // ESP32 Hardware Actions
  connectDummyESP32: (deviceName?: string) => void;
  disconnectESP32: () => void;
  connectRealBLE: () => Promise<boolean>;
  addBleLog: (msg: string) => void;
}

// Helper to create pill slots
function createPillSlots(count: number, initialTakenCount = 1): PillSlot[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    hasPill: i >= initialTakenCount,
    detectedAt: i < initialTakenCount ? '8:02 AM' : undefined,
    detectedDate: i < initialTakenCount ? 'Today' : undefined,
  }));
}

const defaultProfiles: StripProfile[] = [
  {
    id: 'strip-1',
    name: 'Metformin Hydrochloride',
    size: 6,
    dosage: '500 mg',
    lotNumber: 'LOT-8842',
    expDate: '11/2027',
    pills: createPillSlots(6, 1),
  },
  {
    id: 'strip-2',
    name: 'Vitamin D3 Cholecalciferol',
    size: 4,
    dosage: '1000 IU',
    lotNumber: 'LOT-4120',
    expDate: '04/2028',
    pills: createPillSlots(4, 0),
  },
  {
    id: 'strip-3',
    name: 'Amoxicillin Trihydrate',
    size: 10,
    dosage: '250 mg',
    lotNumber: 'LOT-9921',
    expDate: '08/2026',
    pills: createPillSlots(10, 2),
  },
];

const initialActivities: ActivityEvent[] = [
  {
    id: '1',
    time: '8:02 AM',
    date: 'Today',
    dateLabel: 'Today',
    medication: 'Metformin',
    dose: '500 mg',
    type: 'dose_detected',
  },
  {
    id: '2',
    time: '8:04 AM',
    date: 'Yesterday',
    dateLabel: 'Yesterday',
    medication: 'Metformin',
    dose: '500 mg',
    type: 'dose_detected',
  },
  {
    id: '3',
    time: '8:01 PM',
    date: 'Yesterday',
    dateLabel: 'Yesterday',
    medication: 'Metformin',
    dose: '500 mg',
    type: 'dose_detected',
  },
];

const initialSchedule: DoseSchedule[] = [
  {
    id: '1',
    time: '08:00',
    timeLabel: '8:00 AM',
    period: 'Morning',
    medication: 'Metformin',
    dose: '500 mg',
    status: 'taken',
    detectedAt: '8:02 AM',
  },
  {
    id: '2',
    time: '14:00',
    timeLabel: '2:00 PM',
    period: 'Afternoon',
    medication: 'Vitamin D',
    dose: '1 tablet',
    status: 'upcoming',
  },
  {
    id: '3',
    time: '20:00',
    timeLabel: '8:00 PM',
    period: 'Night',
    medication: 'Metformin',
    dose: '500 mg',
    status: 'upcoming',
  },
];

const dummyESP32Device: ESP32Device = {
  id: 'esp32-default',
  name: 'MedStrip-ESP32-C3 (MS-00247)',
  status: 'connected',
  battery: 87,
  rssi: -54,
  firmware: 'v1.2.0-esp32-release',
  isRealBLE: false,
  macAddress: 'D4:E2:C6:18:3F:2A',
  sensorChannels: 6,
};

const nearbyDiscoveredDevices: ESP32Device[] = [
  dummyESP32Device,
  {
    id: 'esp32-s3',
    name: 'MedStrip-ESP32-S3 (MS-00891)',
    status: 'disconnected',
    battery: 94,
    rssi: -68,
    firmware: 'v1.3.1-esp32s3',
    isRealBLE: false,
    macAddress: 'E0:5A:1B:77:42:09',
    sensorChannels: 10,
  },
  {
    id: 'esp32-custom',
    name: 'Custom ESP32 BLE Peripheral (0x3F)',
    status: 'disconnected',
    battery: 72,
    rssi: -79,
    firmware: 'v1.0.4-dev',
    isRealBLE: false,
    macAddress: 'A4:CF:12:90:EE:11',
    sensorChannels: 8,
  },
];

const initialBleLogs = [
  '[SYS] MedStrip BLE Service initialized',
  '[BLE RX] ADV_IND from D4:E2:C6:18:3F:2A (RSSI: -54 dBm)',
  '[BLE GATT] Connected to MedStrip-ESP32-C3',
  '[BLE NOTIFY] Char 0x2A19 (Battery Level): 87%',
  '[BLE NOTIFY] Char 0xFF01 (Strain Baseline): 0.04 bar across 6 channels',
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme state: permanently set to light mode as requested
  const isDarkMode = false;

  // Strip profiles
  const [stripProfiles, setStripProfiles] = useState<StripProfile[]>(defaultProfiles);
  const [activeStripId, setActiveStripId] = useState<string>('strip-1');

  // Routine & Activity
  const [schedule, setSchedule] = useState<DoseSchedule[]>(initialSchedule);
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPill, setSelectedPill] = useState<PillSlot | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  // Hardware ESP32 state
  const [device, setDevice] = useState<ESP32Device>(dummyESP32Device);
  const [availableDevices] = useState<ESP32Device[]>(nearbyDiscoveredDevices);
  const [bleLogs, setBleLogs] = useState<string[]>(initialBleLogs);

  // Dual View Mode: 'web' | 'mobile'
  const [viewMode, setViewMode] = useState<'web' | 'mobile'>('web');

  // Live Laptop Time & Manual Override State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isTimeLive, setIsTimeLive] = useState<boolean>(true);
  const [manualTimeString, setManualTimeString] = useState<string>('');

  useEffect(() => {
    if (!isTimeLive) return;
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimeLive]);

  const currentTimeStr = isTimeLive
    ? currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : (manualTimeString || currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  const syncLaptopTime = useCallback(() => {
    setIsTimeLive(true);
    setCurrentDate(new Date());
    setToastMessage('Clock synchronized with laptop system time');
  }, []);

  const setManualTime = useCallback((timeString: string) => {
    setIsTimeLive(false);
    setManualTimeString(timeString);
    setToastMessage(`MedStrip clock adjusted to ${timeString}`);
  }, []);

  // Ensure dark mode class is permanently removed from <html>
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('medstrip_theme');
  }, []);

  const toggleDarkMode = useCallback(() => {
    // Light mode locked permanently
    document.documentElement.classList.remove('dark');
  }, []);

  const activeStrip = stripProfiles.find(s => s.id === activeStripId) || stripProfiles[0];
  const pills = activeStrip.pills;
  const pillsRemaining = pills.filter(p => p.hasPill).length;
  const dosesDetected = pills.filter(p => !p.hasPill).length;

  const addBleLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setBleLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 40)]);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const selectPill = useCallback((pill: PillSlot | null) => {
    setSelectedPill(pill);
  }, []);

  // Update pills inside the active strip
  const setPillsForActiveStrip = useCallback((updater: (prevPills: PillSlot[]) => PillSlot[]) => {
    setStripProfiles(prev =>
      prev.map(strip => {
        if (strip.id === activeStripId) {
          const newPills = updater(strip.pills);
          return { ...strip, pills: newPills };
        }
        return strip;
      })
    );
  }, [activeStripId]);

  // Simulate dose expulsion
  const simulateDose = useCallback(() => {
    const firstPillIndex = pills.findIndex(p => p.hasPill);
    const timeStr = currentTimeStr;

    setPillsForActiveStrip(prev =>
      prev.map((p, i) =>
        i === firstPillIndex
          ? { ...p, hasPill: false, detectedAt: timeStr, detectedDate: 'Today' }
          : p
      )
    );

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      time: timeStr,
      date: 'Today',
      dateLabel: 'Today',
      medication: activeStrip.name,
      dose: activeStrip.dosage,
      type: 'dose_detected',
    };
    setActivities(prev => [newActivity, ...prev]);

    // Update the next upcoming dose in schedule
    setSchedule(prev => {
      const nextUpcoming = prev.findIndex(s => s.status === 'upcoming');
      if (nextUpcoming === -1) return prev;
      return prev.map((s, i) =>
        i === nextUpcoming
          ? { ...s, status: 'taken' as const, detectedAt: timeStr }
          : s
      );
    });

    addBleLog(`BLE NOTIFY CH_0${firstPillIndex + 1}: Pressure event 1.42 bar [DOSE CONFIRMED]`);
    setToastMessage(`Dose detected · ${activeStrip.name} at ${timeStr}`);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, [pills, activeStrip, setPillsForActiveStrip, addBleLog]);

  // Reload / Refill current strip with fresh pills
  const reloadNewStrip = useCallback((count?: number, name?: string) => {
    const targetSize = count || activeStrip.size;
    const targetName = name || activeStrip.name;
    const freshPills = createPillSlots(targetSize, 0);

    setPillsForActiveStrip(() => freshPills);
    setSelectedPill(freshPills[0]);

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      time: timeStr,
      date: 'Today',
      dateLabel: 'Today',
      medication: targetName,
      dose: `New ${targetSize}-Pack Strip Clamped`,
      type: 'device_connected',
    };
    setActivities(prev => [newActivity, ...prev]);

    addBleLog(`BLE WRITE: Recalibrated baseline for ${targetSize} channels on ${targetName}`);
    setToastMessage(`New blister strip clamped: ${targetSize} fresh pills armed`);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, [activeStrip, setPillsForActiveStrip, addBleLog]);

  // Update active strip configuration (Name, Size, Dosage)
  const updateActiveStrip = useCallback((name: string, size: number, dosage: string) => {
    setStripProfiles(prev =>
      prev.map(strip => {
        if (strip.id === activeStripId) {
          // If size changed, re-create pills to match exact size
          const newPills = size !== strip.size ? createPillSlots(size, 0) : strip.pills;
          return {
            ...strip,
            name,
            size,
            dosage,
            pills: newPills,
          };
        }
        return strip;
      })
    );

    addBleLog(`CONFIG: Strip modified -> "${name}" with ${size} cavities (${dosage})`);
    setToastMessage(`Strip updated: "${name}" (${size} cavities)`);
    setTimeout(() => setToastMessage(null), 3000);
  }, [activeStripId, addBleLog]);

  // Add a brand new strip profile
  const addStripProfile = useCallback((name: string, size: number, dosage: string) => {
    const newId = `strip-${Date.now()}`;
    const newProfile: StripProfile = {
      id: newId,
      name,
      size,
      dosage,
      lotNumber: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      expDate: '12/2028',
      pills: createPillSlots(size, 0),
    };

    setStripProfiles(prev => [...prev, newProfile]);
    setActiveStripId(newId);

    addBleLog(`BLE: Switched to new strip configuration "${name}" (${size} pills)`);
    setToastMessage(`Added and paired new strip: "${name}"`);
    setTimeout(() => setToastMessage(null), 3000);
  }, [addBleLog]);

  // Switch between strips
  const switchStripProfile = useCallback((id: string) => {
    setActiveStripId(id);
    const target = stripProfiles.find(s => s.id === id);
    if (target) {
      addBleLog(`BLE: Switched profile to "${target.name}" (${target.size} cavities)`);
      setToastMessage(`Active strip: "${target.name}"`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  }, [stripProfiles, addBleLog]);

  // Schedule / Routine Management
  const addScheduleDose = useCallback((dose: Omit<DoseSchedule, 'id'>) => {
    const newId = `dose-${Date.now()}`;
    setSchedule(prev => [...prev, { ...dose, id: newId }]);
    addBleLog(`ROUTINE: Added scheduled dose ${dose.medication} (${dose.timeLabel})`);
    setToastMessage(`Added ${dose.medication} to routine`);
    setTimeout(() => setToastMessage(null), 3000);
  }, [addBleLog]);

  const updateScheduleDose = useCallback((id: string, updated: Partial<DoseSchedule>) => {
    setSchedule(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updated } : item))
    );
    setToastMessage('Routine updated');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const deleteScheduleDose = useCallback((id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
    setToastMessage('Dose removed from routine');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Hardware ESP32 Connection management
  const connectDummyESP32 = useCallback((deviceName?: string) => {
    const targetName = deviceName || dummyESP32Device.name;
    setDevice({
      ...dummyESP32Device,
      name: targetName,
      status: 'connected',
    });
    addBleLog(`BLE GATT: Connected to ${targetName} [SIMULATED HARDWARE]`);
    setToastMessage(`Connected to ${targetName}`);
    setTimeout(() => setToastMessage(null), 3000);
  }, [addBleLog]);

  const disconnectESP32 = useCallback(() => {
    setDevice(prev => ({
      ...prev,
      status: 'disconnected',
    }));
    addBleLog('BLE GATT: Device disconnected by user');
    setToastMessage('MedStrip Clip disconnected');
    setTimeout(() => setToastMessage(null), 3000);
  }, [addBleLog]);

  // Real Web Bluetooth connection attempt with automatic fallback
  const connectRealBLE = useCallback(async (): Promise<boolean> => {
    const nav = navigator as unknown as { bluetooth?: { requestDevice: (opt: unknown) => Promise<{ name?: string; id: string }> } };
    if (!nav.bluetooth) {
      addBleLog('Web Bluetooth API not supported in this browser. Falling back to ESP32 simulation.');
      connectDummyESP32('MedStrip-ESP32-C3 (Simulated)');
      return false;
    }

    try {
      addBleLog('Opening Web Bluetooth device scanner...');
      setDevice(prev => ({ ...prev, status: 'scanning' }));
      const bleDevice = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information'],
      });

      setDevice({
        id: bleDevice.id,
        name: bleDevice.name || 'ESP32 BLE Peripheral',
        status: 'connected',
        battery: 89,
        rssi: -48,
        firmware: 'v1.2.0-esp32-real',
        isRealBLE: true,
        macAddress: 'REAL:BLE:ESP32:DEVICE',
        sensorChannels: activeStrip.size,
      });

      addBleLog(`Web Bluetooth: Connected to physical device "${bleDevice.name || 'ESP32'}"`);
      setToastMessage(`Connected to real hardware: ${bleDevice.name || 'ESP32'}`);
      setTimeout(() => setToastMessage(null), 3500);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addBleLog(`Web Bluetooth scan canceled or unavailable: ${errorMsg}. Reconnected to dummy ESP32.`);
      connectDummyESP32();
      return false;
    }
  }, [activeStrip.size, addBleLog, connectDummyESP32]);

  return (
    <AppContext.Provider
      value={{
        // Strip state
        activeStrip,
        stripProfiles,
        pills,
        pillsRemaining,
        dosesDetected,

        // Routine & Activity
        schedule,
        activities,
        selectedPill,
        activeTab,
        toastMessage,

        // Theme & View Mode
        isDarkMode,
        viewMode,
        setViewMode,

        // Live / Manual Time Controller
        currentTimeStr,
        isTimeLive,
        syncLaptopTime,
        setManualTime,

        // Hardware ESP32 state
        device,
        availableDevices,
        bleLogs,

        // Functions
        simulateDose,
        reloadNewStrip,
        updateActiveStrip,
        addStripProfile,
        switchStripProfile,
        addScheduleDose,
        updateScheduleDose,
        deleteScheduleDose,
        selectPill,
        setActiveTab,
        dismissToast,
        toggleDarkMode,
        connectDummyESP32,
        disconnectESP32,
        connectRealBLE,
        addBleLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
