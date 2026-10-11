import React from 'react';
import {
  CalendarDays,
  Sparkles,
  Download,
  Bell,
  History,
  Grid3X3,
  BookOpen,
} from 'lucide-react';

import { SchoolLogo } from './logos/SchoolLogo';

interface NavbarProps {
  activeTab: 'dashboard' | 'generator' | 'print' | 'notifications' | 'history' | 'timetable';
  setActiveTab: (tab: 'dashboard' | 'generator' | 'print' | 'notifications' | 'history' | 'timetable') => void;
  pendingNotificationsCount: number;
  todayAssignmentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingNotificationsCount,
  todayAssignmentsCount,
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 print:hidden">
      {/* Top bar with school identity */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              STP
            </span>
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="font-semibold text-white">SK ST PATRICK, MUKAH</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Pindaan 1 (2026)</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">PPD Mukah, Sarawak</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
              <BookOpen className="w-3 h-3 text-blue-400" />
              Sistem MMI (Melindungi Masa Instruksional)
            </span>
            <span>26 Orang Guru Aktif</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label
            htmlFor="navbar-logo-upload"
            className="w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity relative group"
            title="Klik untuk muat naik atau tukar fail Logo SPS asal (contoh: LOGO SPS 2024 (line luar).png)"
          >
            <SchoolLogo className="w-10 h-10 drop-shadow-sm" />
            <input
              id="navbar-logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const result = event.target?.result as string;
                    try {
                      localStorage.setItem('sk_st_patrick_logo_sps', result);
                      window.dispatchEvent(new Event('sps_logo_updated'));
                    } catch {
                      // ignore
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              e-GuruGanti
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                TS25 MMI
              </span>
            </h1>
            <p className="text-xs text-slate-400">Jadual Guru Ganti • SK St Patrick, Mukah</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Papan Pemuka</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Jana Jadual Ganti</span>
            {todayAssignmentsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-amber-400 text-slate-950">
                {todayAssignmentsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'print'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Simpan PDF & Slip</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifikasi</span>
            {pendingNotificationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-rose-500 text-white animate-pulse">
                {pendingNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Rekod Sejarah</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'timetable'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Jadual Guru (26)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
