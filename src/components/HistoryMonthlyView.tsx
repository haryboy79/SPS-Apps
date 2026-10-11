import React, { useState, useMemo } from 'react';
import {
  History,
  Download,
  Calendar,
  Users,
  Clock,
  Search,
  ExternalLink,
  Trash2,
  FileSpreadsheet,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { ReliefDayRecord, TeacherTimetable } from '../types';
import { formatMalayDate } from '../utils/reliefEngine';
import { SCHOOL_INFO } from '../data/timeSlots';

interface HistoryMonthlyViewProps {
  historyRecords: ReliefDayRecord[];
  teachers: TeacherTimetable[];
  onLoadRecord: (record: ReliefDayRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

export const HistoryMonthlyView: React.FC<HistoryMonthlyViewProps> = ({
  historyRecords,
  teachers,
  onLoadRecord,
  onDeleteRecord,
}) => {
  // Current month filter
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique available months from records
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    historyRecords.forEach((r) => {
      months.add(r.date.slice(0, 7));
    });
    months.add(currentMonthStr);
    return Array.from(months).sort().reverse();
  }, [historyRecords, currentMonthStr]);

  // Filter records by month & search
  const filteredRecords = useMemo(() => {
    return historyRecords.filter((record) => {
      const matchMonth = selectedMonth === 'ALL' || record.date.startsWith(selectedMonth);
      const matchSearch =
        searchQuery === '' ||
        record.date.includes(searchQuery) ||
        record.absentTeachers.some((t) =>
          t.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        record.assignments.some(
          (a) =>
            a.reliefTeacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchMonth && matchSearch;
    });
  }, [historyRecords, selectedMonth, searchQuery]);

  // Compute monthly statistics
  const monthlyStats = useMemo(() => {
    let totalAssignments = 0;
    let totalAbsentDays = 0;
    const teacherReliefCount: Record<string, { count: number; name: string }> = {};

    teachers.forEach((t) => {
      teacherReliefCount[t.id] = { count: 0, name: t.name };
    });

    filteredRecords.forEach((record) => {
      totalAbsentDays += record.absentTeachers.length;
      totalAssignments += record.assignments.length;

      record.assignments.forEach((asg) => {
        if (asg.reliefTeacherId && teacherReliefCount[asg.reliefTeacherId]) {
          teacherReliefCount[asg.reliefTeacherId].count += 1;
        }
      });
    });

    const sortedTeachers = Object.entries(teacherReliefCount)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);

    return {
      totalAssignments,
      totalAbsentDays,
      totalDays: filteredRecords.length,
      sortedTeachers,
    };
  }, [filteredRecords, teachers]);

  // Export to CSV format
  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      alert('Tiada data untuk dieksport.');
      return;
    }

    let csv = `LAPORAN BULANAN JADUAL GURU GANTI (MMI) - ${SCHOOL_INFO.name}\n`;
    csv += `Bulan: ${selectedMonth}\n\n`;
    csv += `Tarikh,Hari,Waktu,Masa,Kelas,Mata Pelajaran,Guru Tidak Hadir,Sebab,Guru Pengganti,Status,Bahan MMI\n`;

    filteredRecords.forEach((record) => {
      record.assignments.forEach((asg) => {
        csv += `"${asg.date}","${asg.day}","Waktu ${asg.period}","${asg.timeSlot}","${asg.className}","${asg.subject}","${asg.absentTeacherName}","${asg.reasonForAbsence}","${asg.reliefTeacherName}","${asg.status}","${asg.notesMMI || ''}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Guru_Ganti_${selectedMonth}_SKStPatrick.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Semakan & Audit MMI Bulanan</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Rekod Sejarah Tugasan Guru Ganti
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simpanan rekod harian bagi semakan bulanan pihak pentadbir dan laporan Melindungi Masa Instruksional (MMI).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Bulan</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  Bulan {m}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Eksport CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Jumlah Hari Rekod
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {monthlyStats.totalDays} hari
            </span>
          </div>
          <span className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Jumlah Sesi Guru Cuti
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {monthlyStats.totalAbsentDays} kes
            </span>
          </div>
          <span className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <Users className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Waktu MMI Dilindungi
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {monthlyStats.totalAssignments} waktu
            </span>
          </div>
          <span className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Main Grid: Records List + Monthly Teacher Load Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Records Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Senarai Rekod Harian</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {filteredRecords.length} Rekod
              </span>
            </h3>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari guru, tarikh, kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
              />
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700 text-sm">
                Tiada Rekod Dijumpai
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tiada rekod guru ganti yang sepadan dengan tapisan bulan atau carian ini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        {formatMalayDate(record.date)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                        {record.day}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {record.assignments.length} Sesi Ganti
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Guru Tidak Hadir:{' '}
                      <span className="font-semibold text-rose-700">
                        {record.absentTeachers
                          .map((t) => `${t.teacherName} (${t.reason})`)
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLoadRecord(record)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
                      title="Buka semula jadual tarikh ini untuk dicetak atau disunting"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka & Cetak</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Padam rekod tarikh ${record.date}?`)) {
                          onDeleteRecord(record.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Padam rekod"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Monthly Teacher Workload Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Taburan Beban Ganti Guru ({selectedMonth})
            </h3>
            <p className="text-[11px] text-slate-500">
              Kekerapan setiap guru menggantikan kelas bulan ini
            </p>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {monthlyStats.sortedTeachers.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-2 truncate max-w-[200px]">
                  <span className="font-bold text-slate-400 w-4">{idx + 1}.</span>
                  <span className="font-semibold text-slate-800 truncate">
                    {item.name}
                  </span>
                </div>
                <span
                  className={`font-black px-2 py-0.5 rounded text-[11px] ${
                    item.count >= 5
                      ? 'bg-rose-100 text-rose-800'
                      : item.count >= 2
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.count} waktu
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
