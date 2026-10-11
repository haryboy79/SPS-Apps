import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  ShieldAlert,
} from 'lucide-react';
import {
  DayOfWeek,
  TeacherTimetable,
  AbsentTeacherInput,
  ReliefAssignment,
} from '../types';
import { TIME_SLOTS, BREAK_SLOT } from '../data/timeSlots';
import {
  countTeacherDailyPeriods,
  isTeacherPentadbir,
  checkHasConsecutivePeriod,
} from '../utils/reliefEngine';

interface DailyAvailabilityMatrixProps {
  day: DayOfWeek;
  teachers: TeacherTimetable[];
  absentTeachers: AbsentTeacherInput[];
  assignments: ReliefAssignment[];
  onAssignTeacher: (assignmentId: string, teacherId: string) => void;
}

export const DailyAvailabilityMatrix: React.FC<DailyAvailabilityMatrixProps> = ({
  day,
  teachers,
  absentTeachers,
  assignments,
  onAssignTeacher,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const absentTeacherIds = useMemo(
    () => absentTeachers.map((t) => t.teacherId),
    [absentTeachers]
  );

  // Sort teachers by:
  // 1. Regular teachers first, Pentadbir last (elak pentadbir ganti jika boleh)
  // 2. Fewest PERIODS (waktu) today first
  const sortedTeachers = useMemo(() => {
    return [...teachers]
      .filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.majorSubjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        const aIsPentadbir = isTeacherPentadbir(a.id, a.name);
        const bIsPentadbir = isTeacherPentadbir(b.id, b.name);

        // Put pentadbir at the bottom as per requirement
        if (aIsPentadbir !== bIsPentadbir) {
          return aIsPentadbir ? 1 : -1;
        }

        const aPeriods = countTeacherDailyPeriods(a, day);
        const bPeriods = countTeacherDailyPeriods(b, day);
        return aPeriods - bPeriods;
      });
  }, [teachers, day, searchQuery]);

  // Map assignments needing replacement by period
  const neededAssignmentsByPeriod = useMemo(() => {
    const map: Record<number, ReliefAssignment[]> = {};
    assignments.forEach((asg) => {
      if (!map[asg.period]) {
        map[asg.period] = [];
      }
      map[asg.period].push(asg);
    });
    return map;
  }, [assignments]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Matrix Header & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
            <span>Jadual Matriks Kekosongan Guru Hari {day}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {teachers.length} Guru
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Disusun mengikut <strong>PERIOD paling sedikit</strong> (bukan subjek). Pentadbir diasingkan di bahagian bawah untuk dielakkan melainkan tiada guru lain.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-950 font-bold">
            <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shrink-0" />
            <span>KUNING: Guru Lapang (Free)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 border border-red-300 text-red-950 font-bold">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-700 shrink-0" />
            <span>MERAH: Tidak Free (Ada Kelas / Cuti)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 border border-blue-300 text-blue-900 font-bold">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-blue-700 shrink-0" />
            <span>BIRU: Guru Ganti Dilantik</span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari guru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
            />
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
        <table className="w-full text-xs border-collapse min-w-[1020px]">
          <thead>
            <tr className="bg-slate-900 text-white font-bold text-center">
              <th className="py-2.5 px-3 text-left w-64 sticky left-0 z-20 bg-slate-900 border-r border-slate-800">
                GURU (SUSUNAN MENGIKUT PERIOD PALING SEDIKIT)
              </th>
              <th className="py-2 px-2 w-24 text-center border-r border-slate-800">
                JUMLAH PERIOD HARI INI
              </th>
              {TIME_SLOTS.map((slot) => {
                const neededList = neededAssignmentsByPeriod[slot.period] || [];
                const needsReplacement = neededList.length > 0;
                const allAssigned =
                  needsReplacement && neededList.every((a) => Boolean(a.reliefTeacherId));

                return (
                  <React.Fragment key={slot.period}>
                    <th
                      className={`py-2 px-1 text-center min-w-[70px] border-r border-slate-800 ${
                        needsReplacement
                          ? allAssigned
                            ? 'bg-blue-900 text-blue-100'
                            : 'bg-amber-600 text-white animate-pulse'
                          : ''
                      }`}
                    >
                      <div className="font-extrabold text-[11px]">W{slot.period}</div>
                      <div className="text-[9px] font-normal opacity-80 leading-tight">
                        {slot.startTime}
                      </div>
                      {needsReplacement && (
                        <div
                          className={`mt-0.5 text-[8.5px] px-1 py-0.2 rounded font-black uppercase ${
                            allAssigned ? 'bg-blue-800 text-blue-200' : 'bg-red-500 text-white'
                          }`}
                        >
                          {allAssigned ? 'Diisi' : 'Perlu Ganti'}
                        </div>
                      )}
                    </th>
                    {slot.period === 5 && (
                      <th className="py-2 px-1 text-center bg-amber-950 text-amber-200 border-r border-slate-800 min-w-[50px]">
                        <div className="text-[10px] font-bold">REHAT</div>
                        <div className="text-[8.5px] font-normal opacity-80">
                          {BREAK_SLOT.startTime}
                        </div>
                      </th>
                    )}
                  </React.Fragment>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedTeachers.map((teacher, rank) => {
              const dailyPeriods = countTeacherDailyPeriods(teacher, day);
              const isAbsent = absentTeacherIds.includes(teacher.id);
              const isPentadbir = isTeacherPentadbir(teacher.id, teacher.name);

              return (
                <tr
                  key={teacher.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    isAbsent
                      ? 'bg-rose-50/50 opacity-80'
                      : isPentadbir
                      ? 'bg-amber-50/20'
                      : ''
                  }`}
                >
                  {/* Teacher Name Column (Sticky left) */}
                  <td className="py-2.5 px-3 font-semibold text-slate-900 sticky left-0 z-10 bg-white border-r border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[10px] text-slate-400 w-5">
                        #{rank + 1}
                      </span>
                      <div className="truncate max-w-[210px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 block truncate">
                            {teacher.name}
                          </span>
                          {isPentadbir && (
                            <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[9px] font-black rounded shrink-0">
                              Pentadbir
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          Opsyen: {teacher.majorSubjects.join(', ')}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Daily Period Count Badge */}
                  <td className="py-2 px-1 text-center border-r border-slate-200">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                        dailyPeriods <= 2
                          ? 'bg-emerald-100 text-emerald-800'
                          : dailyPeriods <= 4
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {dailyPeriods} Period
                    </span>
                  </td>

                  {/* Period cells */}
                  {TIME_SLOTS.map((slot) => {
                    const scheduled = teacher.schedule[day]?.[slot.period];
                    const neededList = neededAssignmentsByPeriod[slot.period] || [];

                    // Check if this teacher is assigned as relief for any needed assignment in this slot
                    const isAssignedHere = neededList.some(
                      (a) => a.reliefTeacherId === teacher.id
                    );

                    // Check if teacher is assigned to another relief slot in this period
                    const isReliefElsewhere = assignments.some(
                      (a) =>
                        a.period === slot.period &&
                        a.reliefTeacherId === teacher.id &&
                        !neededList.includes(a)
                    );

                    const isFree =
                      !isAbsent &&
                      !scheduled &&
                      !isReliefElsewhere &&
                      (!neededList.some((a) => a.reliefTeacherId === teacher.id) || isAssignedHere);

                    // Target assignment to fill
                    const targetAsg =
                      neededList.find((a) => a.reliefTeacherId === teacher.id) ||
                      neededList.find((a) => !a.reliefTeacherId) ||
                      neededList[0];

                    const hasConsecutive = checkHasConsecutivePeriod(
                      teacher,
                      day,
                      slot.period,
                      assignments
                    );

                    return (
                      <React.Fragment key={slot.period}>
                        <td className="p-1 border-r border-slate-200 text-center align-middle">
                          {isAbsent ? (
                            /* MERAH: Guru Tidak Hadir */
                            <div className="bg-red-200 border border-red-400 text-red-950 rounded p-1 text-[9.5px] font-black leading-tight">
                              CUTI
                            </div>
                          ) : isAssignedHere ? (
                            /* BIRU: Guru Ganti Yang Dilantik */
                            <div
                              onClick={() => {
                                if (targetAsg) {
                                  onAssignTeacher(targetAsg.id, '');
                                }
                              }}
                              className="bg-blue-600 border border-blue-700 text-white rounded p-1 text-[9.5px] font-black cursor-pointer hover:bg-red-600 transition-colors shadow-2xs"
                              title="Klik untuk batalkan penugasan guru ganti ini"
                            >
                              <div className="flex items-center justify-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                <span>GANTI</span>
                              </div>
                              <div className="text-[8px] opacity-90 truncate">
                                {targetAsg?.className}
                              </div>
                            </div>
                          ) : scheduled ? (
                            /* MERAH: Ada Kelas Mengajar (Tidak Free) */
                            <div className="bg-red-100 border border-red-300 text-red-950 rounded p-1 text-[9.5px] font-bold leading-tight">
                              <span className="block font-black">{scheduled.subject}</span>
                              <span className="text-[8.5px] text-red-800 block truncate">
                                {scheduled.className}
                              </span>
                            </div>
                          ) : isReliefElsewhere ? (
                            /* MERAH: Sedang Ganti Kelas Lain (Tidak Free) */
                            <div className="bg-red-100 border border-red-300 text-red-950 rounded p-1 text-[9.5px] font-bold leading-tight">
                              GANTI LAIN
                            </div>
                          ) : (
                            /* KUNING: GURU LAPANG (FREE) */
                            <div
                              onClick={() => {
                                if (targetAsg) {
                                  onAssignTeacher(targetAsg.id, teacher.id);
                                }
                              }}
                              className={`rounded p-1 text-[9.5px] transition-all ${
                                neededList.length > 0
                                  ? 'bg-yellow-300 hover:bg-yellow-400 text-yellow-950 font-black border-2 border-yellow-500 cursor-pointer shadow-xs active:scale-95'
                                  : 'bg-yellow-100 text-yellow-900 border border-yellow-300 font-bold'
                              }`}
                              title={
                                neededList.length > 0
                                  ? `KLIK UNTUK LANTIK ${teacher.name} ganti kelas ${targetAsg?.className} (${targetAsg?.subject})`
                                  : isPentadbir
                                  ? 'Guru Pentadbir (Lapang, dielakkan kecuali tiada pilihan lain)'
                                  : !hasConsecutive
                                  ? 'Guru lapang (Masa tidak berturut-turut ⭐)'
                                  : 'Guru lapang'
                              }
                            >
                              <span className="block font-extrabold">LAPANG</span>
                              {isPentadbir ? (
                                <span className="text-[7.5px] text-purple-900 font-bold block">
                                  Pentadbir
                                </span>
                              ) : !hasConsecutive ? (
                                <span className="text-[7.5px] text-emerald-800 font-bold block">
                                  ⭐ Tak Berturut
                                </span>
                              ) : null}

                              {neededList.length > 0 && !targetAsg?.reliefTeacherId && (
                                <span className="text-[8px] bg-yellow-500 text-yellow-950 px-1 rounded block mt-0.5 font-black uppercase">
                                  + Pilih
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* REHAT Column */}
                        {slot.period === 5 && (
                          <td className="p-1 border-r border-slate-200 text-center bg-amber-50/70 text-amber-800 text-[9px] font-bold">
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
  );
};
