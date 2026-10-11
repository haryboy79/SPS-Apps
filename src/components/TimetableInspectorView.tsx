import React, { useState } from 'react';
import {
  Grid3X3,
  Search,
  UserCheck,
  UserX,
  Upload,
  Download,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
  Edit,
  UserPlus,
  BookOpen,
  Users,
} from 'lucide-react';
import { TeacherTimetable, DayOfWeek, ClassSchedule } from '../types';
import { TIME_SLOTS, BREAK_SLOT, SCHOOL_INFO } from '../data/timeSlots';
import { DEFAULT_TEACHERS } from '../data/defaultTeachers';
import { TeacherEditModal } from './TeacherEditModal';
import { SlotEditModal } from './SlotEditModal';

interface TimetableInspectorViewProps {
  teachers: TeacherTimetable[];
  setTeachers: React.Dispatch<React.SetStateAction<TeacherTimetable[]>>;
}

const DAYS: DayOfWeek[] = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];

export const TimetableInspectorView: React.FC<TimetableInspectorViewProps> = ({
  teachers,
  setTeachers,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'individual' | 'manageTeachers' | 'freeCheck' | 'manage'
  >('individual');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || 'T01');

  // Search in teacher list
  const [teacherSearch, setTeacherSearch] = useState<string>('');

  // Modals state
  const [editingTeacher, setEditingTeacher] = useState<TeacherTimetable | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Slot edit modal state
  const [editingSlot, setEditingSlot] = useState<{
    day: DayOfWeek;
    period: number;
    timeSlot: string;
    classData: ClassSchedule | null;
  } | null>(null);

  // For Free-period Checker tab
  const [checkDay, setCheckDay] = useState<DayOfWeek>('Isnin');
  const [checkPeriod, setCheckPeriod] = useState<number>(2);

  const selectedTeacher =
    teachers.find((t) => t.id === selectedTeacherId) || teachers[0] || DEFAULT_TEACHERS[0];

  // Save updated teacher name or subjects
  const handleSaveTeacherProfile = (updated: TeacherTimetable) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Add new teacher
  const handleAddNewTeacher = () => {
    const newId = `T${String(teachers.length + 1).padStart(2, '0')}`;
    const newTeacher: TeacherTimetable = {
      id: newId,
      name: `CIKGU BAHARU ${teachers.length + 1}`,
      initials: 'CB',
      majorSubjects: ['BM', 'BI'],
      schedule: {
        Isnin: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
        Selasa: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
        Rabu: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
        Khamis: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
        Jumaat: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
      },
    };

    setTeachers([...teachers, newTeacher]);
    setSelectedTeacherId(newId);
    setEditingTeacher(newTeacher);
    setIsEditModalOpen(true);
  };

  // Save slot edit
  const handleSaveSlot = (updatedSlot: ClassSchedule | null) => {
    if (!editingSlot || !selectedTeacher) return;

    const { day, period } = editingSlot;
    const updatedSchedule = {
      ...selectedTeacher.schedule,
      [day]: {
        ...selectedTeacher.schedule[day],
        [period]: updatedSlot,
      },
    };

    const updatedTeacher = {
      ...selectedTeacher,
      schedule: updatedSchedule,
    };

    handleSaveTeacherProfile(updatedTeacher);
  };

  // Helper to count scheduled teaching classes for a teacher on the checked day
  const getTeacherDailyClasses = (t: TeacherTimetable, day: DayOfWeek) => {
    const slots = t.schedule[day] || {};
    return Object.values(slots).filter(
      (s) => s !== null && s !== undefined && s.subject !== 'HIM'
    ).length;
  };

  // Compute free and busy teachers for the selected day & period, sorted by dailyClassCount ascending (fewest classes first)
  const freeTeachers = teachers
    .filter((t) => {
      const slot = t.schedule[checkDay]?.[checkPeriod];
      return slot === null || slot === undefined;
    })
    .sort((a, b) => getTeacherDailyClasses(a, checkDay) - getTeacherDailyClasses(b, checkDay));

  const busyTeachers = teachers.filter((t) => {
    const slot = t.schedule[checkDay]?.[checkPeriod];
    return slot !== null && slot !== undefined;
  });

  // Filtered teachers list
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.majorSubjects.some((s) => s.toLowerCase().includes(teacherSearch.toLowerCase()))
  );

  // Export current teachers dataset as JSON
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(teachers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Jadual_SK_St_Patrick_2026_Pindaan1.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON timetable file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTeachers(parsed);
            alert(`Jadual berjaya dimuat naik! ${parsed.length} guru dikemas kini.`);
          } else {
            alert('Format fail JSON tidak sah.');
          }
        } catch {
          alert('Gagal membaca fail JSON. Sila pastikan format fail betul.');
        }
      };
    }
  };

  // Reset to original default schedule
  const handleResetToDefault = () => {
    if (confirm('Kembalikan kepada jadual asal SK St Patrick Mukah 2026 Pindaan 1?')) {
      setTeachers(DEFAULT_TEACHERS);
      alert('Jadual telah dikembalikan kepada konfigurasi lalai.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Edit Teacher Modal */}
      <TeacherEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={editingTeacher}
        onSaveTeacher={handleSaveTeacherProfile}
      />

      {/* Edit Slot Modal */}
      {editingSlot && (
        <SlotEditModal
          isOpen={Boolean(editingSlot)}
          onClose={() => setEditingSlot(null)}
          day={editingSlot.day}
          period={editingSlot.period}
          timeSlot={editingSlot.timeSlot}
          teacherName={selectedTeacher.name}
          initialClass={editingSlot.classData}
          onSaveSlot={handleSaveSlot}
        />
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Pangkalan Data Jadual Waktu Sekolah</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Jadual Waktu Mengajar Guru ({teachers.length} Guru)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            SK St Patrick, Mukah (2026 Pindaan 1). Anda boleh mengedit nama guru, opsyen subjek, serta menyunting slot waktu mengajar.
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold flex-wrap gap-1">
          <button
            onClick={() => setActiveSubTab('individual')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'individual'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jadual Individu
          </button>
          <button
            onClick={() => setActiveSubTab('manageTeachers')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              activeSubTab === 'manageTeachers'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Nama & Subjek</span>
          </button>
          <button
            onClick={() => setActiveSubTab('freeCheck')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'freeCheck'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Penyemak Kekosongan
          </button>
          <button
            onClick={() => setActiveSubTab('manage')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'manage'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Muat Naik / Sandaran
          </button>
        </div>
      </div>

      {/* SUBTAB 1: INDIVIDUAL TEACHER TIMETABLE */}
      {activeSubTab === 'individual' && (
        <div className="space-y-6">
          {/* Teacher selector bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Pilih Guru:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-sm"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.majorSubjects.join(', ')})
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setEditingTeacher(selectedTeacher);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors"
                title="Edit Nama atau Opsyen Subjek Guru Ini"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Nama / Subjek</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Opsyen Subjek:{' '}
                <strong className="text-slate-900">{selectedTeacher.majorSubjects.join(', ')}</strong>
              </span>
            </div>
          </div>

          {/* Timetable Matrix Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 overflow-x-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-2">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {SCHOOL_INFO.name} • 2026 Pindaan 1
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedTeacher.name}
                </h3>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                💡 <strong>Tip:</strong> Klik pada mana-mana kotak waktu di bawah untuk mengedit atau menukar subjek & kelas.
              </div>
            </div>

            <table className="w-full text-xs border-collapse border border-slate-300 min-w-[760px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 p-2 w-20 text-center">HARI</th>
                  {TIME_SLOTS.map((slot) => (
                    <React.Fragment key={slot.period}>
                      <th className="border border-slate-300 p-1.5 text-center min-w-[55px]">
                        <div className="font-extrabold text-slate-900">{slot.period}</div>
                        <div className="text-[10px] text-slate-500 font-normal leading-tight">
                          {slot.startTime}
                          <br />
                          {slot.endTime}
                        </div>
                      </th>
                      {slot.period === 5 && (
                        <th className="border border-slate-300 p-1.5 text-center bg-amber-50 text-amber-900 min-w-[55px]">
                          <div className="font-extrabold text-[10px]">REHAT</div>
                          <div className="text-[9px] font-normal leading-tight">
                            {BREAK_SLOT.startTime}
                            <br />
                            {BREAK_SLOT.endTime}
                          </div>
                        </th>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => {
                  const daySlots = selectedTeacher.schedule[day] || {};
                  return (
                    <tr key={day} className="hover:bg-slate-50/60 transition-colors">
                      <td className="border border-slate-300 p-2.5 font-bold text-slate-900 bg-slate-50 text-center">
                        {day}
                      </td>

                      {TIME_SLOTS.map((slot) => {
                        const classData = daySlots[slot.period];
                        return (
                          <React.Fragment key={slot.period}>
                            <td
                              onClick={() => {
                                setEditingSlot({
                                  day,
                                  period: slot.period,
                                  timeSlot: `${slot.startTime} - ${slot.endTime}`,
                                  classData,
                                });
                              }}
                              className="border border-slate-300 p-1 text-center align-middle h-16 cursor-pointer hover:bg-blue-50/50 transition-colors"
                              title="Klik untuk kemaskini subjek / kelas waktu ini"
                            >
                              {classData ? (
                                <div
                                  className={`rounded p-1 text-center h-full flex flex-col justify-center items-center ${
                                    classData.subject === 'HIM'
                                      ? 'bg-slate-200 text-slate-800 font-black'
                                      : 'bg-blue-50 text-blue-900 border border-blue-200'
                                  }`}
                                >
                                  <span className="font-extrabold text-[11px] leading-tight">
                                    {classData.subject}
                                  </span>
                                  {classData.className && classData.className !== 'SEMUA' && (
                                    <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                                      {classData.className}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-300 text-[10px] hover:text-blue-500 font-bold">
                                  +
                                </span>
                              )}
                            </td>

                            {/* REHAT Column */}
                            {slot.period === 5 && (
                              <td className="border border-slate-300 p-1 text-center bg-amber-50/50 text-amber-800 font-bold text-[10px] align-middle">
                                REHAT
                              </td>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: EDIT NAMA & SUBJEK GURU (DEDICATED MANAGEMENT VIEW) */}
      {activeSubTab === 'manageTeachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Pengurusan Nama Guru & Subjek Opsyen</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik butang &quot;Edit&quot; untuk menukar nama guru atau menambah/membuang subjek kepakaran guru.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari guru atau subjek..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56 font-medium"
                />
              </div>

              <button
                onClick={handleAddNewTeacher}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Guru Baharu</span>
              </button>
            </div>
          </div>

          {/* Teachers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTeachers.map((t, index) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400">#{index + 1} ({t.id})</span>
                    <button
                      onClick={() => {
                        setEditingTeacher(t);
                        setIsEditModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors border border-blue-200"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{t.name}</h4>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-semibold block mr-1">Subjek:</span>
                  {t.majorSubjects.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: FREE-PERIOD CHECKER */}
      {activeSubTab === 'freeCheck' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Pilih Hari:</span>
              <select
                value={checkDay}
                onChange={(e) => setCheckDay(e.target.value as DayOfWeek)}
                className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Pilih Waktu (Period):</span>
              <select
                value={checkPeriod}
                onChange={(e) => setCheckPeriod(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                {TIME_SLOTS.map((s) => (
                  <option key={s.period} value={s.period}>
                    Waktu {s.period} ({s.startTime} - {s.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto text-xs font-semibold text-slate-500 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5" /> {freeTeachers.length} Guru Lapang
              </span>
              <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                <UserX className="w-3.5 h-3.5" /> {busyTeachers.length} Guru Ada Kelas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Teachers Column */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <UserCheck className="w-4 h-4" />
                  Guru Yang Lapang (Boleh Ganti Kelas)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {freeTeachers.length} Orang
                </span>
              </h3>

              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {freeTeachers.map((t, idx) => {
                  const dailyCount = getTeacherDailyClasses(t, checkDay);
                  return (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs hover:bg-emerald-100/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-emerald-800 text-[11px]">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-slate-900">{t.name}</span>
                          {dailyCount <= 2 && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded border border-amber-200">
                              Pilihan Utama ⭐
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Opsyen: {t.majorSubjects.join(', ')} •{' '}
                          <strong className="text-slate-700">{dailyCount} kelas mengajar</strong> pada hari {checkDay}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px] shrink-0">
                        {dailyCount} KELAS
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Busy Teachers Column */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <UserX className="w-4 h-4" />
                  Guru Yang Sedang Mengajar
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                  {busyTeachers.length} Orang
                </span>
              </h3>

              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {busyTeachers.map((t) => {
                  const currentClass = t.schedule[checkDay]?.[checkPeriod];
                  return (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 block">{t.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {currentClass ? `${currentClass.subject} (${currentClass.className})` : '-'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold text-[10px]">
                        ADA KELAS
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: MANAGE / BACKUP / RESTORE */}
      {activeSubTab === 'manage' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Pengurusan Pangkalan Data Jadual Waktu
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Muat turun salinan sandaran (backup) atau muat naik fail jadual waktu sekiranya pihak sekolah membuat pindaan pada masa hadapan.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Eksport Sandaran Jadual (JSON)
                </span>
                <span className="text-[11px] text-slate-500">
                  Simpan profil jadual waktu guru ke komputer anda.
                </span>
              </div>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Muat Turun Fail</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Muat Naik Jadual Pindaan Baharu
                </span>
                <span className="text-[11px] text-slate-500">
                  Pilih fail JSON jadual yang telah dikemas kini.
                </span>
              </div>
              <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-colors shrink-0">
                <Upload className="w-4 h-4" />
                <span>Pilih Fail JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-rose-900 block">
                  Kembalikan Kepada Jadual Asal 2026
                </span>
                <span className="text-[11px] text-rose-700">
                  Pulihkan kesemua jadual guru SK St Patrick kepada data awal Pindaan 1.
                </span>
              </div>
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Jadual</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
