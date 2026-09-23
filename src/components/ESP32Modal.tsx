import { useState } from 'react';
import { Bluetooth, Radio, Battery, Wifi, X, Check, RefreshCw, Terminal, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function ESP32Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { device, availableDevices, connectDummyESP32, disconnectESP32, connectRealBLE, bleLogs } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'devices' | 'console'>('devices');

  if (!isOpen) return null;

  const handleScanReal = async () => {
    setIsScanning(true);
    await connectRealBLE();
    setIsScanning(false);
  };

  const isConnected = device.status === 'connected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-xs screen-enter">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-warm-gray-lighter text-charcoal space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-2xs ${
              isConnected
                ? 'bg-sage-muted text-sage-deep border-sage/25'
                : 'bg-ivory-warm text-warm-gray border-warm-gray-lighter'
            }`}>
              <Bluetooth size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-charcoal">
                  ESP32 BLE Connection Manager
                </h3>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  isConnected
                    ? 'bg-sage-muted text-sage-deep border-sage/25'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isConnected ? (device.isRealBLE ? 'Real Hardware' : 'Demo Connected') : 'Disconnected'}
                </span>
              </div>
              <p className="text-xs text-warm-gray font-semibold">
                Hardware interface for ESP32 BLE strain sensor telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-warm-gray hover:text-charcoal hover:bg-ivory-warm transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher: Devices vs Live Packet Console */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-ivory border border-warm-gray-lighter text-xs font-bold">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'devices'
                ? 'bg-white shadow-2xs text-sage-deep font-extrabold border border-warm-gray-lighter/80'
                : 'text-warm-gray hover:text-charcoal'
            }`}
          >
            <Radio size={14} />
            <span>Connected Device & Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'console'
                ? 'bg-white shadow-2xs text-sage-deep font-extrabold border border-warm-gray-lighter/80'
                : 'text-warm-gray hover:text-charcoal'
            }`}
          >
            <Terminal size={14} />
            <span>Live BLE Packet Console ({bleLogs.length})</span>
          </button>
        </div>

        {activeTab === 'devices' ? (
          <div className="space-y-5">
            {/* Active Device Status Card */}
            <div className={`p-5 rounded-2xl border transition-all shadow-2xs ${
              isConnected
                ? 'bg-sage-muted/40 border-sage/30'
                : 'bg-ivory border-warm-gray-lighter'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-charcoal">
                      {device.name}
                    </span>
                    {isConnected && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-sage-deep bg-sage-muted px-2.5 py-0.5 rounded-full border border-sage/20">
                        <span className="w-2 h-2 rounded-full bg-sage-deep pulse-gentle" />
                        Online
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-warm-gray mt-1 font-mono font-semibold">
                    MAC: {device.macAddress} · Firmware: {device.firmware}
                  </p>
                </div>

                <div>
                  {isConnected ? (
                    <button
                      onClick={disconnectESP32}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200 shadow-2xs"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => connectDummyESP32()}
                      className="px-4 py-2 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      Connect Demo
                    </button>
                  )}
                </div>
              </div>

              {isConnected && (
                <div className="mt-4 pt-3.5 border-t border-sage/20 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-warm-gray font-bold text-[10.5px] uppercase tracking-wider block">Battery Level</span>
                    <span className="font-extrabold text-charcoal flex items-center gap-1.5 mt-0.5">
                      <Battery size={15} className="text-sage-deep" /> {device.battery}%
                    </span>
                  </div>
                  <div>
                    <span className="text-warm-gray font-bold text-[10.5px] uppercase tracking-wider block">Signal RSSI</span>
                    <span className="font-extrabold text-charcoal flex items-center gap-1.5 mt-0.5 font-mono">
                      <Wifi size={15} className="text-sage-deep" /> {device.rssi} dBm
                    </span>
                  </div>
                  <div>
                    <span className="text-warm-gray font-bold text-[10.5px] uppercase tracking-wider block">Channels</span>
                    <span className="font-extrabold text-charcoal mt-0.5 block">
                      {device.sensorChannels} Active Strain
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Real Hardware BLE Pairing Callout */}
            <div className="p-4 rounded-2xl bg-ivory-warm border border-warm-gray-lighter flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div>
                <span className="font-extrabold text-charcoal flex items-center gap-1.5 text-sm">
                  <Sparkles size={16} className="text-sage-deep" />
                  Pair Real Physical ESP32 Hardware
                </span>
                <p className="text-warm-gray text-xs mt-0.5 font-medium">
                  Search nearby physical BLE peripherals using browser Web Bluetooth API
                </p>
              </div>

              <button
                onClick={handleScanReal}
                disabled={isScanning}
                className="px-4 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} />
                <span>{isScanning ? 'Scanning BLE...' : 'Search Real ESP32'}</span>
              </button>
            </div>

            {/* Available Simulated / Nearby Devices */}
            <div>
              <p className="text-xs font-bold text-warm-gray uppercase tracking-wider mb-2.5">
                Simulated ESP32 Devices (For Evaluation & Demo)
              </p>

              <div className="space-y-2">
                {availableDevices.map((item) => {
                  const isCurrent = device.id === item.id && isConnected;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-warm-gray-lighter flex items-center justify-between text-xs hover:border-sage/40 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                          isCurrent
                            ? 'bg-sage-muted text-sage-deep border-sage/25'
                            : 'bg-ivory text-warm-gray border-warm-gray-lighter'
                        }`}>
                          <Radio size={15} />
                        </div>
                        <div>
                          <p className="font-extrabold text-charcoal leading-tight">
                            {item.name}
                          </p>
                          <p className="text-xs text-warm-gray font-mono font-semibold mt-0.5">
                            {item.sensorChannels} Strain Channels · RSSI {item.rssi} dBm
                          </p>
                        </div>
                      </div>

                      <div>
                        {isCurrent ? (
                          <span className="text-xs font-bold text-sage-deep bg-sage-muted border border-sage/25 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                            <Check size={13} strokeWidth={3} className="text-sage-deep" /> Connected
                          </span>
                        ) : (
                          <button
                            onClick={() => connectDummyESP32(item.name)}
                            className="px-3.5 py-1.5 rounded-xl bg-ivory hover:bg-ivory-warm text-charcoal font-bold border border-warm-gray-lighter transition-colors"
                          >
                            Switch to this
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Live BLE Packet Console */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal">Incoming GATT Characteristics</span>
              <span className="text-xs text-sage-deep font-mono font-bold">Channel 0x180D Listening</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E2722] border border-sage/25 font-mono text-xs text-emerald-400 h-64 overflow-y-auto space-y-1.5 shadow-inner">
              {bleLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-sage-light font-bold">{log.slice(0, 10)}</span>
                  <span className="ml-1 text-emerald-300 font-medium">{log.slice(10)}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-warm-gray font-medium flex items-center gap-1.5">
              <AlertCircle size={14} className="text-warm-gray" />
              <span>Simulates live ADC strain gauge data received from ESP32 BLE GATT notifications.</span>
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-warm-gray-lighter flex items-center justify-between text-xs text-warm-gray font-semibold">
          <span>ESP32-C3 RISC-V Firmware active</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white font-bold text-xs transition-all shadow-xs active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
