import { TeacherTimetable, DayOfWeek, ClassSchedule } from '../types';

const emptySchedule = (): Record<DayOfWeek, Record<number, ClassSchedule | null>> => ({
  Isnin: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
  Selasa: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
  Rabu: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
  Khamis: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
  Jumaat: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
});

export const DEFAULT_TEACHERS: TeacherTimetable[] = [
  // 1. CIKGU RIKEY ANAK LAAP
  {
    id: 'T01',
    name: 'CIKGU RIKEY ANAK LAAP',
    initials: 'RL',
    majorSubjects: ['BI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: null, 5: null, 6: null, 7: { subject: 'BI', className: '4GEN' }, 8: { subject: 'BI', className: '4GEN' }, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BI', className: '4GEN' }, 5: { subject: 'BI', className: '4GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BI', className: '4GEN' }, 5: { subject: 'BI', className: '4GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'BI', className: '4GEN' }, 3: { subject: 'BI', className: '4GEN' }, 4: null, 5: null, 6: null, 7: null, 8: { subject: 'BI', className: '4GEN' }, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 2. CIKGU MOHAMAD HARYADI BIN EKENI
  {
    id: 'T02',
    name: 'CIKGU MOHAMAD HARYADI BIN EKENI',
    initials: 'MH',
    majorSubjects: ['BI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'BI', className: '4GLO' }, 3: null, 4: null, 5: null, 6: null, 7: { subject: 'BI', className: '2GEN' }, 8: { subject: 'BI', className: '2GEN' }, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BI', className: '2GEN' }, 5: { subject: 'BI', className: '2GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'BI', className: '2GEN' }, 3: { subject: 'BI', className: '2GEN' }, 4: null, 5: null, 6: { subject: 'BI', className: '4GLO' }, 7: { subject: 'BI', className: '4GLO' }, 8: null, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: { subject: 'BI', className: '2GEN' }, 7: { subject: 'BI', className: '2GEN' }, 8: null, 9: { subject: 'BI', className: '4GLO' }, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'BI', className: '4GLO' }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 3. CIKGU PATRICIA BINTI ALBERT
  {
    id: 'T03',
    name: 'CIKGU PATRICIA BINTI ALBERT',
    initials: 'PA',
    majorSubjects: ['BM', 'PM', 'PSV'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: { subject: 'BM', className: '5GEN' }, 5: { subject: 'BM', className: '5GEN' }, 6: null, 7: null, 8: { subject: 'BM', className: '5GEN' }, 9: { subject: 'PM', className: '5GLO/5GEN' }, 10: null },
      Selasa: { 0: null, 1: null, 2: null, 3: { subject: 'PM', className: '5GLO/5GEN' }, 4: { subject: 'PM', className: '5GLO/5GEN' }, 5: null, 6: { subject: 'BM', className: '5GEN' }, 7: { subject: 'BM', className: '5GEN' }, 8: null, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BM', className: '5GEN' }, 5: { subject: 'BM', className: '5GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'BM', className: '5GEN' }, 3: null, 4: null, 5: null, 6: { subject: 'PSV', className: '4GEN' }, 7: { subject: 'PSV', className: '4GEN' }, 8: null, 9: null, 10: null },
      Jumaat: { 0: null, 1: { subject: 'PM', className: '5GLO/5GEN' }, 2: { subject: 'PM', className: '5GLO/5GEN' }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 4. CIKGU HO SENG HIN
  {
    id: 'T04',
    name: 'CIKGU HO SENG HIN',
    initials: 'HSH',
    majorSubjects: ['PJ', 'PK', 'PM'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: null, 5: { subject: 'PK', className: '1GEN' }, 6: { subject: 'PK', className: '3GEN' }, 7: null, 8: { subject: 'PK', className: '5GLO' }, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: null, 3: { subject: 'PJ', className: '1GEN' }, 4: { subject: 'PJ', className: '1GEN' }, 5: { subject: 'PJ', className: '3GEN' }, 6: null, 7: { subject: 'PM', className: '4GLO/4GEN' }, 8: { subject: 'PM', className: '4GLO/4GEN' }, 9: null, 10: { subject: 'PK', className: '5GEN' } },
      Rabu: { 0: null, 1: null, 2: null, 3: { subject: 'PJ', className: '5GEN' }, 4: { subject: 'PJ', className: '5GEN' }, 5: { subject: 'PJ', className: '5GLO' }, 6: null, 7: null, 8: null, 9: { subject: 'PM', className: '4GLO/4GEN' }, 10: { subject: 'PM', className: '4GLO/4GEN' } },
      Khamis: { 0: null, 1: null, 2: null, 3: { subject: 'PJ', className: '1GEN' }, 4: { subject: 'PM', className: '4GLO/4GEN' }, 5: { subject: 'PM', className: '4GLO/4GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
      Jumaat: { 0: null, 1: { subject: 'PJ', className: '3GEN' }, 2: null, 3: { subject: 'PJ', className: '5GLO' }, 4: null, 5: { subject: 'PJ', className: '5GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 5. CIKGU AHMAD LATIP BIN ALWI
  {
    id: 'T05',
    name: 'CIKGU AHMAD LATIP BIN ALWI',
    initials: 'ALA',
    majorSubjects: ['BM', 'RBT', 'PSV'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'BM', className: '6GLO' }, 3: { subject: 'BM', className: '6GLO' }, 4: null, 5: null, 6: null, 7: { subject: 'RBT', className: '6GEN' }, 8: { subject: 'RBT', className: '6GEN' }, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: { subject: 'BM', className: '4GLO' }, 3: null, 4: { subject: 'BM', className: '6GLO' }, 5: { subject: 'BM', className: '6GLO' }, 6: null, 7: null, 8: { subject: 'RBT', className: '5GEN' }, 9: { subject: 'RBT', className: '5GEN' }, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'BM', className: '4GLO' }, 3: null, 4: null, 5: null, 6: { subject: 'PSV', className: '1GEN' }, 7: { subject: 'PSV', className: '1GEN' }, 8: null, 9: { subject: 'PSV', className: '5GEN' }, 10: { subject: 'PSV', className: '5GEN' } },
      Khamis: { 0: null, 1: null, 2: null, 3: { subject: 'BM', className: '4GLO' }, 4: { subject: 'BM', className: '4GLO' }, 5: null, 6: null, 7: { subject: 'BM', className: '6GLO' }, 8: { subject: 'BM', className: '6GLO' }, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'BM', className: '6GLO' }, 3: null, 4: null, 5: null, 6: null, 7: { subject: 'BM', className: '4GLO' }, 8: { subject: 'BM', className: '4GLO' }, 9: null, 10: null },
    },
  },

  // 6. CIKGU ALIZA BINTI IJAN
  {
    id: 'T06',
    name: 'CIKGU ALIZA BINTI IJAN',
    initials: 'AI',
    majorSubjects: ['MT', 'SN', 'PM', 'MZ'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'SN', className: '1GEN' }, 3: { subject: 'PM', className: '1GLO/1GEN' }, 4: { subject: 'PM', className: '1GLO/1GEN' }, 5: null, 6: { subject: 'MT', className: '4GEN' }, 7: { subject: 'MT', className: '4GEN' }, 8: null, 9: null, 10: null },
      Selasa: { 0: null, 1: { subject: 'PM', className: '1GLO/1GEN' }, 2: { subject: 'PM', className: '1GLO/1GEN' }, 3: { subject: 'MT', className: '4GEN' }, 4: null, 5: null, 6: { subject: 'MT', className: '1GEN' }, 7: { subject: 'MT', className: '5GLO' }, 8: { subject: 'MT', className: '5GLO' }, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'MT', className: '4GEN' }, 3: { subject: 'MZ', className: '1GEN' }, 4: null, 5: null, 6: { subject: 'MT', className: '5GLO' }, 7: null, 8: { subject: 'MT', className: '1GEN' }, 9: { subject: 'MT', className: '1GEN' }, 10: null },
      Khamis: { 0: null, 1: { subject: 'PM', className: '1GLO/1GEN' }, 2: { subject: 'PM', className: '1GLO/1GEN' }, 3: null, 4: { subject: 'SN', className: '1GEN' }, 5: { subject: 'SN', className: '1GEN' }, 6: { subject: 'MT', className: '5GLO' }, 7: null, 8: { subject: 'MT', className: '1GEN' }, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'MT', className: '4GEN' }, 3: null, 4: { subject: 'MT', className: '5GLO' }, 5: null, 6: null, 7: null, 8: { subject: 'MT', className: '1GEN' }, 9: null, 10: null },
    },
  },

  // 7. CIKGU DAYANG AMANINA BIN BAKAR
  {
    id: 'T07',
    name: 'CIKGU DAYANG AMANINA BIN BAKAR',
    initials: 'DA',
    majorSubjects: ['TAS', 'BA', 'PAI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: { subject: 'TAS', className: '3GEN' }, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: null, 5: null, 6: { subject: 'BA', className: '2GEN/2GLO' }, 7: null, 8: { subject: 'BA', className: '1GLO/1GEN' }, 9: { subject: 'BA', className: '4GLO/4GEN' }, 10: null },
      Selasa: { 0: { subject: 'TAS', className: '3GEN' }, 1: null, 2: { subject: 'BA', className: '3GLO/3GEN' }, 3: null, 4: null, 5: null, 6: { subject: 'BA', className: '4GLO/4GEN' }, 7: { subject: 'PAI', className: '4GLO' }, 8: { subject: 'PAI', className: '4GLO' }, 9: null, 10: null },
      Rabu: { 0: { subject: 'TAS', className: '4GLO' }, 1: null, 2: null, 3: null, 4: { subject: 'PAI', className: '2GLO' }, 5: { subject: 'PAI', className: '2GLO' }, 6: { subject: 'BA', className: '3GEN/3GLO' }, 7: null, 8: null, 9: { subject: 'PAI', className: '4GLO' }, 10: { subject: 'PAI', className: '4GLO' } },
      Khamis: { 0: { subject: 'TAS', className: '4GLO' }, 1: null, 2: null, 3: null, 4: { subject: 'PAI', className: '4GLO' }, 5: { subject: 'PAI', className: '4GLO' }, 6: null, 7: null, 8: null, 9: { subject: 'PAI', className: '2GLO' }, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'BA', className: '2GLO/2GEN' }, 3: null, 4: { subject: 'BA', className: '1GLO/1GEN' }, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 8. CIKGU FIONA SYAFIQAH ABDULLAH
  {
    id: 'T08',
    name: 'CIKGU FIONA SYAFIQAH ABDULLAH',
    initials: 'FS',
    majorSubjects: ['BI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: { subject: 'BI', className: '5GLO' }, 4: null, 5: null, 6: null, 7: null, 8: { subject: 'BI', className: '6GLO' }, 9: { subject: 'BI', className: '6GLO' }, 10: null },
      Selasa: { 0: null, 1: { subject: 'BI', className: '6GLO' }, 2: null, 3: { subject: 'BI', className: '6GEN' }, 4: { subject: 'BI', className: '6GEN' }, 5: null, 6: { subject: 'BI', className: '6GLO' }, 7: { subject: 'BI', className: '6GLO' }, 8: null, 9: { subject: 'BI', className: '5GLO' }, 10: { subject: 'BI', className: '5GLO' } },
      Rabu: { 0: null, 1: null, 2: null, 3: { subject: 'BI', className: '6GEN' }, 4: { subject: 'BI', className: '6GEN' }, 5: null, 6: null, 7: { subject: 'BI', className: '5GLO' }, 8: { subject: 'BI', className: '5GLO' }, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'BI', className: '6GLO' }, 3: null, 4: { subject: 'BI', className: '6GEN' }, 5: { subject: 'BI', className: '6GEN' }, 6: null, 7: { subject: 'BI', className: '5GLO' }, 8: null, 9: null, 10: null },
      Jumaat: { 0: null, 1: { subject: 'BI', className: '6GEN' }, 2: null, 3: { subject: 'BI', className: '6GLO' }, 4: { subject: 'BI', className: '6GLO' }, 5: null, 6: { subject: 'BI', className: '6GEN' }, 7: null, 8: { subject: 'BI', className: '5GLO' }, 9: null, 10: null },
    },
  },

  // 9. CIKGU GILLIAN LU CHOON YIENG
  {
    id: 'T09',
    name: 'CIKGU GILLIAN LU CHOON YIENG',
    initials: 'GL',
    majorSubjects: ['MT', 'MZ', 'RBT', 'PM'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'MT', className: '2GEN' }, 3: null, 4: { subject: 'RBT', className: '5GLO' }, 5: { subject: 'RBT', className: '5GLO' }, 6: { subject: 'MZ', className: '6GEN' }, 7: null, 8: null, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'MT', className: '4GLO' }, 5: { subject: 'MT', className: '4GLO' }, 6: { subject: 'MZ', className: '5GLO' }, 7: null, 8: { subject: 'MT', className: '2GEN' }, 9: { subject: 'MT', className: '2GEN' }, 10: null },
      Rabu: { 0: null, 1: null, 2: null, 3: { subject: 'MT', className: '4GLO' }, 4: { subject: 'MT', className: '4GLO' }, 5: { subject: 'MZ', className: '4GLO' }, 6: null, 7: { subject: 'MT', className: '2GEN' }, 8: { subject: 'PM', className: '3GLO/3GEN' }, 9: { subject: 'PM', className: '3GLO/3GEN' }, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'MT', className: '2GEN' }, 3: { subject: 'MZ', className: '5GEN' }, 4: null, 5: null, 6: { subject: 'MT', className: '4GLO' }, 7: null, 8: { subject: 'PM', className: '3GLO/3GEN' }, 9: { subject: 'PM', className: '3GLO/3GEN' }, 10: null },
      Jumaat: { 0: null, 1: { subject: 'MZ', className: '1GO' }, 2: null, 3: { subject: 'MT', className: '4GLO' }, 4: { subject: 'PM', className: '3GLO/3GEN' }, 5: null, 6: null, 7: null, 8: { subject: 'MZ', className: '4GEN' }, 9: null, 10: null },
    },
  },

  // 10. CIKGU HAMINAH BINTI HAJI HUI
  {
    id: 'T10',
    name: 'CIKGU HAMINAH BINTI HAJI HUI',
    initials: 'HH',
    majorSubjects: ['BM', 'PSV', 'SEJ'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'BM', className: '4GEN' }, 3: { subject: 'BM', className: '4GEN' }, 4: null, 5: { subject: 'BM', className: '3GEN' }, 6: null, 7: null, 8: null, 9: { subject: 'BM', className: '3GEN' }, 10: { subject: 'BM', className: '3GEN' } },
      Selasa: { 0: null, 1: null, 2: null, 3: { subject: 'BM', className: '3GEN' }, 4: { subject: 'BM', className: '3GEN' }, 5: null, 6: { subject: 'PSV', className: '2GLO' }, 7: { subject: 'PSV', className: '2GLO' }, 8: null, 9: { subject: 'BM', className: '4GEN' }, 10: { subject: 'BM', className: '4GEN' } },
      Rabu: { 0: null, 1: null, 2: null, 3: { subject: 'BM', className: '3GEN' }, 4: null, 5: null, 6: null, 7: { subject: 'BM', className: '4GEN' }, 8: { subject: 'BM', className: '4GEN' }, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'BM', className: '3GEN' }, 3: null, 4: null, 5: null, 6: { subject: 'PSV', className: '3GEN' }, 7: { subject: 'PSV', className: '3GEN' }, 8: null, 9: { subject: 'SEJ', className: '4GEN' }, 10: { subject: 'SEJ', className: '4GEN' } },
      Jumaat: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BM', className: '4GEN' }, 5: null, 6: null, 7: { subject: 'BM', className: '3GEN' }, 8: { subject: 'BM', className: '3GEN' }, 9: null, 10: null },
    },
  },

  // 11. CIKGU HERAWATI BIN HARDI
  {
    id: 'T11',
    name: 'CIKGU HERAWATI BIN HARDI',
    initials: 'HH2',
    majorSubjects: ['SN'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'SN', className: '1GLO' }, 3: { subject: 'SN', className: '1GLO' }, 4: null, 5: { subject: 'SN', className: '2GEN' }, 6: null, 7: { subject: 'SN', className: '3GEN' }, 8: { subject: 'SN', className: '3GEN' }, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: { subject: 'SN', className: '6GEN' }, 3: { subject: 'SN', className: '6GEN' }, 4: null, 5: null, 6: { subject: 'SN', className: '3GLO' }, 7: { subject: 'SN', className: '3GLO' }, 8: null, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'SN', className: '5GLO' }, 3: { subject: 'SN', className: '5GLO' }, 4: null, 5: null, 6: { subject: 'SN', className: '1GLO' }, 7: null, 8: { subject: 'SN', className: '2GLO' }, 9: { subject: 'SN', className: '2GLO' }, 10: null },
      Khamis: { 0: null, 1: null, 2: null, 3: { subject: 'SN', className: '6GEN' }, 4: null, 5: { subject: 'SN', className: '3GEN' }, 6: { subject: 'SN', className: '2GLO' }, 7: null, 8: { subject: 'SN', className: '5GLO' }, 9: { subject: 'SN', className: '5GLO' }, 10: null },
      Jumaat: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'SN', className: '2GEN' }, 5: null, 6: { subject: 'SN', className: '3GLO' }, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 12. CIKGU ISWANDI BIN MAIJI
  {
    id: 'T12',
    name: 'CIKGU ISWANDI BIN MAIJI',
    initials: 'IM',
    majorSubjects: ['SEJ', 'PK', 'BM', 'PJ', 'RBT'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: { subject: 'SEJ', className: '4GLO' }, 5: { subject: 'SEJ', className: '4GLO' }, 6: { subject: 'PK', className: '4GLO' }, 7: null, 8: null, 9: { subject: 'BM', className: '3GLO' }, 10: { subject: 'BM', className: '3GLO' } },
      Selasa: { 0: null, 1: { subject: 'PJ', className: '2GEN' }, 2: { subject: 'PJ', className: '2GLO' }, 3: { subject: 'PJ', className: '4GLO' }, 4: null, 5: { subject: 'PJ', className: '1GLO' }, 6: null, 7: null, 8: { subject: 'BM', className: '3GLO' }, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'BM', className: '3GLO' }, 3: { subject: 'PK', className: '1GLO' }, 4: null, 5: { subject: 'BM', className: '3GLO' }, 6: { subject: 'PK', className: '2GLO' }, 7: null, 8: null, 9: { subject: 'SEJ', className: '5GLO' }, 10: { subject: 'SEJ', className: '5GLO' } },
      Khamis: { 0: null, 1: { subject: 'PJ', className: '4GLO' }, 2: null, 3: { subject: 'PJ', className: '1GLO' }, 4: null, 5: { subject: 'PJ', className: '2GEN' }, 6: { subject: 'BM', className: '3GLO' }, 7: { subject: 'BM', className: '3GLO' }, 8: null, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'BM', className: '3GLO' }, 3: { subject: 'PK', className: '2GEN' }, 4: null, 5: { subject: 'PJ', className: '2GLO' }, 6: { subject: 'RBT', className: '4GEN' }, 7: { subject: 'RBT', className: '4GEN' }, 8: null, 9: null, 10: null },
    },
  },

  // 13. CIKGU IZZATUL HUSNA BINTI KAMARUZ ZAMAN
  {
    id: 'T13',
    name: 'CIKGU IZZATUL HUSNA BINTI KAMARUZ ZAMAN',
    initials: 'IH',
    majorSubjects: ['TAS', 'PAI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: { subject: 'TAS', className: '2GEN' }, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: { subject: 'PAI', className: '1GEN' }, 4: { subject: 'PAI', className: '1GEN' }, 5: null, 6: null, 7: null, 8: null, 9: { subject: 'PAI', className: '2GEN' }, 10: { subject: 'PAI', className: '2GEN' } },
      Selasa: { 0: { subject: 'TAS', className: '2GEN' }, 1: { subject: 'PAI', className: '1GEN' }, 2: { subject: 'PAI', className: '1GEN' }, 3: null, 4: null, 5: null, 6: null, 7: { subject: 'PAI', className: '4GEN' }, 8: { subject: 'PAI', className: '4GEN' }, 9: { subject: 'PAI', className: '6GEN' }, 10: null },
      Rabu: { 0: { subject: 'TAS', className: '4GEN' }, 1: null, 2: null, 3: null, 4: { subject: 'PAI', className: '2GEN' }, 5: { subject: 'PAI', className: '2GEN' }, 6: null, 7: null, 8: { subject: 'PAI', className: '3GEN' }, 9: { subject: 'PAI', className: '4GEN' }, 10: { subject: 'PAI', className: '4GEN' } },
      Khamis: { 0: { subject: 'TAS', className: '4GEN' }, 1: null, 2: { subject: 'PAI', className: '1GEN' }, 3: null, 4: { subject: 'PAI', className: '4GEN' }, 5: { subject: 'PAI', className: '4GEN' }, 6: null, 7: null, 8: { subject: 'PAI', className: '2GEN' }, 9: { subject: 'PAI', className: '2GEN' }, 10: null },
      Jumaat: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'PAI', className: '3GEN' }, 5: { subject: 'PAI', className: '3GEN' }, 6: null, 7: { subject: 'PAI', className: '6GEN' }, 8: { subject: 'PAI', className: '6GEN' }, 9: null, 10: null },
    },
  },

  // 14. CIKGU KHAIRUL IKHWAN BIN KHIRULSALLEH
  {
    id: 'T14',
    name: 'CIKGU KHAIRUL IKHWAN BIN KHIRULSALLEH',
    initials: 'KI',
    majorSubjects: ['TAS', 'BA', 'PAI', 'PJ', 'RBT', 'PK'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: { subject: 'TAS', className: '1GEN' }, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: { subject: 'BA', className: '6GLO/6GEN' }, 5: null, 6: null, 7: null, 8: null, 9: { subject: 'PAI', className: '5GEN' }, 10: { subject: 'PAI', className: '5GEN' } },
      Selasa: { 0: { subject: 'TAS', className: '1GEN' }, 1: null, 2: null, 3: null, 4: null, 5: { subject: 'BA', className: '5GLO/5GEN' }, 6: null, 7: null, 8: { subject: 'BA', className: '6GLO/6GEN' }, 9: { subject: 'PAI', className: '6GLO' }, 10: { subject: 'PAI', className: '6GLO' } },
      Rabu: { 0: { subject: 'TAS', className: '6GEN' }, 1: null, 2: { subject: 'PAI', className: '6GLO' }, 3: { subject: 'PJ', className: '4GEN' }, 4: { subject: 'RBT', className: '6GLO' }, 5: { subject: 'RBT', className: '6GLO' }, 6: null, 7: null, 8: { subject: 'PAI', className: '3GEN' }, 9: { subject: 'PAI', className: '3GEN' }, 10: null },
      Khamis: { 0: { subject: 'TAS', className: '6GEN' }, 1: null, 2: { subject: 'PK', className: '4GEN' }, 3: null, 4: { subject: 'BA', className: '5GLO/5GEN' }, 5: { subject: 'BA', className: '5GLO/5GEN' }, 6: null, 7: null, 8: { subject: 'PAI', className: '3GEN' }, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'PAI', className: '5GEN' }, 3: { subject: 'PJ', className: '4GEN' }, 4: { subject: 'PAI', className: '3GEN' }, 5: { subject: 'PAI', className: '3GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 15. CIKGU LING HENG SING
  {
    id: 'T15',
    name: 'CIKGU LING HENG SING',
    initials: 'LHS',
    majorSubjects: ['MT', 'MZ', 'PSV'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'MT', className: '3GEN' }, 3: null, 4: { subject: 'MT', className: '2GLO' }, 5: { subject: 'MT', className: '2GLO' }, 6: { subject: 'MZ', className: '3GLO' }, 7: null, 8: null, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: { subject: 'MT', className: '6GLO' }, 3: { subject: 'MT', className: '6GLO' }, 4: null, 5: { subject: 'MT', className: '2GLO' }, 6: null, 7: { subject: 'MT', className: '3GEN' }, 8: { subject: 'MT', className: '3GEN' }, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'MT', className: '2GLO' }, 3: null, 4: null, 5: { subject: 'MT', className: '3GEN' }, 6: null, 7: { subject: 'MT', className: '6GLO' }, 8: { subject: 'MT', className: '6GLO' }, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: null, 3: { subject: 'MT', className: '2GLO' }, 4: null, 5: { subject: 'MT', className: '6GLO' }, 6: null, 7: null, 8: { subject: 'PSV', className: '1GLO' }, 9: { subject: 'PSV', className: '1GLO' }, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'MT', className: '3GEN' }, 3: null, 4: null, 5: { subject: 'MT', className: '6GLO' }, 6: { subject: 'MT', className: '6GLO' }, 7: { subject: 'PSV', className: '3GLO' }, 8: { subject: 'PSV', className: '3GLO' }, 9: null, 10: null },
    },
  },

  // 16. CIKGU MATHIEW ALEC ANAK AHONG
  {
    id: 'T16',
    name: 'CIKGU MATHIEW ALEC ANAK AHONG',
    initials: 'MA',
    majorSubjects: ['PK', 'SN', 'PJ', 'MZ'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'PK', className: '3GLO' }, 3: null, 4: { subject: 'SN', className: '4GEN' }, 5: { subject: 'SN', className: '4GEN' }, 6: null, 7: { subject: 'SN', className: '4GLO' }, 8: { subject: 'SN', className: '4GLO' }, 9: null, 10: { subject: 'PK', className: '6GLO' } },
      Selasa: { 0: null, 1: null, 2: { subject: 'SN', className: '4GEN' }, 3: { subject: 'PJ', className: '3GLO' }, 4: null, 5: { subject: 'PJ', className: '6GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
      Rabu: { 0: null, 1: { subject: 'MZ', className: '2GLO' }, 2: { subject: 'MZ', className: '2GLO' }, 3: { subject: 'PJ', className: '6GLO' }, 4: null, 5: { subject: 'PK', className: '6GEN' }, 6: { subject: 'MZ', className: '2GEN' }, 7: null, 8: { subject: 'SN', className: '6GLO' }, 9: null, 10: { subject: 'MZ', className: '6GLO' } },
      Khamis: { 0: null, 1: { subject: 'PJ', className: '6GEN' }, 2: null, 3: { subject: 'SN', className: '6GLO' }, 4: { subject: 'SN', className: '6GLO' }, 5: { subject: 'PJ', className: '3GLO' }, 6: null, 7: null, 8: null, 9: { subject: 'SN', className: '5GEN' }, 10: { subject: 'SN', className: '5GEN' } },
      Jumaat: { 0: null, 1: null, 2: null, 3: { subject: 'PJ', className: '6GLO' }, 4: { subject: 'SN', className: '4GLO' }, 5: { subject: 'SN', className: '4GLO' }, 6: null, 7: { subject: 'SN', className: '5GEN' }, 8: null, 9: null, 10: null },
    },
  },

  // 17. CIKGU SHARIFAH ABYAN NADZIRAH BINTI WAN YUSOF
  {
    id: 'T17',
    name: 'CIKGU SHARIFAH ABYAN NADZIRAH BINTI WAN YUSOF',
    initials: 'SAN',
    majorSubjects: ['BM', 'SEJ'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: { subject: 'BM', className: '2GEN' }, 4: { subject: 'BM', className: '2GEN' }, 5: null, 6: { subject: 'SEJ', className: '6GLO' }, 7: { subject: 'SEJ', className: '6GLO' }, 8: null, 9: { subject: 'BM', className: '1GEN' }, 10: { subject: 'BM', className: '1GEN' } },
      Selasa: { 0: null, 1: null, 2: { subject: 'BM', className: '2GEN' }, 3: { subject: 'BM', className: '2GEN' }, 4: null, 5: null, 6: null, 7: { subject: 'BM', className: '1GEN' }, 8: { subject: 'BM', className: '1GEN' }, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'BM', className: '1GEN' }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: { subject: 'BM', className: '2GEN' }, 9: { subject: 'BM', className: '2GEN' }, 10: null },
      Khamis: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BM', className: '2GEN' }, 5: null, 6: { subject: 'BM', className: '1GEN' }, 7: { subject: 'BM', className: '1GEN' }, 8: null, 9: { subject: 'SEJ', className: '6GEN' }, 10: { subject: 'SEJ', className: '6GEN' } },
      Jumaat: { 0: null, 1: null, 2: null, 3: { subject: 'BM', className: '1GEN' }, 4: null, 5: null, 6: { subject: 'BM', className: '2GEN' }, 7: { subject: 'BM', className: '2GEN' }, 8: null, 9: null, 10: null },
    },
  },

  // 18. USTAZAH NURUL NASIHAH BINTI MOHD ASRI
  {
    id: 'T18',
    name: 'USTAZAH NURUL NASIHAH BINTI MOHD ASRI',
    initials: 'NN',
    majorSubjects: ['TAS', 'SEJ', 'PAI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: { subject: 'TAS', className: '1GLO' }, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: null, 5: null, 6: { subject: 'SEJ', className: '5GEN' }, 7: { subject: 'SEJ', className: '5GEN' }, 8: null, 9: { subject: 'PAI', className: '5GEN' }, 10: { subject: 'PAI', className: '5GEN' } },
      Selasa: { 0: { subject: 'TAS', className: '1GLO' }, 1: null, 2: { subject: 'PAI', className: '1GLO' }, 3: null, 4: { subject: 'PAI', className: '5GEN' }, 5: null, 6: null, 7: null, 8: { subject: 'PAI', className: '6GEN' }, 9: { subject: 'PAI', className: '6GEN' }, 10: null },
      Rabu: { 0: { subject: 'TAS', className: '5GEN' }, 1: null, 2: { subject: 'PAI', className: '6GEN' }, 3: null, 4: null, 5: null, 6: null, 7: null, 8: { subject: 'PAI', className: '3GLO' }, 9: { subject: 'PAI', className: '3GLO' }, 10: { subject: 'PAI', className: '4GLO' } },
      Khamis: { 0: { subject: 'TAS', className: '5GEN' }, 1: { subject: 'PAI', className: '1GLO' }, 2: { subject: 'PAI', className: '1GLO' }, 3: null, 4: { subject: 'PAI', className: '4GLO' }, 5: { subject: 'PAI', className: '4GLO' }, 6: null, 7: null, 8: { subject: 'PAI', className: '3GLO' }, 9: null, 10: null },
      Jumaat: { 0: null, 1: { subject: 'PAI', className: '5GEN' }, 2: { subject: 'PAI', className: '5GEN' }, 3: null, 4: { subject: 'PAI', className: '3GLO' }, 5: { subject: 'PAI', className: '3GLO' }, 6: null, 7: { subject: 'PAI', className: '6GEN' }, 8: { subject: 'PAI', className: '6GEN' }, 9: null, 10: null },
    },
  },

  // 19. CIKGU NOOR AIDA ABDULLAH
  {
    id: 'T19',
    name: 'CIKGU NOOR AIDA ABDULLAH',
    initials: 'NA',
    majorSubjects: ['BI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: { subject: 'BI', className: '3GEN' }, 4: { subject: 'BI', className: '3GEN' }, 5: null, 6: null, 7: { subject: 'BI', className: '1GEN' }, 8: null, 9: { subject: 'BI', className: '1GLO' }, 10: { subject: 'BI', className: '1GLO' } },
      Selasa: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BI', className: '1GEN' }, 5: { subject: 'BI', className: '1GEN' }, 6: null, 7: { subject: 'BI', className: '1GLO' }, 8: { subject: 'BI', className: '3GEN' }, 9: { subject: 'BI', className: '3GEN' }, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'BI', className: '3GEN' }, 3: null, 4: { subject: 'BI', className: '1GEN' }, 5: null, 6: null, 7: { subject: 'BI', className: '3GEN' }, 8: { subject: 'BI', className: '1GLO' }, 9: { subject: 'BI', className: '1GLO' }, 10: null },
      Khamis: { 0: null, 1: null, 2: null, 3: { subject: 'BI', className: '3GEN' }, 4: { subject: 'BI', className: '3GEN' }, 5: null, 6: { subject: 'BI', className: '1GLO' }, 7: { subject: 'BI', className: '1GLO' }, 8: null, 9: null, 10: null },
      Jumaat: { 0: null, 1: { subject: 'BI', className: '1GEN' }, 2: { subject: 'BI', className: '1GLO' }, 3: null, 4: null, 5: null, 6: null, 7: { subject: 'BI', className: '1GEN' }, 8: null, 9: null, 10: null },
    },
  },

  // 20. CIKGU NOORITA BINTI ALWI
  {
    id: 'T20',
    name: 'CIKGU NOORITA BINTI ALWI',
    initials: 'NW',
    majorSubjects: ['BM', 'PM'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: { subject: 'BM', className: '2GLO' }, 4: null, 5: null, 6: null, 7: { subject: 'BM', className: '1GLO' }, 8: null, 9: { subject: 'PM', className: '2GLO/2GEN' }, 10: { subject: 'PM', className: '2GLO/2GEN' } },
      Selasa: { 0: null, 1: { subject: 'BM', className: '2GLO' }, 2: null, 3: { subject: 'BM', className: '2GLO' }, 4: { subject: 'BM', className: '2GLO' }, 5: null, 6: { subject: 'BM', className: '1GLO' }, 7: null, 8: { subject: 'BM', className: '1GLO' }, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'BM', className: '1GLO' }, 3: null, 4: { subject: 'PM', className: '2GLO/2GEN' }, 5: { subject: 'PM', className: '2GLO/2GEN' }, 6: null, 7: { subject: 'BM', className: '2GLO' }, 8: { subject: 'BM', className: '2GLO' }, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'BM', className: '2GLO' }, 3: null, 4: { subject: 'BM', className: '1GLO' }, 5: { subject: 'BM', className: '1GLO' }, 6: null, 7: null, 8: { subject: 'PM', className: '2GLO/2GEN' }, 9: { subject: 'PM', className: '2GLO/2GEN' }, 10: null },
      Jumaat: { 0: null, 1: null, 2: null, 3: { subject: 'BM', className: '2GLO' }, 4: { subject: 'BM', className: '2GLO' }, 5: null, 6: null, 7: { subject: 'BM', className: '1GLO' }, 8: null, 9: null, 10: null },
    },
  },

  // 21. CIKGU NURMAISARAH AMANI BINTI AZIZAN
  {
    id: 'T21',
    name: 'CIKGU NURMAISARAH AMANI BINTI AZIZAN',
    initials: 'NA2',
    majorSubjects: ['TAS', 'PAI', 'MZ'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: { subject: 'TAS', className: '2GLO' }, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: { subject: 'PAI', className: '1GLO' }, 5: null, 6: null, 7: null, 8: null, 9: { subject: 'PAI', className: '2GLO' }, 10: null },
      Selasa: { 0: { subject: 'TAS', className: '2GLO' }, 1: { subject: 'PAI', className: '1GLO' }, 2: { subject: 'PAI', className: '1GLO' }, 3: null, 4: { subject: 'PAI', className: '5GLO' }, 5: null, 6: null, 7: null, 8: { subject: 'PAI', className: '4GEN' }, 9: null, 10: null },
      Rabu: { 0: { subject: 'TAS', className: '6GLO' }, 1: null, 2: null, 3: null, 4: { subject: 'PAI', className: '2GLO' }, 5: { subject: 'PAI', className: '2GLO' }, 6: null, 7: null, 8: { subject: 'PAI', className: '3GLO' }, 9: { subject: 'PAI', className: '3GLO' }, 10: null },
      Khamis: { 0: { subject: 'TAS', className: '6GLO' }, 1: { subject: 'PAI', className: '1GLO' }, 2: { subject: 'PAI', className: '1GLO' }, 3: null, 4: { subject: 'PAI', className: '4GEN' }, 5: { subject: 'PAI', className: '4GEN' }, 6: null, 7: null, 8: { subject: 'PAI', className: '2GLO' }, 9: { subject: 'PAI', className: '2GLO' }, 10: null },
      Jumaat: { 0: null, 1: { subject: 'PAI', className: '5GLO' }, 2: { subject: 'PAI', className: '5GLO' }, 3: null, 4: null, 5: { subject: 'PAI', className: '3GLO' }, 6: { subject: 'MZ', className: '3GEN' }, 7: null, 8: null, 9: null, 10: null },
    },
  },

  // 22. CIKGU ROHANI BINTI HARUM
  {
    id: 'T22',
    name: 'CIKGU ROHANI BINTI HARUM',
    initials: 'RH',
    majorSubjects: ['TAS', 'PAI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: { subject: 'TAS', className: '3GLO' }, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: { subject: 'PAI', className: '1GEN' }, 4: { subject: 'PAI', className: '1GEN' }, 5: null, 6: null, 7: null, 8: null, 9: { subject: 'PAI', className: '5GLO' }, 10: { subject: 'PAI', className: '5GLO' } },
      Selasa: { 0: { subject: 'TAS', className: '3GLO' }, 1: { subject: 'PAI', className: '1GEN' }, 2: null, 3: { subject: 'PAI', className: '5GLO' }, 4: { subject: 'PAI', className: '5GLO' }, 5: null, 6: null, 7: null, 8: { subject: 'PAI', className: '6GLO' }, 9: { subject: 'PAI', className: '6GLO' }, 10: null },
      Rabu: { 0: { subject: 'TAS', className: '5GLO' }, 1: { subject: 'PAI', className: '6GLO' }, 2: { subject: 'PAI', className: '6GLO' }, 3: null, 4: null, 5: { subject: 'PAI', className: '2GEN' }, 6: null, 7: null, 8: null, 9: null, 10: null },
      Khamis: { 0: { subject: 'TAS', className: '5GLO' }, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: { subject: 'PAI', className: '2GEN' }, 9: { subject: 'PAI', className: '2GEN' }, 10: null },
      Jumaat: { 0: null, 1: { subject: 'PAI', className: '5GLO' }, 2: { subject: 'PAI', className: '5GLO' }, 3: null, 4: null, 5: null, 6: null, 7: { subject: 'PAI', className: '6GLO' }, 8: null, 9: null, 10: null },
    },
  },

  // 23. CIKGU ROHANI BINTI UPI
  {
    id: 'T23',
    name: 'CIKGU ROHANI BINTI UPI',
    initials: 'RU',
    majorSubjects: ['MT', 'PSV'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'MT', className: '5GEN' }, 3: { subject: 'MT', className: '5GEN' }, 4: null, 5: { subject: 'MT', className: '1GLO' }, 6: null, 7: { subject: 'MT', className: '3GLO' }, 8: { subject: 'MT', className: '3GLO' }, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: null, 3: { subject: 'MT', className: '1GLO' }, 4: { subject: 'MT', className: '1GLO' }, 5: null, 6: { subject: 'MT', className: '6GEN' }, 7: { subject: 'MT', className: '6GEN' }, 8: null, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: { subject: 'MT', className: '5GEN' }, 3: null, 4: { subject: 'MT', className: '1GLO' }, 5: null, 6: null, 7: { subject: 'MT', className: '3GLO' }, 8: { subject: 'MT', className: '6GEN' }, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: null, 3: { subject: 'MT', className: '3GLO' }, 4: null, 5: null, 6: { subject: 'MT', className: '5GEN' }, 7: null, 8: { subject: 'MT', className: '6GEN' }, 9: { subject: 'PSV', className: '6GLO' }, 10: { subject: 'PSV', className: '6GLO' } },
      Jumaat: { 0: null, 1: null, 2: null, 3: { subject: 'MT', className: '3GLO' }, 4: null, 5: { subject: 'MT', className: '6GEN' }, 6: { subject: 'MT', className: '5GEN' }, 7: null, 8: { subject: 'MT', className: '1GLO' }, 9: null, 10: null },
    },
  },

  // 24. CIKGU SEMAIAH BINTI AHMAT
  {
    id: 'T24',
    name: 'CIKGU SEMAIAH BINTI AHMAT',
    initials: 'SA',
    majorSubjects: ['BM', 'PSV'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: { subject: 'BM', className: '6GEN' }, 3: { subject: 'BM', className: '6GEN' }, 4: null, 5: null, 6: { subject: 'BM', className: '5GLO' }, 7: { subject: 'BM', className: '5GLO' }, 8: null, 9: { subject: 'PSV', className: '6GEN' }, 10: { subject: 'PSV', className: '6GEN' } },
      Selasa: { 0: null, 1: null, 2: { subject: 'BM', className: '5GLO' }, 3: null, 4: null, 5: null, 6: { subject: 'PSV', className: '2GEN' }, 7: { subject: 'PSV', className: '2GEN' }, 8: null, 9: { subject: 'PSV', className: '4GLO' }, 10: { subject: 'PSV', className: '4GLO' } },
      Rabu: { 0: null, 1: null, 2: null, 3: { subject: 'BM', className: '5GLO' }, 4: { subject: 'BM', className: '5GLO' }, 5: null, 6: { subject: 'BM', className: '6GEN' }, 7: { subject: 'BM', className: '6GEN' }, 8: null, 9: { subject: 'BM', className: '6GEN' }, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'BM', className: '5GLO' }, 3: { subject: 'BM', className: '5GLO' }, 4: null, 5: null, 6: { subject: 'BM', className: '6GEN' }, 7: { subject: 'BM', className: '6GEN' }, 8: null, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BM', className: '6GEN' }, 5: null, 6: { subject: 'PSV', className: '5GLO' }, 7: { subject: 'PSV', className: '5GLO' }, 8: null, 9: null, 10: null },
    },
  },

  // 25. CIKGU TING TUNG HOOK
  {
    id: 'T25',
    name: 'CIKGU TING TUNG HOOK',
    initials: 'TTH',
    majorSubjects: ['BC', 'PM', 'RBT'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: { subject: 'BC', className: '6GLO/6GEN' }, 5: null, 6: { subject: 'BC', className: '2GEN/2GLO' }, 7: null, 8: { subject: 'BC', className: '1GLO/1GEN' }, 9: { subject: 'BC', className: '4GLO/4GEN' }, 10: null },
      Selasa: { 0: null, 1: null, 2: { subject: 'BC', className: '3GLO/3GEN' }, 3: null, 4: { subject: 'BC', className: '5GEN/5GLO' }, 5: null, 6: { subject: 'BC', className: '4GEN/4GLO' }, 7: null, 8: { subject: 'BC', className: '6GEN/6GLO' }, 9: { subject: 'PM', className: '6GLO/6GEN' }, 10: { subject: 'PM', className: '6GLO/6GEN' } },
      Rabu: { 0: null, 1: { subject: 'PM', className: '6GLO/6GEN' }, 2: { subject: 'PM', className: '6GLO/6GEN' }, 3: null, 4: null, 5: null, 6: { subject: 'BC', className: '3GEN/3GLO' }, 7: null, 8: null, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: null, 3: null, 4: { subject: 'BC', className: '5GLO/5GEN' }, 5: null, 6: null, 7: { subject: 'RBT', className: '4GLO' }, 8: { subject: 'RBT', className: '4GLO' }, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: { subject: 'BC', className: '2GLO/2GEN' }, 3: null, 4: { subject: 'BC', className: '1GLO/1GEN' }, 5: null, 6: null, 7: { subject: 'PM', className: '6GLO/6GEN' }, 8: null, 9: null, 10: null },
    },
  },

  // 26. CIKGU WINNY ANAK GEORGE SANTANG
  {
    id: 'T26',
    name: 'CIKGU WINNY ANAK GEORGE SANTANG',
    initials: 'WG',
    majorSubjects: ['BI'],
    schedule: {
      ...emptySchedule(),
      Isnin: { 0: null, 1: { subject: 'HIM', className: 'SEMUA' }, 2: null, 3: null, 4: { subject: 'BI', className: '3GLO' }, 5: null, 6: null, 7: { subject: 'BI', className: '2GLO' }, 8: { subject: 'BI', className: '2GLO' }, 9: null, 10: null },
      Selasa: { 0: null, 1: null, 2: { subject: 'BI', className: '5GEN' }, 3: null, 4: { subject: 'BI', className: '3GLO' }, 5: null, 6: null, 7: { subject: 'BI', className: '2GLO' }, 8: { subject: 'BI', className: '2GLO' }, 9: null, 10: null },
      Rabu: { 0: null, 1: null, 2: null, 3: { subject: 'BI', className: '3GLO' }, 4: null, 5: null, 6: null, 7: { subject: 'BI', className: '5GEN' }, 8: null, 9: null, 10: null },
      Khamis: { 0: null, 1: null, 2: { subject: 'BI', className: '3GLO' }, 3: null, 4: { subject: 'BI', className: '2GLO' }, 5: null, 6: null, 7: { subject: 'BI', className: '5GEN' }, 8: null, 9: null, 10: null },
      Jumaat: { 0: null, 1: null, 2: null, 3: { subject: 'BI', className: '5GEN' }, 4: null, 5: null, 6: null, 7: { subject: 'BI', className: '2GLO' }, 8: null, 9: null, 10: null },
    },
  },
];
