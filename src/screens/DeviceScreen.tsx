import { useState } from 'react';
import { Cpu, Radio, ShieldCheck, Sliders, Bluetooth } from 'lucide-react';
import { useApp } from '../store/AppContext';
import ESP32Modal from '../components/ESP32Modal';

export default function DeviceScreen() {
  const { setActiveTab, device } = useApp();
  const [showESP32Modal, setShowESP32Modal] = useState(false);

  const isConnected = device.status === 'connected';

  const hardwareSpecs = [
    { label: 'Device Model', value: device.name },
    { label: 'Form Factor', value: 'Reusable spring-loaded blister clamp' },
    { label: 'MCU Architecture', value: 'Espressif ESP32-C3 (32-bit RISC-V @ 160MHz)' },
    { label: 'Wireless Protocol', value: 'Bluetooth Low Energy 5.2' },
    { label: 'Connection State', value: isConnected ? (device.isRealBLE ? 'Real BLE Hardware Paired' : 'Demo Hardware Connected') : 'Disconnected' },
    { label: 'Sensor Technology', value: 'Piezoresistive pressure strain gauge array' },
    { label: 'Active Channels', value: `${device.sensorChannels} Calibrated Strain Channels` },
    { label: 'Battery Capacity', value: `${device.battery}% · 140 mAh Li-Po (~45–60 days)` },
    { label: 'Firmware Build', value: device.firmware },
    { label: 'MAC / Serial ID', value: device.macAddress },
  ];

  return (
    <div className="screen-enter space-y-6 sm:space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 sm:pb-6 border-b border-warm-gray-lighter">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs border ${
              isConnected
                ? 'text-sage-deep bg-sage-muted border-sage/25'
                : 'text-red-alert bg-red-alert-light border-red-alert/25'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-sage-deep animate-pulse' : 'bg-red-alert'}`} />
              {isConnected ? 'ESP32 Online' : 'ESP32 Disconnected'}
            </span>
            <span className="text-xs text-warm-gray font-medium">
              {device.isRealBLE ? 'Physical Web Bluetooth Link' : 'Simulated ESP32 Hardware'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight mt-2">
            Physical Device Studio
          </h1>
          <p className="text-xs sm:text-sm text-warm-gray font-medium mt-1">
            Engineering specifications and hardware digital twin of the MedStrip physical clip.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setShowESP32Modal(true)}
            className="px-4 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <Bluetooth size={15} className="text-white" />
            <span>Manage ESP32 Connection</span>
          </button>

          <button
            onClick={() => setActiveTab('strip')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-ivory-warm border border-warm-gray-lighter text-xs font-bold text-charcoal transition-all shadow-2xs hidden sm:block"
          >
            View Live Strip →
          </button>
        </div>
      </div>

      {/* 2-Column Hardware Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Architectural Vector Illustration of Hardware (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal tracking-tight">
                  Hardware Architecture & Physical Render
                </h2>
                <p className="text-xs text-warm-gray font-medium mt-0.5">
                  Reusable electronic clip securely clamped to a standard medicine strip
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-sage-deep bg-sage-muted border border-sage/25 px-2.5 py-1 rounded-lg shadow-2xs">
                1:1 Scale Model
              </span>
            </div>

            {/* Product Render SVG */}
            <div className="mt-6 py-4 flex items-center justify-center bg-ivory/50 rounded-xl border border-warm-gray-lighter/60">
              <div className="relative w-full max-w-[460px] h-[250px]">
                <svg
                  viewBox="0 0 280 190"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-sm"
                >
                  <defs>
                    <linearGradient id="foilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#F5F2ED" />
                      <stop offset="100%" stopColor="#E8E4DF" />
                    </linearGradient>
                    <linearGradient id="clipBody" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#FAF8F5" />
                      <stop offset="100%" stopColor="#EDE8E1" />
                    </linearGradient>
                    <linearGradient id="clipAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E8F0EA" />
                      <stop offset="100%" stopColor="#D5E6D8" />
                    </linearGradient>
                    <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8EB896" />
                      <stop offset="100%" stopColor="#5B7D62" />
                    </linearGradient>
                  </defs>

                  {/* Medicine Blister Strip Body */}
                  <rect
                    x="40"
                    y="75"
                    width="200"
                    height="68"
                    rx="12"
                    fill="url(#foilGrad)"
                    stroke="#D9D4CE"
                    strokeWidth="1.5"
                  />

                  {/* Foil Perforation Grid */}
                  <path
                    d="M75 75 L75 143 M107 75 L107 143 M140 75 L140 143 M173 75 L173 143 M205 75 L205 143"
                    stroke="#D9D4CE"
                    strokeWidth="0.75"
                    strokeDasharray="2 2"
                  />

                  {/* Cavities with Pills */}
                  {/* Row 1 Cavities */}
                  <rect x="49" y="87" width="18" height="42" rx="9" fill="url(#pillGrad)" stroke="#4A6E50" strokeWidth="0.75" />
                  <rect x="81" y="87" width="18" height="42" rx="9" fill="url(#pillGrad)" stroke="#4A6E50" strokeWidth="0.75" />
                  
                  {/* Center Cavity (Clamped & Expelled) */}
                  <rect x="113" y="87" width="18" height="42" rx="9" fill="#E8F0EA" stroke="#7C9A82" strokeWidth="1" strokeDasharray="2 2" />
                  <path d="M118 104 L126 112 M126 104 L118 112" stroke="#7C9A82" strokeWidth="1.5" strokeLinecap="round" />

                  <rect x="145" y="87" width="18" height="42" rx="9" fill="url(#pillGrad)" stroke="#4A6E50" strokeWidth="0.75" />
                  <rect x="177" y="87" width="18" height="42" rx="9" fill="url(#pillGrad)" stroke="#4A6E50" strokeWidth="0.75" />
                  <rect x="209" y="87" width="18" height="42" rx="9" fill="url(#pillGrad)" stroke="#4A6E50" strokeWidth="0.75" />

                  {/* Tablet score lines */}
                  <line x1="51" y1="108" x2="65" y2="108" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                  <line x1="83" y1="108" x2="97" y2="108" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                  <line x1="147" y1="108" x2="161" y2="108" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                  <line x1="179" y1="108" x2="193" y2="108" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                  <line x1="211" y1="108" x2="225" y2="108" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

                  {/* The Physical Reusable Smart Clip */}
                  <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))">
                    {/* Main Clip Enclosure */}
                    <rect
                      x="92"
                      y="25"
                      width="96"
                      height="58"
                      rx="14"
                      fill="url(#clipBody)"
                      stroke="#7C9A82"
                      strokeWidth="1.5"
                    />

                    {/* Clip Inset Accent Panel */}
                    <rect
                      x="96"
                      y="29"
                      width="88"
                      height="38"
                      rx="10"
                      fill="url(#clipAccent)"
                      stroke="#A8C5AE"
                      strokeWidth="0.75"
                    />

                    {/* Brand Typography */}
                    <text
                      x="140"
                      y="44"
                      textAnchor="middle"
                      fill="#2D2D2D"
                      fontSize="9"
                      fontFamily="Inter, sans-serif"
                      fontWeight="800"
                      letterSpacing="0.08em"
                    >
                      MEDSTRIP
                    </text>

                    {/* Green LED */}
                    <circle cx="107" cy="55" r="3.5" fill={isConnected ? '#5B7D62' : '#C45B5B'}>
                      {isConnected && (
                        <animate
                          attributeName="opacity"
                          values="1;0.4;1"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>

                    <text
                      x="144"
                      y="58"
                      textAnchor="middle"
                      fill="#5B7D62"
                      fontSize="7.5"
                      fontFamily="Inter, sans-serif"
                      fontWeight="700"
                    >
                      ESP32 · Pressure Array
                    </text>

                    {/* Clamp jaws gripping foil */}
                    <path
                      d="M92 72 Q140 76 188 72 L188 80 Q140 84 92 80 Z"
                      fill="#E8E4DF"
                      stroke="#D9D4CE"
                      strokeWidth="1"
                    />
                  </g>

                  {/* Engineering Annotations */}
                  <g opacity="0.85">
                    <text x="140" y="14" textAnchor="middle" fill="#7A7570" fontSize="8" fontWeight="600">
                      Reusable Smart Electronic Clip
                    </text>
                    <text x="235" y="165" textAnchor="end" fill="#7A7570" fontSize="7" fontFamily="monospace">
                      Standard Blister Pack Foil
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 border-t border-warm-gray-lighter text-xs">
              <div className="p-3.5 rounded-xl bg-ivory-warm/60 border border-warm-gray-lighter">
                <span className="font-bold text-charcoal block text-xs">1. Reusable Clip</span>
                <span className="text-warm-gray text-[11px] mt-1 block leading-relaxed font-normal">
                  Easily unclamps and transfers to any standard blister pack when depleted.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-sage-muted/50 border border-sage/20">
                <span className="font-bold text-sage-deep block text-xs">2. Pressure Sensing</span>
                <span className="text-warm-gray text-[11px] mt-1 block leading-relaxed font-normal">
                  Piezo sensor array detects foil deformation when a tablet is pushed through.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-ivory-warm/60 border border-warm-gray-lighter">
                <span className="font-bold text-charcoal block text-xs">3. BLE Transmission</span>
                <span className="text-warm-gray text-[11px] mt-1 block leading-relaxed font-normal">
                  Instantly transmits cryptographically confirmed dose event to companion web app.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Telemetry Table (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-warm-gray-lighter shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sage-muted text-sage-deep flex items-center justify-center border border-sage/25 shadow-2xs">
                  <Cpu size={16} strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-charcoal">
                  Hardware Telemetry & Specs
                </h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs border ${
                isConnected
                  ? 'text-sage-deep bg-sage-muted border-sage/25'
                  : 'text-red-alert bg-red-alert-light border-red-alert/25'
              }`}>
                <ShieldCheck size={13} strokeWidth={2.5} />
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-warm-gray-lighter overflow-hidden divide-y divide-warm-gray-lighter text-xs">
              {hardwareSpecs.map((spec) => (
                <div key={spec.label} className="py-2.5 px-3.5 flex items-center justify-between gap-4 odd:bg-ivory/50 even:bg-white">
                  <span className="text-warm-gray font-medium">{spec.label}</span>
                  <span className="font-bold text-charcoal text-right font-mono text-[11.5px]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Diagnostic Control Buttons */}
            <div className="mt-6 pt-5 border-t border-warm-gray-lighter space-y-2.5">
              <button
                onClick={() => setShowESP32Modal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <Bluetooth size={15} className="text-white" />
                <span>Manage ESP32 & Web Bluetooth Scanner</span>
              </button>

              <button
                onClick={() => alert(`Diagnostic ping: ${device.name} responded in 12ms (ESP32-C3 nominal)`)}
                className="w-full py-2.5 px-4 rounded-xl bg-ivory-warm hover:bg-warm-gray-lighter/40 text-charcoal text-xs font-bold transition-all border border-warm-gray-lighter flex items-center justify-center gap-2 shadow-2xs"
              >
                <Radio size={14} className="text-sage-deep" />
                <span>Run Hardware Sensor Diagnostic Ping</span>
              </button>

              <button
                onClick={() => alert(`Sensors calibrated across all ${device.sensorChannels} channels to 0.85 bar threshold`)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-light hover:bg-amber-light/80 text-amber text-xs font-bold transition-all border border-amber/20 flex items-center justify-center gap-2 shadow-2xs"
              >
                <Sliders size={14} className="text-amber" />
                <span>Calibrate Pressure Baseline</span>
              </button>
            </div>
          </div>

          {/* Project Evaluation Panel Callout */}
          <div className="p-5 rounded-2xl bg-sage-muted/60 border border-sage/25 text-xs text-charcoal leading-relaxed shadow-2xs">
            <span className="font-bold text-sage-deep uppercase tracking-wider text-[11px] block mb-1">
              Project Demonstration Hardware
            </span>
            MedStrip operates with both real physical ESP32 peripherals (via Web Bluetooth API in supported browsers) and simulated demo hardware profiles. The system monitors ADC strain gauge readings and broadcasts BLE packets upon pill extrusion.
          </div>
        </div>
      </div>

      {/* ESP32 Manager Modal */}
      <ESP32Modal
        isOpen={showESP32Modal}
        onClose={() => setShowESP32Modal(false)}
      />
    </div>
  );
}
