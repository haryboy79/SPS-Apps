import { TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  { period: 0, label: 'Waktu 0', startTime: '06:50', endTime: '07:20' },
  { period: 1, label: 'Waktu 1', startTime: '07:20', endTime: '07:50' },
  { period: 2, label: 'Waktu 2', startTime: '07:50', endTime: '08:20' },
  { period: 3, label: 'Waktu 3', startTime: '08:20', endTime: '08:50' },
  { period: 4, label: 'Waktu 4', startTime: '08:50', endTime: '09:20' },
  { period: 5, label: 'Waktu 5', startTime: '09:20', endTime: '09:50' },
  // REHAT is 09:50 - 10:10
  { period: 6, label: 'Waktu 6', startTime: '10:10', endTime: '10:40' },
  { period: 7, label: 'Waktu 7', startTime: '10:40', endTime: '11:10' },
  { period: 8, label: 'Waktu 8', startTime: '11:10', endTime: '11:40' },
  { period: 9, label: 'Waktu 9', startTime: '11:40', endTime: '12:10' },
  { period: 10, label: 'Waktu 10', startTime: '12:10', endTime: '12:40' },
];

export const BREAK_SLOT = {
  startTime: '09:50',
  endTime: '10:10',
  label: 'REHAT',
};

export const SCHOOL_INFO = {
  name: 'SK ST PATRICK, MUKAH',
  code: 'YBB3101',
  edition: 'Jadual Waktu Persekolahan 2026 (Pindaan 1)',
  district: 'Pejabat Pendidikan Daerah Mukah',
  state: 'Sarawak',
  program: 'PROGRAM TRANSFORMASI SEKOLAH 2025 (TS25)',
  motto: 'ILMU PEDOMAN HIDUP',
  headmaster: 'GURU BESAR',
};

export const PREPARER_ROLES = [
  { group: 'Pentadbir Utama', options: ['GURU BESAR'] },
  {
    group: 'Penolong Kanan',
    options: [
      'PENOLONG KANAN PENTADBIRAN',
      'PENOLONG KANAN HAL EHWAL MURID (HEM)',
      'PENOLONG KANAN KOKURIKULUM',
    ],
  },
  {
    group: 'AJK Jadual Waktu',
    options: [
      'PENYELARAS JADUAL WAKTU (AJK)',
      'SETIAUSAHA JADUAL WAKTU (AJK)',
      'AHLI JAWATANKUASA JADUAL WAKTU',
    ],
  },
];
