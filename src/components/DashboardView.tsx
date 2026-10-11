import React from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Bell,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import {
  ReliefAssignment,
  AbsentTeacherInput,
  ReliefDayRecord,
  TeacherTimetable,
} from '../types';
import { formatMalayDate, generateWhatsAppMessage } from '../utils/reliefEngine';
import { StatisticalAnalysisModule } from './StatisticalAnalysisModule';

interface DashboardViewProps {
  currentDate: string;
  currentDay: string;
  absentTeachers: AbsentTeacherInput[];
  assignments: ReliefAssignment[];
  historyRecords: ReliefDayRecord[];
  teachers: TeacherTimetable[];
  onNavigate: (tab: 'generator' | 'print' | 'notifications' | 'history' | 'timetable') => void;
  onUpdateAssignmentStatus: (assignmentId: string, status: ReliefAssignment['status']) => void;
  onSelectAbsentTeacherForToday?: (teacherId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentDate,
  currentDay,
  absentTeachers,
  assignments,
  historyRecords,
  teachers,
  onNavigate,
  onUpdateAssignmentStatus,
}) => {
  const totalSlotsNeeded = assignments.length;
  const assignedSlots = assignments.filter((a) => a.reliefTeacherId).length;
  const unassignedSlots = totalSlotsNeeded - assignedSlots;
  const notifiedSlots = assignments.filter(
    (a) => a.status === 'Diberitahu' || a.status === 'Disahkan' || a.status === 'Selesai'
  ).length;
  const completedSlots = assignments.filter((a) => a.status === 'Selesai').length;

  // Calculate monthly stats
  const currentMonth = currentDate.slice(0, 7);
  const monthlyReliefCount: Record<string, { count: number; name: string }> = {};

  // Seed with all teachers
  teachers.forEach((t) => {
    monthlyReliefCount[t.id] = { count: 0, name: t.name };
  });

  // Calculate from history records
  historyRecords.forEach((record) => {
    if (record.date.startsWith(currentMonth)) {
      record.assignments.forEach((asg) => {
        if (asg.reliefTeacherId && monthlyReliefCount[asg.reliefTeacherId]) {
          monthlyReliefCount[asg.reliefTeacherId].count += 1;
        }
      });
    }
  });

  // Add today's active assignments
  assignments.forEach((asg) => {
    if (asg.reliefTeacherId && monthlyReliefCount[asg.reliefTeacherId]) {
      monthlyReliefCount[asg.reliefTeacherId].count += 1;
    }
  });

  const sortedLeaderboard = Object.entries(monthlyReliefCount)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 7);

  const highestCount = Math.max(...sortedLeaderboard.map(([, v]) => v.count), 1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none transform skew-x-12" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-amber-300 border border-white/20 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hari Ini: {currentDay}, {formatMalayDate(currentDate)}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Papan Pemuka Jadual Guru Ganti
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Pantau status penugasan waktu ganti, pastikan semua waktu kelas terisi dan pemberitahuan segera dihantar kepada guru bertugas bagi melindungi masa instruksional (MMI).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('generator')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Jana Jadual Hari Ini</span>
            </button>
            <button
              onClick={() => onNavigate('print')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm border border-white/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Simpan PDF / Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Guru Cuti Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Guru Tidak Hadir
            </span>
            <span className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {absentTeachers.length}
            </span>
            <span className="text-xs text-slate-500">orang guru</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            {absentTeachers.length > 0 ? (
              <span className="text-rose-600 font-medium">
                {absentTeachers.map((t) => t.teacherName.split(' ')[1] || t.teacherName).join(', ')}
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Semua guru hadir hari ini
              </span>
            )}
          </div>
        </div>

        {/* Waktu Perlu Ganti Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Waktu Perlu Ganti
            </span>
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {totalSlotsNeeded}
            </span>
            <span className="text-xs text-slate-500">waktu (period)</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            {unassignedSlots > 0 ? (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {unassignedSlots} waktu belum diisi
              </span>
            ) : totalSlotsNeeded > 0 ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Semua waktu telah diisi
              </span>
            ) : (
              <span className="text-slate-400">Tiada waktu ganti</span>
            )}
          </div>
        </div>

        {/* Status Notifikasi Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pemberitahuan Guru
            </span>
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {notifiedSlots}/{assignedSlots}
            </span>
            <span className="text-xs text-slate-500">telah dimaklumkan</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {assignedSlots - notifiedSlots > 0 ? (
              <button
                onClick={() => onNavigate('notifications')}
                className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
              >
                Hantar baki notifikasi <ArrowRight className="w-3 h-3" />
              </button>
            ) : assignedSlots > 0 ? (
              <span className="text-emerald-600 font-medium">
                Semua guru telah dimaklumkan
              </span>
            ) : (
              <span>Menunggu penugasan</span>
            )}
          </div>
        </div>

        {/* Pengesahan / Selesai Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tugasan Selesai (MMI)
            </span>
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {completedSlots}/{totalSlotsNeeded}
            </span>
            <span className="text-xs text-slate-500">
              {totalSlotsNeeded > 0
                ? `${Math.round((completedSlots / totalSlotsNeeded) * 100)}%`
                : '100%'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Pelaksanaan sesi kelas ganti
          </div>
        </div>
      </div>

      {/* MODUL ANALISIS STATISTIK MMI (RECHARTS BAR CHART) */}
      <StatisticalAnalysisModule
        todayAssignments={assignments}
        historyRecords={historyRecords}
        currentMonth={currentMonth}
      />

      {/* Main Content Grid: Today's Assignments + Workload Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Relief Assignments Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Jadual Guru Ganti Hari Ini</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {assignments.length} Sesi
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Senarai kelas yang perlu digantikan bagi memastikan kelas tidak terbiar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('generator')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Urus / Jana Semula
              </button>
            </div>
          </div>

          {assignments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">
                Tiada Guru Tidak Hadir Ditetapkan Hari Ini
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Semua guru dijadualkan hadir. Jika terdapat guru yang bercuti atau berkursus, klik butang di bawah untuk memasukkan nama guru dan menjana jadual ganti secara automatik.
              </p>
              <button
                onClick={() => onNavigate('generator')}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Pilih Guru Tidak Hadir & Jana Jadual
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Waktu & Masa</th>
                    <th className="py-3 px-3">Kelas & Subjek</th>
                    <th className="py-3 px-3">Guru Asal</th>
                    <th className="py-3 px-3">Guru Ganti</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments.map((asg) => (
                    <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          Waktu {asg.period}
                        </div>
                        <div className="text-[11px] text-slate-500">{asg.timeSlot}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
                          {asg.className}
                        </div>
                        <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                          {asg.subject}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">
                          {asg.absentTeacherName}
                        </div>
                        <span className="text-[10px] text-rose-600 font-medium">
                          {asg.reasonForAbsence}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {asg.reliefTeacherId ? (
                          <div>
                            <div className="font-bold text-slate-900">
                              {asg.reliefTeacherName}
                            </div>
                            {asg.isAutoAssigned && (
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                <Sparkles className="w-3 h-3" /> Cadangan Pintar
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-1 rounded bg-rose-100 text-rose-700 font-semibold text-[11px]">
                            Belum Ditugaskan
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={asg.status}
                          onChange={(e) =>
                            onUpdateAssignmentStatus(asg.id, e.target.value as ReliefAssignment['status'])
                          }
                          className={`text-xs font-semibold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${
                            asg.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : asg.status === 'Disahkan'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : asg.status === 'Diberitahu'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Diberitahu">Diberitahu</option>
                          <option value="Disahkan">Disahkan</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {asg.reliefTeacherId && (
                          <a
                            href={`https://wa.me/?text=${generateWhatsAppMessage(asg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onUpdateAssignmentStatus(asg.id, 'Diberitahu')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                            title="Hantar Slip WhatsApp Segera"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Workload Barometer & Quick Guidelines (1 Col) */}
        <div className="space-y-6">
          {/* Workload Monitor (Kekerapan Guru Ganti Bulan Ini) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Barometer Beban Ganti (Bulan Ini)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pantau kesamarataan penugasan (MMI SK St Patrick)
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentMonth}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {sortedLeaderboard.map(([id, data]) => {
                const percentage = Math.round((data.count / highestCount) * 100);
                return (
                  <div key={id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {data.name}
                      </span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded text-[11px]">
                        {data.count} waktu
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          data.count >= 5
                            ? 'bg-rose-500'
                            : data.count >= 3
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Sistem memberi keutamaan guru kurang ganti</span>
              <button
                onClick={() => onNavigate('history')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Laporan Penuh &rarr;
              </button>
            </div>
          </div>

          {/* Quick Info Box: Prosedur Rasmi MMI */}
          <div className="bg-slate-900 rounded-xl p-5 text-white shadow-sm border border-slate-800">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Pematuhan MMI KPM
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              &quot;Melindungi Masa Instruksional (MMI)&quot; menjamin hak setiap murid mendapat pengajaran dan pembelajaran (PdP) yang berkualiti walaupun guru matapelajaran bercuti.
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-400 list-disc list-inside">
              <li>Guru ganti menjalankan aktiviti terancang.</li>
              <li>Slip cetakan ditandatangani untuk rekod pentadbiran.</li>
              <li>Laporan bulanan dieksport untuk semakan PPD.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
