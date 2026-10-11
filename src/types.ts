export type DayOfWeek = 'Isnin' | 'Selasa' | 'Rabu' | 'Khamis' | 'Jumaat';

export interface TimeSlot {
  period: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

export interface ClassSchedule {
  subject: string;
  className: string;
  code?: string;
}

export interface TeacherTimetable {
  id: string;
  name: string;
  initials?: string;
  majorSubjects: string[];
  schedule: Record<DayOfWeek, Record<number, ClassSchedule | null>>;
}

export type AbsenceReason =
  | 'Cuti Sakit (MC)'
  | 'Cuti Rehat Khas (CRK)'
  | 'Berkursus / Bengkel'
  | 'Urusan Rasmi / Mesyuarat PPD/JPN'
  | 'Kuarantin'
  | 'Cuti Bersalin'
  | 'Cuti Kecemasan'
  | 'Cuti Tanpa Gaji'
  | 'Lain-lain';

export interface AbsentTeacherInput {
  teacherId: string;
  teacherName: string;
  reason: AbsenceReason;
  notes?: string;
}

export type AssignmentStatus = 'Menunggu' | 'Diberitahu' | 'Disahkan' | 'Selesai';

export interface ReliefAssignment {
  id: string;
  date: string;
  day: DayOfWeek;
  period: number;
  timeSlot: string;
  absentTeacherId: string;
  absentTeacherName: string;
  subject: string;
  className: string;
  reliefTeacherId: string;
  reliefTeacherName: string;
  isAutoAssigned: boolean;
  reasonForAbsence: string;
  status: AssignmentStatus;
  notifiedAt?: string;
  confirmedAt?: string;
  notesMMI?: string; // Arahan / Tugasan MMI untuk murid
}

export interface ReliefDayRecord {
  id: string;
  date: string;
  day: DayOfWeek;
  absentTeachers: AbsentTeacherInput[];
  assignments: ReliefAssignment[];
  preparedBy: string;
  verifiedBy: string;
  schoolName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TeacherWorkloadStats {
  teacherId: string;
  teacherName: string;
  todayCount: number;
  monthCount: number;
  totalCount: number;
  lastReliefDate?: string;
}
