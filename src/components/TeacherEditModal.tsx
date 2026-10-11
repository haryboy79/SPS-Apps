import React, { useState } from 'react';
import { X, Save, User, BookOpen, Plus, Trash2 } from 'lucide-react';
import { TeacherTimetable } from '../types';

interface TeacherEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherTimetable | null;
  onSaveTeacher: (updated: TeacherTimetable) => void;
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

export const TeacherEditModal: React.FC<TeacherEditModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onSaveTeacher,
}) => {
  if (!isOpen || !teacher) return null;

  const [name, setName] = useState(teacher.name);
  const [subjects, setSubjects] = useState<string[]>(teacher.majorSubjects || []);
  const [newSubjectInput, setNewSubjectInput] = useState('');

  const handleAddSubject = (sub: string) => {
    const trimmed = sub.trim().toUpperCase();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setNewSubjectInput('');
    }
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Sila masukkan nama guru.');
      return;
    }

    onSaveTeacher({
      ...teacher,
      name: name.trim().toUpperCase(),
      majorSubjects: subjects,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white">Kemaskini Profil Guru</h3>
              <p className="text-xs text-slate-400">Ubah nama guru dan opsyen subjek mengajar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Teacher Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Nama Penuh Guru:</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cth: CIKGU RIKEY ANAK LAAP"
              className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subjects (Opsyen Matapelajaran) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Opsyen Mata Pelajaran Utama:</span>
              </span>
              <span className="text-[11px] text-slate-500">{subjects.length} subjek dipilih</span>
            </label>

            {/* Current Active Subjects Tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {subjects.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Tiada subjek dipilih</span>
              ) : (
                subjects.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub)}
                      className="text-blue-600 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Quick-add Subject pills */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Pilih Dari Subjek Sekolah:
              </span>
              <div className="flex flex-wrap gap-1">
                {COMMON_SUBJECTS.map((sub) => {
                  const isSelected = subjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveSubject(sub) : handleAddSubject(sub))}
                      className={`text-xs px-2 py-0.5 rounded-md font-semibold border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Subject Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Tambah subjek lain..."
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubject(newSubjectInput);
                  }
                }}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
              />
              <button
                type="button"
                onClick={() => handleAddSubject(newSubjectInput)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
