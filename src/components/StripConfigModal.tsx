import { useState } from 'react';
import { Layers, X, Plus, Check, Settings2 } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function StripConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activeStrip, stripProfiles, updateActiveStrip, addStripProfile, switchStripProfile } = useApp();

  const [stripName, setStripName] = useState(activeStrip.name);
  const [stripSize, setStripSize] = useState<number>(activeStrip.size);
  const [dosage, setDosage] = useState(activeStrip.dosage);

  // New strip form toggle
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSize, setNewSize] = useState(6);
  const [newDosage, setNewDosage] = useState('500 mg');

  if (!isOpen) return null;

  const handleSaveActive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripName.trim()) return;
    updateActiveStrip(stripName, stripSize, dosage);
    onClose();
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addStripProfile(newName, newSize, newDosage);
    setIsAddingNew(false);
    setNewName('');
    onClose();
  };

  const commonSizes = [4, 6, 8, 10, 12];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-xs screen-enter">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-warm-gray-lighter text-charcoal space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-muted text-sage-deep flex items-center justify-center border border-sage/20 shadow-2xs">
              <Settings2 size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-charcoal">
                Custom Blister Strip Setup
              </h3>
              <p className="text-xs text-warm-gray font-semibold">
                Configure strip name, cavity count, and switch profiles
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

        {/* Existing Profiles Selector */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-warm-gray uppercase tracking-wider">
              Saved Strip Profiles
            </span>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="text-xs font-bold text-sage-deep hover:text-sage-dark flex items-center gap-1"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>{isAddingNew ? 'Cancel New' : '+ Create New Profile'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {stripProfiles.map((p) => {
              const isActive = p.id === activeStrip.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    switchStripProfile(p.id);
                    setStripName(p.name);
                    setStripSize(p.size);
                    setDosage(p.dosage);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-sage-muted/50 border-sage/40 ring-2 ring-sage/20 shadow-2xs'
                      : 'bg-ivory border-warm-gray-lighter hover:border-sage/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-charcoal truncate block">
                      {p.name.split(' ')[0]}
                    </span>
                    {isActive && <Check size={14} strokeWidth={3} className="text-sage-deep" />}
                  </div>
                  <p className="text-[11px] text-warm-gray font-semibold mt-1">
                    {p.size} Cavities · {p.dosage}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form: Add New Strip Profile OR Edit Active Strip */}
        {isAddingNew ? (
          <form onSubmit={handleCreateNew} className="p-5 rounded-2xl bg-ivory border border-warm-gray-lighter space-y-4 text-xs shadow-2xs">
            <h4 className="text-xs font-extrabold text-charcoal uppercase tracking-wider">
              Add New Medicine Strip Profile
            </h4>

            <div>
              <label className="block text-charcoal font-bold mb-1">Strip Name & Medication</label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Amoxicillin Trihydrate"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-semibold focus:outline-none focus:border-sage-deep shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal font-bold mb-1">Cavity Count / Size</label>
                <select
                  value={newSize}
                  onChange={e => setNewSize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-semibold focus:outline-none focus:border-sage-deep shadow-2xs"
                >
                  {commonSizes.map(s => (
                    <option key={s} value={s}>{s} Cavities</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-charcoal font-bold mb-1">Dosage</label>
                <input
                  type="text"
                  required
                  value={newDosage}
                  onChange={e => setNewDosage(e.target.value)}
                  placeholder="e.g. 250 mg"
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-semibold focus:outline-none focus:border-sage-deep shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white font-bold transition-all shadow-xs active:scale-95"
            >
              Create & Pair Strip Profile
            </button>
          </form>
        ) : (
          <form onSubmit={handleSaveActive} className="space-y-4 text-xs">
            <div>
              <label className="block text-charcoal font-bold mb-1">Active Strip Name</label>
              <input
                type="text"
                required
                value={stripName}
                onChange={e => setStripName(e.target.value)}
                placeholder="e.g. Metformin Hydrochloride"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold text-sm focus:outline-none focus:border-sage-deep shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-charcoal font-bold mb-1">Strip Size (Positions)</label>
                <div className="grid grid-cols-5 gap-1.5 mt-1">
                  {commonSizes.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setStripSize(sz)}
                      className={`py-2 rounded-xl text-xs font-black transition-all ${
                        stripSize === sz
                          ? 'bg-sage-deep text-white shadow-2xs'
                          : 'bg-ivory border border-warm-gray-lighter text-charcoal hover:bg-ivory-warm'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-warm-gray font-semibold mt-1.5 block">
                  Sensor array adjusts active channels
                </span>
              </div>

              <div>
                <label className="block text-charcoal font-bold mb-1">Dose Strength</label>
                <input
                  type="text"
                  required
                  value={dosage}
                  onChange={e => setDosage(e.target.value)}
                  placeholder="e.g. 500 mg"
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold text-sm focus:outline-none focus:border-sage-deep shadow-2xs mt-1"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-warm-gray-lighter flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-warm-gray hover:bg-warm-gray-lighter/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Layers size={15} />
                <span>Save Strip Configuration</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
