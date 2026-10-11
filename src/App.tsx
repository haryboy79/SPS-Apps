import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ReliefGeneratorView } from './components/ReliefGeneratorView';
import { PrintPdfView } from './components/PrintPdfView';
import { NotificationCenterView } from './components/NotificationCenterView';
import { HistoryMonthlyView } from './components/HistoryMonthlyView';
import { TimetableInspectorView } from './components/TimetableInspectorView';
import { DEFAULT_TEACHERS } from './data/defaultTeachers';
import { INITIAL_HISTORY_RECORDS } from './data/mockHistory';
import {
  DayOfWeek,
  TeacherTimetable,
  AbsentTeacherInput,
  ReliefAssignment,
  ReliefDayRecord,
} from './types';
import { getMalayDay } from './utils/reliefEngine';
import { SCHOOL_INFO } from './data/timeSlots';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'generator' | 'print' | 'notifications' | 'history' | 'timetable'
  >('dashboard');

  // Persistent Teachers dataset
  const [teachers, setTeachers] = useState<TeacherTimetable[]>(() => {
    const NAME_REPLACEMENTS: Record<string, string> = {
      'CIKGU AHMAD LILI': 'CIKGU HO SENG HIN',
      'CIKGU EDWIN BIN FELIX ARIP': 'CIKGU MOHAMAD HARYADI BIN EKENI',
      'CIKGU MAGARET TUNI': 'CIKGU SHARIFAH ABYAN NADZIRAH BINTI WAN YUSOF',
      'CIKGU MUHAMMAD HASHFI BIN MOHD NOOR SAHIM': 'USTAZAH NURUL NASIHAH BINTI MOHD ASRI',
      'MUHAMMAD HASHFI BIN MOHD NOOR SAHIMI': 'USTAZAH NURUL NASIHAH BINTI MOHD ASRI',
    };

    try {
      const saved = localStorage.getItem('sk_st_patrick_teachers_2026');
      if (saved) {
        const parsed: TeacherTimetable[] = JSON.parse(saved);
        return parsed.map((t) => ({
          ...t,
          name: NAME_REPLACEMENTS[t.name] || t.name,
        }));
      }
    } catch {
      // fallback
    }
    return DEFAULT_TEACHERS;
  });

  // Persistent History Records
  const [historyRecords, setHistoryRecords] = useState<ReliefDayRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sk_st_patrick_history_records');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_HISTORY_RECORDS;
  });

  // Today date & day setup
  const [currentDate, setCurrentDate] = useState<string>(() => {
    const today = new Date();
    // If today is weekend, default to Monday
    const day = today.getDay();
    if (day === 0) {
      today.setDate(today.getDate() + 1);
    } else if (day === 6) {
      today.setDate(today.getDate() + 2);
    }
    return today.toISOString().split('T')[0];
  });

  const [currentDay, setCurrentDay] = useState<DayOfWeek>(() => getMalayDay(currentDate));

  // Active absent teachers for the current session
  const [absentTeachers, setAbsentTeachers] = useState<AbsentTeacherInput[]>(() => {
    try {
      const saved = localStorage.getItem('sk_st_patrick_active_absent');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial example absent teacher for quick testing
    return [
      {
        teacherId: 'T01',
        teacherName: 'CIKGU RIKEY ANAK LAAP',
        reason: 'Cuti Sakit (MC)',
        notes: 'MC Klinik Kesihatan Mukah',
      },
    ];
  });

  // Active relief assignments
  const [assignments, setAssignments] = useState<ReliefAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('sk_st_patrick_active_assignments');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial example assignments for Cikgu Rikey Anak Laap
    return [
      {
        id: 'asg-init-1',
        date: new Date().toISOString().split('T')[0],
        day: 'Isnin',
        period: 7,
        timeSlot: '10:40 - 11:10',
        absentTeacherId: 'T01',
        absentTeacherName: 'CIKGU RIKEY ANAK LAAP',
        subject: 'BI',
        className: '4GEN',
        reliefTeacherId: 'T08',
        reliefTeacherName: 'CIKGU FIONA SYAFIQAH ABDULLAH',
        isAutoAssigned: true,
        reasonForAbsence: 'Cuti Sakit (MC)',
        status: 'Diberitahu',
        notesMMI: 'Modul Bahasa Inggeris Unit 4 Aktiviti 2',
      },
      {
        id: 'asg-init-2',
        date: new Date().toISOString().split('T')[0],
        day: 'Isnin',
        period: 8,
        timeSlot: '11:10 - 11:40',
        absentTeacherId: 'T01',
        absentTeacherName: 'CIKGU RIKEY ANAK LAAP',
        subject: 'BI',
        className: '4GEN',
        reliefTeacherId: 'T26',
        reliefTeacherName: 'CIKGU WINNY ANAK GEORGE SANTANG',
        isAutoAssigned: true,
        reasonForAbsence: 'Cuti Sakit (MC)',
        status: 'Menunggu',
        notesMMI: 'Buku Aktiviti m/s 30',
      },
    ];
  });

  // Signatures
  const [preparedBy, setPreparedBy] = useState<string>(() => {
    return localStorage.getItem('sk_st_patrick_prepared_by') || 'PENYELARAS JADUAL WAKTU (AJK)';
  });

  const [verifiedBy, setVerifiedBy] = useState<string>(() => {
    return localStorage.getItem('sk_st_patrick_verified_by') || 'GURU BESAR';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sk_st_patrick_teachers_2026', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('sk_st_patrick_history_records', JSON.stringify(historyRecords));
  }, [historyRecords]);

  useEffect(() => {
    localStorage.setItem('sk_st_patrick_active_absent', JSON.stringify(absentTeachers));
  }, [absentTeachers]);

  useEffect(() => {
    localStorage.setItem('sk_st_patrick_active_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sk_st_patrick_prepared_by', preparedBy);
  }, [preparedBy]);

  useEffect(() => {
    localStorage.setItem('sk_st_patrick_verified_by', verifiedBy);
  }, [verifiedBy]);

  // Handle single assignment status update
  const handleUpdateAssignmentStatus = (
    assignmentId: string,
    status: ReliefAssignment['status']
  ) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status,
            notifiedAt: status === 'Diberitahu' ? new Date().toISOString() : a.notifiedAt,
            confirmedAt: status === 'Disahkan' ? new Date().toISOString() : a.confirmedAt,
          };
        }
        return a;
      })
    );
  };

  // Handle update all statuses
  const handleUpdateAllStatuses = (status: ReliefAssignment['status']) => {
    setAssignments((prev) =>
      prev.map((a) => ({
        ...a,
        status,
        notifiedAt: status === 'Diberitahu' ? new Date().toISOString() : a.notifiedAt,
      }))
    );
  };

  // Save day record to history
  const handleSaveDayRecord = () => {
    const existingIndex = historyRecords.findIndex((r) => r.date === currentDate);
    const newRecord: ReliefDayRecord = {
      id: `rec-${currentDate}`,
      date: currentDate,
      day: currentDay,
      absentTeachers,
      assignments,
      preparedBy,
      verifiedBy,
      schoolName: SCHOOL_INFO.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const updated = [...historyRecords];
      updated[existingIndex] = newRecord;
      setHistoryRecords(updated);
    } else {
      setHistoryRecords([newRecord, ...historyRecords]);
    }
  };

  // Load a record from history into current view
  const handleLoadRecord = (record: ReliefDayRecord) => {
    setCurrentDate(record.date);
    setCurrentDay(record.day);
    setAbsentTeachers(record.absentTeachers);
    setAssignments(record.assignments);
    setPreparedBy(record.preparedBy);
    setVerifiedBy(record.verifiedBy);
    setActiveTab('print');
  };

  // Delete a record from history
  const handleDeleteRecord = (recordId: string) => {
    setHistoryRecords((prev) => prev.filter((r) => r.id !== recordId));
  };

  // Pending notifications count
  const pendingNotifications = assignments.filter(
    (a) => a.reliefTeacherId && a.status === 'Menunggu'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingNotificationsCount={pendingNotifications}
        todayAssignmentsCount={assignments.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentDate={currentDate}
            currentDay={currentDay}
            absentTeachers={absentTeachers}
            assignments={assignments}
            historyRecords={historyRecords}
            teachers={teachers}
            onNavigate={setActiveTab}
            onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
          />
        )}

        {activeTab === 'generator' && (
          <ReliefGeneratorView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            currentDay={currentDay}
            setCurrentDay={setCurrentDay}
            absentTeachers={absentTeachers}
            setAbsentTeachers={setAbsentTeachers}
            assignments={assignments}
            setAssignments={setAssignments}
            teachers={teachers}
            historyRecords={historyRecords}
            onSaveDayRecord={handleSaveDayRecord}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'print' && (
          <PrintPdfView
            currentDate={currentDate}
            currentDay={currentDay}
            absentTeachers={absentTeachers}
            assignments={assignments}
            preparedBy={preparedBy}
            setPreparedBy={setPreparedBy}
            verifiedBy={verifiedBy}
            setVerifiedBy={setVerifiedBy}
            teachers={teachers}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationCenterView
            currentDate={currentDate}
            currentDay={currentDay}
            assignments={assignments}
            onUpdateStatus={handleUpdateAssignmentStatus}
            onUpdateAllStatuses={handleUpdateAllStatuses}
          />
        )}

        {activeTab === 'history' && (
          <HistoryMonthlyView
            historyRecords={historyRecords}
            teachers={teachers}
            onLoadRecord={handleLoadRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableInspectorView
            teachers={teachers}
            setTeachers={setTeachers}
          />
        )}
      </main>

      {/* Footer (Hidden during print) */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{SCHOOL_INFO.name} ({SCHOOL_INFO.code})</strong> • {SCHOOL_INFO.edition}
          </div>
          <div>
            Melindungi Masa Instruksional (MMI) • Pejabat Pendidikan Daerah Mukah
          </div>
        </div>
      </footer>
    </div>
  );
}
