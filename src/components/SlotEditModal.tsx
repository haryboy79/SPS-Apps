import React, { useState } from 'react';
import { X, Save, Clock, BookOpen, GraduationCap, Trash2 } from 'lucide-react';
import { DayOfWeek, ClassSchedule } from '../types';

interface SlotEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek;
  period: number;
  timeSlot: string;
  teacherName: string;
  initialClass: ClassSchedule | null;
  onSaveSlot: (slot: ClassSchedule | null) => void;
}

const COMMON_SUBJECTS = [
  'BM',
  'BI',
  'MT',
  'SN',
  'PAI',
  'BA',
  'BC',
  'PM',
  'SEJ',
  'RBT',
  'PSV',
  'MZ',
  'PJ',
  'PK',
  'TAS',
];

const COMMON_CLASSES = [
  '1GEN',
  '1GLO',
  '2GEN',
  '2GLO',
  '3GEN',
  '3GLO',
  '4GEN',
  '4GLO',
  '5GEN',
  '5GLO',
  '6GEN',
  '6GLO',
];

export const SlotEditModal: React.FC<SlotEditModalProps> = ({
  isOpen,
  onClose,
  day,
  period,
  timeSlot,
  teacherName,
  initialClass,
  onSaveSlot,
}) => {
  if (!isOpen) return null;

  const [subject, setSubject] = useState(initialClass?.subject || '');
  const [className, setClassName] = useState(initialClass?.className || '');

  const handleSave = () => {
    if (!subject.trim()) {
      alert('Sila masukkan mata pelajaran atau padam waktu jika kosong.');
      return;
    }

    onSaveSlot({
      subject: subject.trim().toUpperCase(),
      className: className.trim().toUpperCase() || 'SEMUA',
    });
    onClose();
  };

  const handleClearSlot = () => {
    onSaveSlot(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Kemaskini Waktu Mengajar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {day} • Waktu {period} ({timeSlot})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            Guru: <strong className="text-slate-900">{teacherName}</strong>
          </div>

          {/* Subject Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Mata Pelajaran (Subjek):</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Cth: BM, BI, MT, SN..."
              className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-2.5 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              {COMMON_SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-colors ${
                    subject.toUpperCase() === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Class Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Kelas:</span>
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Cth: 4GEN, 2GLO, SEMUA..."
              className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-2.5 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Quick Class Pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              {COMMON_CLASSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setClassName(c)}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-colors ${
                    className.toUpperCase() === c
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClearSlot}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Waktu</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Waktu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
