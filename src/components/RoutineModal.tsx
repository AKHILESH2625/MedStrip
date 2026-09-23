import { useState } from 'react';
import { Calendar, Plus, Trash2, X, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { DoseSchedule } from '../store/AppContext';

export default function RoutineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { schedule, addScheduleDose, updateScheduleDose, deleteScheduleDose } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [newMed, setNewMed] = useState('');
  const [newDose, setNewDose] = useState('500 mg');
  const [newTime, setNewTime] = useState('08:00');
  const [newPeriod, setNewPeriod] = useState<DoseSchedule['period']>('Morning');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMed, setEditMed] = useState('');
  const [editDose, setEditDose] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPeriod, setEditPeriod] = useState<DoseSchedule['period']>('Morning');

  if (!isOpen) return null;

  const handleStartEdit = (item: DoseSchedule) => {
    setEditingId(item.id);
    setEditMed(item.medication);
    setEditDose(item.dose);
    setEditTime(item.time);
    setEditPeriod(item.period);
  };

  const handleSaveEdit = (id: string) => {
    // Format display time label
    const [h, m] = editTime.split(':');
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    const timeLabel = `${displayHour}:${m} ${ampm}`;

    updateScheduleDose(id, {
      medication: editMed,
      dose: editDose,
      time: editTime,
      timeLabel,
      period: editPeriod,
    });
    setEditingId(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.trim()) return;

    const [h, m] = newTime.split(':');
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    const timeLabel = `${displayHour}:${m} ${ampm}`;

    addScheduleDose({
      time: newTime,
      timeLabel,
      period: newPeriod,
      medication: newMed,
      dose: newDose,
      status: 'upcoming',
    });

    setIsAdding(false);
    setNewMed('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-xs screen-enter">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-warm-gray-lighter text-charcoal space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-gray-lighter">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-muted text-sage-deep flex items-center justify-center border border-sage/20 shadow-2xs">
              <Calendar size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-charcoal">
                Medication Routine Editor
              </h3>
              <p className="text-xs text-warm-gray font-semibold">
                Add, edit, or adjust daily dose schedules and reminders
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

        {/* Existing Routine List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-warm-gray uppercase tracking-wider">
              Current Scheduled Doses ({schedule.length})
            </span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs font-bold text-sage-deep hover:text-sage-dark flex items-center gap-1"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>{isAdding ? 'Cancel' : '+ Add New Dose'}</span>
            </button>
          </div>

          {/* Form to add new dose */}
          {isAdding && (
            <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-ivory border border-warm-gray-lighter space-y-3 text-xs shadow-2xs">
              <span className="font-extrabold text-charcoal text-sm block">Add Scheduled Medication Dose</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal font-bold mb-1">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={newMed}
                    onChange={e => setNewMed(e.target.value)}
                    placeholder="e.g. Lisinopril"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-semibold focus:outline-none focus:border-sage-deep shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-charcoal font-bold mb-1">Dose Amount</label>
                  <input
                    type="text"
                    required
                    value={newDose}
                    onChange={e => setNewDose(e.target.value)}
                    placeholder="e.g. 10 mg"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-semibold focus:outline-none focus:border-sage-deep shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-charcoal font-bold mb-1">Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold focus:outline-none focus:border-sage-deep shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-charcoal font-bold mb-1">Day Period</label>
                  <select
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value as DoseSchedule['period'])}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold focus:outline-none focus:border-sage-deep shadow-2xs"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-warm-gray hover:bg-warm-gray-lighter/40 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sage-deep hover:bg-sage text-white font-bold transition-all shadow-xs active:scale-95"
                >
                  Save to Routine
                </button>
              </div>
            </form>
          )}

          {/* Doses List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {schedule.map((item) => {
              const isEditing = editingId === item.id;

              if (isEditing) {
                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-sage-muted/40 border border-sage/30 space-y-3 text-xs shadow-2xs">
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={editMed}
                        onChange={e => setEditMed(e.target.value)}
                        className="px-3 py-2 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold"
                      />
                      <input
                        type="text"
                        value={editDose}
                        onChange={e => setEditDose(e.target.value)}
                        className="px-3 py-2 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold"
                      />
                      <input
                        type="time"
                        value={editTime}
                        onChange={e => setEditTime(e.target.value)}
                        className="px-3 py-2 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold"
                      />
                      <select
                        value={editPeriod}
                        onChange={e => setEditPeriod(e.target.value as DoseSchedule['period'])}
                        className="px-3 py-2 bg-white rounded-xl border border-warm-gray-lighter text-charcoal font-bold"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3.5 py-1.5 rounded-xl text-warm-gray hover:bg-warm-gray-lighter/40 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-4 py-1.5 rounded-xl bg-sage-deep hover:bg-sage text-white font-bold transition-all shadow-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-warm-gray-lighter flex items-center justify-between text-xs shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-ivory flex items-center justify-center text-charcoal border border-warm-gray-lighter">
                      <Clock size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-charcoal text-sm">{item.medication}</span>
                        <span className="text-warm-gray font-bold">· {item.dose}</span>
                      </div>
                      <p className="text-xs text-warm-gray font-semibold mt-0.5">
                        {item.timeLabel} ({item.period}) ·{' '}
                        <span className={item.status === 'taken' ? 'text-sage-deep font-extrabold' : 'text-warm-gray font-semibold'}>
                          {item.status === 'taken' ? 'Verified Taken' : 'Upcoming'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="px-3 py-1.5 rounded-xl bg-ivory hover:bg-ivory-warm text-charcoal font-bold border border-warm-gray-lighter transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteScheduleDose(item.id)}
                      className="p-2 rounded-xl text-warm-gray hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete dose"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-warm-gray-lighter flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-sage-deep hover:bg-sage text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
