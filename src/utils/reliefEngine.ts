import {
  DayOfWeek,
  TeacherTimetable,
  ReliefAssignment,
  AbsentTeacherInput,
  ReliefDayRecord,
} from '../types';
import { TIME_SLOTS } from '../data/timeSlots';

// Senarai ID & Nama Golongan Pentadbir SK St Patrick Mukah
// (Rikey Anak Laap, Mohamad Haryadi Bin Ekeni, Patricia Binti Albert, Ho Seng Hin)
export const PENTADBIR_IDS = ['T01', 'T02', 'T03', 'T04'];

export function isTeacherPentadbir(teacherId: string, teacherName = ''): boolean {
  if (PENTADBIR_IDS.includes(teacherId)) return true;
  const n = teacherName.toLowerCase();
  return (
    n.includes('rikey') ||
    n.includes('ho seng hin') ||
    n.includes('patricia') ||
    n.includes('haryadi')
  );
}

export interface TeacherCandidate {
  teacher: TeacherTimetable;
  isFree: boolean;
  isPentadbir: boolean;
  score: number;
  reasonTag: string;
  dailyPeriodCount: number; // Dikira mengikut BILANGAN PERIOD (bukan jumlah subjek)
  hasConsecutivePeriod: boolean; // Adakah masa berturut-turut dengan waktu mengajar lain
  todayReliefCount: number;
  monthReliefCount: number;
}

/**
 * Gets the Malay Day of Week name from a Date object or YYYY-MM-DD string
 */
export function getMalayDay(dateInput: Date | string): DayOfWeek {
  const d = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
  const dayIndex = d.getDay(); // 0 is Sunday, 1 is Monday ... 5 is Friday
  switch (dayIndex) {
    case 1:
      return 'Isnin';
    case 2:
      return 'Selasa';
    case 3:
      return 'Rabu';
    case 4:
      return 'Khamis';
    case 5:
      return 'Jumaat';
    default:
      return 'Isnin'; // default fallback for school days
  }
}

/**
 * Kira jumlah PERIOD (waktu mengajar) guru pada hari berkenaan (bukan jumlah subjek)
 */
export function countTeacherDailyPeriods(teacher: TeacherTimetable, day: DayOfWeek): number {
  const daySchedule = teacher.schedule[day] || {};
  return Object.entries(daySchedule).filter(([periodStr, slot]) => {
    // Exclude assembly (HIM) on Monday
    return slot !== null && slot !== undefined && slot.subject !== 'HIM';
  }).length;
}

/**
 * Periksa sama ada penugasan pada `targetPeriod` akan menghasilkan masa berturut-turut (consecutive)
 * bagi guru ini (iaitu ada kelas atau ganti pada targetPeriod - 1 atau targetPeriod + 1).
 */
export function checkHasConsecutivePeriod(
  teacher: TeacherTimetable,
  day: DayOfWeek,
  targetPeriod: number,
  currentAssignments: ReliefAssignment[]
): boolean {
  const daySchedule = teacher.schedule[day] || {};

  // Check period sebelum (targetPeriod - 1)
  const prevPeriod = targetPeriod - 1;
  const hasPrevScheduled =
    prevPeriod >= 1 &&
    daySchedule[prevPeriod] !== null &&
    daySchedule[prevPeriod] !== undefined &&
    daySchedule[prevPeriod]?.subject !== 'HIM';

  const hasPrevRelief = currentAssignments.some(
    (a) => a.reliefTeacherId === teacher.id && a.period === prevPeriod
  );

  // Check period selepas (targetPeriod + 1)
  const nextPeriod = targetPeriod + 1;
  const hasNextScheduled =
    nextPeriod <= 10 &&
    daySchedule[nextPeriod] !== null &&
    daySchedule[nextPeriod] !== undefined &&
    daySchedule[nextPeriod]?.subject !== 'HIM';

  const hasNextRelief = currentAssignments.some(
    (a) => a.reliefTeacherId === teacher.id && a.period === nextPeriod
  );

  return Boolean(hasPrevScheduled || hasPrevRelief || hasNextScheduled || hasNextRelief);
}

/**
 * Check if a teacher is free during a specific day & period
 */
export function isTeacherFree(
  teacher: TeacherTimetable,
  day: DayOfWeek,
  period: number,
  absentTeacherIds: string[],
  currentAssignments: ReliefAssignment[]
): boolean {
  // 1. Is the teacher themselves absent?
  if (absentTeacherIds.includes(teacher.id)) {
    return false;
  }

  // 2. Does the teacher have a scheduled class in this period?
  const scheduledClass = teacher.schedule[day]?.[period];
  if (scheduledClass) {
    return false;
  }

  // 3. Is the teacher already assigned to substitute in this exact period today?
  const isAlreadyAssignedInPeriod = currentAssignments.some(
    (a) => a.reliefTeacherId === teacher.id && a.period === period
  );
  if (isAlreadyAssignedInPeriod) {
    return false;
  }

  return true;
}

/**
 * Finds all free teachers and ranks them with an intelligent fitness score
 * CRITERIA PENGIRAAN:
 * 1. Sorting waktu dikira mengikut PERIOD (bukan jumlah subjek).
 * 2. Guru paling kurang period diberi keutamaan tertinggi.
 * 3. Masa yang tidak berturut-turut diberi keutamaan (elak penat berturut-turut).
 * 4. Golongan Pentadbir (Rikey, Ho Seng Hin, Patricia, Haryadi) dielakkan kecuali tiada lagi guru lain.
 */
export function getCandidateTeachers(
  day: DayOfWeek,
  period: number,
  targetSubject: string,
  teachers: TeacherTimetable[],
  absentTeacherIds: string[],
  currentAssignments: ReliefAssignment[],
  historyRecords: ReliefDayRecord[] = []
): TeacherCandidate[] {
  // Calculate historical monthly relief counts
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const monthlyCounts: Record<string, number> = {};

  historyRecords.forEach((record) => {
    if (record.date.startsWith(currentMonth)) {
      record.assignments.forEach((asg) => {
        if (asg.reliefTeacherId) {
          monthlyCounts[asg.reliefTeacherId] = (monthlyCounts[asg.reliefTeacherId] || 0) + 1;
        }
      });
    }
  });

  return teachers.map((teacher) => {
    // 1. Bilangan PERIOD sebenar hari ini (bukan jumlah subjek)
    const dailyPeriodCount = countTeacherDailyPeriods(teacher, day);

    // 2. Status kelapangan
    const isFree = isTeacherFree(teacher, day, period, absentTeacherIds, currentAssignments);

    // 3. Status pentadbir
    const isPentadbir = isTeacherPentadbir(teacher.id, teacher.name);

    // 4. Semak sama ada waktu berturut-turut
    const hasConsecutivePeriod = checkHasConsecutivePeriod(teacher, day, period, currentAssignments);

    const todayReliefCount = currentAssignments.filter(
      (a) => a.reliefTeacherId === teacher.id
    ).length;

    const monthReliefCount = monthlyCounts[teacher.id] || 0;

    const reasonTags: string[] = [];

    if (!isFree) {
      if (absentTeacherIds.includes(teacher.id)) {
        reasonTags.push('Tidak Hadir Hari Ini (Cuti)');
      } else {
        const slot = teacher.schedule[day]?.[period];
        if (slot) {
          reasonTags.push(`Ada Kelas Waktu Ini (${slot.subject} ${slot.className})`);
        } else {
          reasonTags.push('Sedang Ganti Kelas Lain Waktu Ini');
        }
      }
      return {
        teacher,
        isFree: false,
        isPentadbir,
        score: -99999,
        reasonTag: reasonTags.join(', '),
        dailyPeriodCount,
        hasConsecutivePeriod,
        todayReliefCount,
        monthReliefCount,
      };
    }

    // =========================================================================
    // FORMULA SKOR KELAYAKAN GURU GANTI (TERPILIH)
    // =========================================================================

    // 1. KEUTAMAAN UTAMA: Makin kurang PERIOD (waktu mengajar), makin tinggi skor!
    // Skala: (12 - dailyPeriodCount) * 150 mata
    // Contoh: 0 period -> 1800 mata, 1 period -> 1650 mata, 4 period -> 1200 mata
    let score = (12 - dailyPeriodCount) * 150;
    reasonTags.push(`${dailyPeriodCount} Period Mengajar Hari Ini`);

    // 2. KEUTAMAAN MASA TIDAK BERTURUT-TURUT:
    // Guru yang tidak mengajar sebelum & selepas waktu ini diberi bonus +100 mata
    if (!hasConsecutivePeriod) {
      score += 100;
      reasonTags.push('Masa Tidak Berturut-turut ⭐');
    } else {
      score -= 120;
      reasonTags.push('Waktu Berturut-turut ⚠️');
    }

    // 3. PENTADBIR (Rikey, Ho Seng Hin, Patricia, Haryadi) DIELAKKAN:
    // Penalti besar (-5000 mata) supaya SEMUA guru biasa yang lapang dipilih dahulu!
    // Pentadbir hanya akan berada di kedudukan teratas jika TIADA lagi guru biasa yang lapang.
    if (isPentadbir) {
      score -= 5000;
      reasonTags.push('Pentadbir (Dielakkan Kecuali Terpaksa) 🏛️');
    }

    // 4. Bonus opsyen matapelajaran sama (+40 mata)
    const subClean = targetSubject.toUpperCase().trim();
    const hasSameMajor = teacher.majorSubjects.some(
      (m) => m.toUpperCase() === subClean || subClean.includes(m.toUpperCase())
    );

    if (hasSameMajor) {
      score += 40;
      reasonTags.push(`Opsyen Sama (${teacher.majorSubjects.join('/')})`);
    }

    // 5. Penalti jika sudah ada tugasan ganti hari ini (-250 mata supaya giliran berputar)
    if (todayReliefCount === 0) {
      score += 30;
      reasonTags.push('Belum Ganti Hari Ini');
    } else {
      score -= todayReliefCount * 250;
      reasonTags.push(`Sudah Ganti ${todayReliefCount}x Hari Ini`);
    }

    // 6. Penalti kecil rekod bulanan sebagai penentu seri
    score -= monthReliefCount;

    return {
      teacher,
      isFree: true,
      isPentadbir,
      score,
      reasonTag: reasonTags.join(' • '),
      dailyPeriodCount,
      hasConsecutivePeriod,
      todayReliefCount,
      monthReliefCount,
    };
  }).sort((a, b) => {
    // 1. Guru lapang (Free) sentiasa di atas guru sibuk
    if (a.isFree !== b.isFree) {
      return a.isFree ? -1 : 1;
    }
    // 2. Jika sama-sama lapang atau sama-sama sibuk, susun mengikut skor tertinggi
    return b.score - a.score;
  });
}

/**
 * Intelligent Auto-Assign algorithm for all missing periods
 */
export function autoAssignAllPeriods(
  day: DayOfWeek,
  date: string,
  absentTeachers: AbsentTeacherInput[],
  allTeachers: TeacherTimetable[],
  existingAssignments: ReliefAssignment[],
  historyRecords: ReliefDayRecord[] = []
): ReliefAssignment[] {
  const absentTeacherIds = absentTeachers.map((t) => t.teacherId);
  const updatedAssignments: ReliefAssignment[] = [...existingAssignments];

  // Loop through all unassigned slots
  for (const asg of updatedAssignments) {
    if (!asg.reliefTeacherId) {
      const candidates = getCandidateTeachers(
        day,
        asg.period,
        asg.subject,
        allTeachers,
        absentTeacherIds,
        updatedAssignments,
        historyRecords
      );

      const availableCandidates = candidates.filter((c) => c.isFree);
      if (availableCandidates.length > 0) {
        const best = availableCandidates[0];
        asg.reliefTeacherId = best.teacher.id;
        asg.reliefTeacherName = best.teacher.name;
        asg.isAutoAssigned = true;
        asg.status = 'Menunggu';
      }
    }
  }

  return updatedAssignments;
}

/**
 * Generate formatted WhatsApp message for teacher notification
 */
export function generateWhatsAppMessage(
  assignment: ReliefAssignment,
  schoolName = 'SK ST PATRICK, MUKAH'
): string {
  const msg = `*SLIP GURU GANTI (MMI) - ${schoolName.toUpperCase()}*

Kepada: *${assignment.reliefTeacherName}*

Tuan/Puan telah ditugaskan menggantikan kelas seperti butiran berikut:

📅 *Tarikh:* ${assignment.date} (${assignment.day})
⏰ *Waktu:* Waktu ${assignment.period} (${assignment.timeSlot})
🏫 *Kelas:* ${assignment.className}
📖 *Mata Pelajaran:* ${assignment.subject}
👤 *Guru Tidak Hadir:* ${assignment.absentTeacherName} (${assignment.reasonForAbsence})
📝 *Bahan / Tugasan MMI:* ${assignment.notesMMI || 'Sila jalankan aktiviti pembelajaran mengikut modul MMI / buku aktiviti murid.'}

Harap maklum & terima kasih atas kerjasama tuan/puan dalam Melindungi Masa Instruksional (MMI).`;

  return encodeURIComponent(msg);
}

/**
 * Format date nicely in Malay
 */
export function formatMalayDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const monthsMalay = [
    'Januari',
    'Februari',
    'Mac',
    'April',
    'Mei',
    'Jun',
    'Julai',
    'Ogos',
    'September',
    'Oktober',
    'November',
    'Disember',
  ];
  const mIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} ${monthsMalay[mIndex] || month} ${year}`;
}
