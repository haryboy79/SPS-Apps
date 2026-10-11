import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Users,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  BookOpen,
  ArrowRight,
  Info,
  Check,
  Send,
  MessageCircle,
  Table,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  DayOfWeek,
  TeacherTimetable,
  AbsentTeacherInput,
  ReliefAssignment,
  AbsenceReason,
  ReliefDayRecord,
} from '../types';
import { TIME_SLOTS } from '../data/timeSlots';
import { DailyAvailabilityMatrix } from './DailyAvailabilityMatrix';
import {
  getMalayDay,
  getCandidateTeachers,
  autoAssignAllPeriods,
  generateWhatsAppMessage,
  countTeacherDailyPeriods,
  isTeacherPentadbir,
} from '../utils/reliefEngine';

interface ReliefGeneratorViewProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
  currentDay: DayOfWeek;
  setCurrentDay: (day: DayOfWeek) => void;
  absentTeachers: AbsentTeacherInput[];
  setAbsentTeachers: React.Dispatch<React.SetStateAction<AbsentTeacherInput[]>>;
  assignments: ReliefAssignment[];
  setAssignments: React.Dispatch<React.SetStateAction<ReliefAssignment[]>>;
  teachers: TeacherTimetable[];
  historyRecords: ReliefDayRecord[];
  onSaveDayRecord: () => void;
  onNavigate: (tab: 'dashboard' | 'print' | 'notifications' | 'history') => void;
}

const ABSENCE_REASONS: AbsenceReason[] = [
  'Cuti Sakit (MC)',
  'Cuti Rehat Khas (CRK)',
  'Berkursus / Bengkel',
  'Urusan Rasmi / Mesyuarat PPD/JPN',
  'Kuarantin',
  'Cuti Bersalin',
  'Cuti Kecemasan',
  'Cuti Tanpa Gaji',
  'Lain-lain',
];

export const ReliefGeneratorView: React.FC<ReliefGeneratorViewProps> = ({
  currentDate,
  setCurrentDate,
  currentDay,
  setCurrentDay,
  absentTeachers,
  setAbsentTeachers,
  assignments,
  setAssignments,
  teachers,
  historyRecords,
  onSaveDayRecord,
  onNavigate,
}) => {
  // Local state for selecting teacher to add
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<AbsenceReason>('Cuti Sakit (MC)');
  const [absenceNotes, setAbsenceNotes] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'matrix' | 'cards'>('both');
  
  // Slot-specific candidate table modal
  const [activeSlotModal, setActiveSlotModal] = useState<ReliefAssignment | null>(null);

  // Auto-generate slots if absent teachers exist but assignments list is empty on mount
  useEffect(() => {
    if (assignments.length === 0 && absentTeachers.length > 0) {
      regenerateSlotsForAbsentTeachers(absentTeachers, currentDay, currentDate);
    }
  }, []);

  // Sync day with date selection
  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
    const day = getMalayDay(newDate);
    setCurrentDay(day);

    // Recompute assignments for this day
    regenerateSlotsForAbsentTeachers(absentTeachers, day, newDate);
  };

  // Recompute needed class slots for the absent teachers
  const regenerateSlotsForAbsentTeachers = (
    currentAbsent: AbsentTeacherInput[],
    day: DayOfWeek,
    date: string
  ) => {
    const newAssignments: ReliefAssignment[] = [];

    currentAbsent.forEach((absent) => {
      const teacherObj = teachers.find((t) => t.id === absent.teacherId);
      if (!teacherObj) return;

      const daySchedule = teacherObj.schedule[day];
      if (!daySchedule) return;

      Object.entries(daySchedule).forEach(([periodStr, classData]) => {
        const period = parseInt(periodStr, 10);
        // Exclude null and HIM (Perhimpunan Rasmi Isnin tidak memerlukan guru ganti kelas individu)
        if (classData && classData.subject !== 'HIM') {
          const slotInfo = TIME_SLOTS.find((s) => s.period === period);
          const timeSlot = slotInfo ? `${slotInfo.startTime} - ${slotInfo.endTime}` : '';

          // Check if we already have this slot assigned
          const existing = assignments.find(
            (a) => a.absentTeacherId === absent.teacherId && a.period === period
          );

          newAssignments.push(
            existing || {
              id: `asg-${absent.teacherId}-${period}-${Date.now()}`,
              date,
              day,
              period,
              timeSlot,
              absentTeacherId: absent.teacherId,
              absentTeacherName: absent.teacherName,
              subject: classData.subject,
              className: classData.className,
              reliefTeacherId: '',
              reliefTeacherName: '',
              isAutoAssigned: false,
              reasonForAbsence: absent.reason,
              status: 'Menunggu',
              notesMMI: `Latihan / Modul MMI ${classData.subject} ${classData.className}`,
            }
          );
        }
      });
    });

    // Sort by period ascending
    newAssignments.sort((a, b) => a.period - b.period);
    setAssignments(newAssignments);
  };

  // Add absent teacher
  const handleAddAbsentTeacher = () => {
    if (!selectedTeacherId) return;

    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    // Check if already added
    if (absentTeachers.some((a) => a.teacherId === selectedTeacherId)) {
      alert('Guru ini sudah didaftar tidak hadir.');
      return;
    }

    const newAbsent: AbsentTeacherInput = {
      teacherId: teacher.id,
      teacherName: teacher.name,
      reason: selectedReason,
      notes: absenceNotes,
    };

    const updatedList = [...absentTeachers, newAbsent];
    setAbsentTeachers(updatedList);
    setSelectedTeacherId('');
    setAbsenceNotes('');

    // Update slots
    regenerateSlotsForAbsentTeachers(updatedList, currentDay, currentDate);
  };

  // Remove absent teacher
  const handleRemoveAbsentTeacher = (teacherId: string) => {
    const updated = absentTeachers.filter((t) => t.teacherId !== teacherId);
    setAbsentTeachers(updated);
    regenerateSlotsForAbsentTeachers(updated, currentDay, currentDate);
  };

  // Trigger Smart Auto-Assign for all slots
  const handleAutoAssignAll = () => {
    if (assignments.length === 0) {
      alert('Sila tambah guru yang tidak hadir terlebih dahulu.');
      return;
    }

    const assigned = autoAssignAllPeriods(
      currentDay,
      currentDate,
      absentTeachers,
      teachers,
      assignments,
      historyRecords
    );

    setAssignments(assigned);

    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSuccessToast('Semua slot telah dijana secara automatik dengan keutamaan period paling sedikit & elak pentadbir!');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Manual Assign selection for a specific assignment
  const handleManualAssign = (assignmentId: string, reliefTeacherId: string) => {
    const teacher = teachers.find((t) => t.id === reliefTeacherId);
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            reliefTeacherId: reliefTeacherId || '',
            reliefTeacherName: teacher ? teacher.name : '',
            isAutoAssigned: false,
            status: 'Menunggu',
          };
        }
        return a;
      })
    );
  };

  // Update MMI notes for a specific assignment
  const handleUpdateNotesMMI = (assignmentId: string, notes: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, notesMMI: notes } : a))
    );
  };

  // Save full schedule and show feedback
  const handleSaveAndProceed = () => {
    onSaveDayRecord();
    setSuccessToast('Jadual guru ganti berjaya disimpan ke rekod sejarah!');
    setTimeout(() => {
      setSuccessToast(null);
      onNavigate('print');
    }, 1200);
  };

  const absentTeacherIds = useMemo(
    () => absentTeachers.map((t) => t.teacherId),
    [absentTeachers]
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-bounce">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Penjana Jadual Guru Ganti (MMI)</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
              SK St Patrick, Mukah
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Langkah 1: Tetapkan guru tidak hadir • Langkah 2: Semak waktu & kekosongan • Langkah 3: Jana cadangan mengikut bilangan period
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Tarikh:</span>
          </div>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200">
            {currentDay}
          </div>
        </div>
      </div>

      {/* LANGKAH 1: PILIHAN NAMA GURU YANG TIDAK HADIR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
              1
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Pilihan Nama Guru Yang Tidak Hadir
              </h3>
              <p className="text-xs text-slate-500">
                Pilih guru yang bercuti, berkursus atau mempunyai urusan rasmi pada hari ini
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {absentTeachers.length} Guru Didaftar
          </span>
        </div>

        {/* Input Form to add absent teacher */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Guru:</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Pilih Guru (26 Guru SK St Patrick) --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.majorSubjects.join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-bold text-slate-700">Sebab Ketidakhadiran:</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value as AbsenceReason)}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {ABSENCE_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-bold text-slate-700">Catatan / No. Rujukan:</label>
            <input
              type="text"
              placeholder="Cth: Klinik Mukah / Mesyuarat PPD"
              value={absenceNotes}
              onChange={(e) => setAbsenceNotes(e.target.value)}
              className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              onClick={handleAddAbsentTeacher}
              disabled={!selectedTeacherId}
              className="w-full h-[38px] flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs transition-colors shadow-sm"
              title="Tambah Guru Tidak Hadir"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of currently absent teachers */}
        {absentTeachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {absentTeachers.map((absent) => {
              const teacherObj = teachers.find((t) => t.id === absent.teacherId);
              const teachingPeriods = teacherObj
                ? countTeacherDailyPeriods(teacherObj, currentDay)
                : 0;

              return (
                <div
                  key={absent.teacherId}
                  className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-start justify-between gap-3 relative overflow-hidden"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">
                      {absent.teacherName}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-rose-200/70 text-rose-800 font-semibold">
                        {absent.reason}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                        {teachingPeriods} Period Terlibat
                      </span>
                    </div>
                    {absent.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        &quot;{absent.notes}&quot;
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveAbsentTeacher(absent.teacherId)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-100 transition-colors"
                    title="Padam dari senarai tidak hadir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LANGKAH 2 & 3: SEMAK KEKOSONGAN JADUAL GURU LAIN & JANA TUGASAN GANTI */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
              2
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Semak Kekosongan & Tugasan Guru Ganti (Mengikut Period)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {assignments.length} Sesi Terlibat
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Disusun mengikut period paling sedikit & elak pentadbir (Rikey, Ho Seng Hin, Patricia, Haryadi). Warna kuning (Free) dan merah (Tidak Free).
              </p>
            </div>
          </div>

          {/* Large Auto-Assign Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoAssignAll}
              disabled={assignments.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
              <span>⚡ JANA AUTOMATIK SEMUA (Formula Pintar Period)</span>
            </button>
          </div>
        </div>

        {/* View mode switcher & instructions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Pilihan Paparan:</span>
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs text-xs font-bold">
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📊 Jadual Kekosongan Harian (Kuning/Merah)</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📋 Kad Tugasan MMI ({assignments.length})</span>
              </button>
              <button
                onClick={() => setViewMode('both')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'both'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📑 Papar Kedua-duanya</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500" />
            <span>Klik kotak kuning pada jadual kekosongan untuk memilih guru ganti secara langsung</span>
          </div>
        </div>

        {/* 1. Daily Availability Matrix (Yellow = Free, Red = Busy) */}
        {(viewMode === 'both' || viewMode === 'matrix') && (
          <div className="space-y-2">
            <DailyAvailabilityMatrix
              day={currentDay}
              teachers={teachers}
              absentTeachers={absentTeachers}
              assignments={assignments}
              onAssignTeacher={handleManualAssign}
            />
          </div>
        )}

        {/* 2. Empty state or Assignment Cards */}
        {assignments.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Users className="w-9 h-9 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">
              Sila Pilih Guru Tidak Hadir di Langkah 1
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Setelah guru tidak hadir dipilih, waktu kelas yang perlu diganti akan ditandakan pada jadual kekosongan di atas untuk dilantik guru ganti secara pantas.
            </p>
          </div>
        ) : (
          (viewMode === 'both' || viewMode === 'cards') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>Senarai Perincian Waktu Ganti & Pilihan Guru Ganti</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {assignments.filter((a) => Boolean(a.reliefTeacherId)).length} / {assignments.length} Selesai Dilantik
                  </span>
                </h4>
              </div>

              {assignments.map((asg) => {
                // Get candidate teachers for this exact period
                const candidates = getCandidateTeachers(
                  currentDay,
                  asg.period,
                  asg.subject,
                  teachers,
                  absentTeacherIds,
                  assignments,
                  historyRecords
                );

                const freeRegularCandidates = candidates.filter((c) => c.isFree && !c.isPentadbir);
                const freePentadbirCandidates = candidates.filter((c) => c.isFree && c.isPentadbir);
                const busyCandidates = candidates.filter((c) => !c.isFree);

                return (
                  <div
                    key={asg.id}
                    className={`rounded-xl border p-4.5 transition-all ${
                      asg.reliefTeacherId
                        ? 'bg-blue-50/30 border-blue-200'
                        : 'bg-amber-50/40 border-amber-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Slot Info */}
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Waktu</span>
                          <span className="text-base font-black text-amber-300 leading-none">
                            {asg.period}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                              {asg.className}
                            </span>
                            <span className="font-extrabold text-sm text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                              {asg.subject}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5" /> {asg.timeSlot}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                            <span>
                              Guru Asal: <strong className="text-slate-800">{asg.absentTeacherName}</strong>
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-rose-600 font-semibold">{asg.reasonForAbsence}</span>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Selection Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 lg:w-3/5">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                              <span>Guru Pengganti:</span>
                              {asg.isAutoAssigned && (
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                                  Cadangan Sistem
                                </span>
                              )}
                            </label>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {freeRegularCandidates.length + freePentadbirCandidates.length} guru lapang
                            </span>
                          </div>

                          <select
                            value={asg.reliefTeacherId}
                            onChange={(e) => handleManualAssign(asg.id, e.target.value)}
                            className={`w-full text-xs font-bold rounded-lg p-2.5 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                              asg.reliefTeacherId
                                ? 'bg-white border-blue-300 text-slate-900'
                                : 'bg-amber-100/60 border-amber-400 text-amber-900'
                            }`}
                          >
                            <option value="">-- PILIH GURU GANTI --</option>
                            <optgroup label="🌟 GURU LAPANG (KEUTAMAAN: PERIOD PALING SEDIKIT & MASA TAK BERTURUT-TURUT)">
                              {freeRegularCandidates.map((c, rank) => (
                                <option key={c.teacher.id} value={c.teacher.id}>
                                  #{rank + 1} {c.teacher.name} — [{c.dailyPeriodCount} Period Hari Ini] • {c.reasonTag}
                                </option>
                              ))}
                            </optgroup>
                            {freePentadbirCandidates.length > 0 && (
                              <optgroup label="⚠️ GOLONGAN PENTADBIR (DIELAKKAN KECUALI TIADA GURU LAIN)">
                                {freePentadbirCandidates.map((c) => (
                                  <option key={c.teacher.id} value={c.teacher.id}>
                                    🏛️ {c.teacher.name} — [{c.dailyPeriodCount} Period] (Pentadbir)
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            <optgroup label="❌ GURU TIDAK FREE (ADA KELAS / CUTI / SEDANG GANTI)">
                              {busyCandidates.map((c) => (
                                <option key={c.teacher.id} value={c.teacher.id} disabled>
                                  {c.teacher.name} — ({c.reasonTag})
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        {/* Interactive "Jadual Kekosongan Waktu Ini" Button */}
                        <div className="flex items-center gap-1.5 pt-3 sm:pt-4">
                          <button
                            type="button"
                            onClick={() => setActiveSlotModal(asg)}
                            className="inline-flex items-center gap-1 px-3 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
                            title="Buka Jadual Kekosongan Waktu Ini Dalam Bentuk Warna Kuning & Merah"
                          >
                            <Table className="w-3.5 h-3.5" />
                            <span>Jadual Kekosongan Waktu {asg.period}</span>
                          </button>

                          {/* WhatsApp quick dispatch */}
                          {asg.reliefTeacherId && (
                            <a
                              href={`https://wa.me/?text=${generateWhatsAppMessage(asg)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                              title="Hantar Slip WhatsApp ke Guru Ini"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bahan / Arahan Tugasan MMI Row */}
                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-700 shrink-0">
                        Arahan / Bahan MMI Murid:
                      </span>
                      <input
                        type="text"
                        value={asg.notesMMI || ''}
                        onChange={(e) => handleUpdateNotesMMI(asg.id, e.target.value)}
                        placeholder="Cth: Buku Teks m/s 34 atau Lembaran kerja disediakan di meja guru"
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Action Footnotes & Save Button */}
        {assignments.length > 0 && (
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Semua guru pengganti yang dipilih boleh dimaklumkan secara serentak di menu Notifikasi atau disimpan dalam format PDF rasmi.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveAndProceed}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <span>Simpan & Teruskan Ke Simpan PDF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODAL: JADUAL KEKOSONGAN KHAS UNTUK WAKTU BERKENAAN */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>Jadual Kekosongan Guru Hari Ini: Waktu {activeSlotModal.period} ({activeSlotModal.timeSlot})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelas: <strong>{activeSlotModal.className}</strong> • Subjek: <strong>{activeSlotModal.subject}</strong> • Guru Asal: <strong>{activeSlotModal.absentTeacherName}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Petunjuk Warna Kuning & Merah */}
            <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-200 text-yellow-950 font-black border border-yellow-400">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span>KUNING: Lapang (Boleh Dipilih)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-100 text-red-950 font-bold border border-red-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>MERAH: Tidak Free (Ada Kelas / Cuti)</span>
              </div>
              <div className="text-[11px] text-slate-500 ml-auto">
                * Keutamaan: Period paling sedikit & elak pentadbir
              </div>
            </div>

            {/* Senarai Jadual Kekosongan Dalam Bentuk Table */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-900 text-white sticky top-0 z-10 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">GURU</th>
                    <th className="py-2.5 px-2 text-center">STATUS HARI INI</th>
                    <th className="py-2.5 px-2 text-center">PERIOD HARI INI</th>
                    <th className="py-2.5 px-2 text-center">MASA BERTURUT-TURUT</th>
                    <th className="py-2.5 px-3 text-right">TINDAKAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {getCandidateTeachers(
                    currentDay,
                    activeSlotModal.period,
                    activeSlotModal.subject,
                    teachers,
                    absentTeacherIds,
                    assignments,
                    historyRecords
                  ).map((c, rank) => {
                    const isSelected = activeSlotModal.reliefTeacherId === c.teacher.id;

                    return (
                      <tr
                        key={c.teacher.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-blue-100/70 font-bold'
                            : c.isFree
                            ? c.isPentadbir
                              ? 'bg-amber-50/60'
                              : 'bg-yellow-50/80 hover:bg-yellow-100/80'
                            : 'bg-red-50/50 text-slate-400'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold w-4">
                              #{rank + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">
                                  {c.teacher.name}
                                </span>
                                {c.isPentadbir && (
                                  <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[9px] font-black rounded">
                                    Pentadbir
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500">
                                Opsyen: {c.teacher.majorSubjects.join(', ')}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Column (Kuning vs Merah) */}
                        <td className="py-2.5 px-2 text-center">
                          {c.isFree ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-300 border border-yellow-500 text-yellow-950 font-black text-[10px]">
                              <span>KUNING (FREE)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-900 font-bold text-[10px]">
                              <span>MERAH ({c.reasonTag})</span>
                            </span>
                          )}
                        </td>

                        {/* Period count */}
                        <td className="py-2.5 px-2 text-center font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              c.dailyPeriodCount <= 2
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.dailyPeriodCount <= 4
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.dailyPeriodCount} Period
                          </span>
                        </td>

                        {/* Consecutive Period Check */}
                        <td className="py-2.5 px-2 text-center">
                          {c.isFree ? (
                            !c.hasConsecutivePeriod ? (
                              <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                ⭐ Tidak Berturut-turut
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                ⚠️ Waktu Berturut-turut
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </td>

                        {/* Action Button */}
                        <td className="py-2.5 px-3 text-right">
                          {isSelected ? (
                            <button
                              onClick={() => {
                                handleManualAssign(activeSlotModal.id, '');
                                setActiveSlotModal(null);
                              }}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-rose-600 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Batal Ganti
                            </button>
                          ) : c.isFree ? (
                            <button
                              onClick={() => {
                                handleManualAssign(activeSlotModal.id, c.teacher.id);
                                setActiveSlotModal(null);
                              }}
                              className="px-3 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black text-xs border border-yellow-500 shadow-2xs transition-all active:scale-95 cursor-pointer"
                            >
                              + Lantik Guru Ini
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Tidak Tersedia</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveSlotModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
