import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Calendar,
  Layers,
  Award,
  TrendingUp,
} from 'lucide-react';
import { ReliefAssignment, ReliefDayRecord } from '../types';

interface StatisticalAnalysisModuleProps {
  todayAssignments: ReliefAssignment[];
  historyRecords: ReliefDayRecord[];
  currentMonth: string;
}

// Attractive vibrant palette for chart bars
const SUBJECT_COLORS = [
  '#2563eb', // Blue
  '#0d9488', // Teal
  '#7c3aed', // Violet
  '#ea580c', // Orange
  '#db2777', // Pink
  '#16a34a', // Green
  '#d97706', // Amber
  '#0284c7', // Sky
  '#4f46e5', // Indigo
  '#e11d48', // Rose
  '#059669', // Emerald
  '#6366f1', // Purple
];

const CLASS_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#f97316',
  '#14b8a6',
  '#84cc16',
  '#a855f7',
  '#64748b',
];

export const StatisticalAnalysisModule: React.FC<StatisticalAnalysisModuleProps> = ({
  todayAssignments,
  historyRecords,
  currentMonth,
}) => {
  const [metricMode, setMetricMode] = useState<'subject' | 'class'>('subject');
  const [timeframe, setTimeframe] = useState<'today' | 'month' | 'all'>('month');

  // Aggregate assignments based on selected timeframe
  const aggregatedAssignments = useMemo(() => {
    let list: ReliefAssignment[] = [];

    if (timeframe === 'today') {
      list = [...todayAssignments];
    } else if (timeframe === 'month') {
      // History in current month
      historyRecords.forEach((rec) => {
        if (rec.date.startsWith(currentMonth)) {
          list.push(...rec.assignments);
        }
      });
      // Plus today's active assignments if today is in current month
      list.push(...todayAssignments);
    } else {
      // All time
      historyRecords.forEach((rec) => {
        list.push(...rec.assignments);
      });
      list.push(...todayAssignments);
    }

    return list;
  }, [todayAssignments, historyRecords, currentMonth, timeframe]);

  // Aggregate by Subject
  const subjectChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    aggregatedAssignments.forEach((asg) => {
      if (!asg.subject) return;
      const sub = asg.subject.trim();
      counts[sub] = (counts[sub] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [aggregatedAssignments]);

  // Aggregate by Class
  const classChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    aggregatedAssignments.forEach((asg) => {
      if (!asg.className) return;
      const cls = asg.className.trim();
      counts[cls] = (counts[cls] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [aggregatedAssignments]);

  const activeData = metricMode === 'subject' ? subjectChartData : classChartData;
  const activeColors = metricMode === 'subject' ? SUBJECT_COLORS : CLASS_COLORS;

  const totalSessions = aggregatedAssignments.length;
  const topSubject = subjectChartData[0]?.name || '-';
  const topSubjectCount = subjectChartData[0]?.count || 0;
  const topClass = classChartData[0]?.name || '-';
  const topClassCount = classChartData[0]?.count || 0;

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = totalSessions > 0 ? ((value / totalSessions) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1">
          <p className="font-extrabold text-amber-300 text-sm">
            {metricMode === 'subject' ? `Subjek: ${label}` : `Kelas: ${label}`}
          </p>
          <p className="text-slate-200">
            Jumlah Waktu Ganti: <strong className="text-white">{value} waktu</strong>
          </p>
          <p className="text-slate-400 text-[11px]">
            Sumbangan MMI: <strong>{percentage}%</strong> daripada jumlah keseluruhan
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Modul Analisis Statistik MMI</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Visualisasi Data Guru Ganti</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              Recharts Data Visualizer
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Carta taburan kekerapan waktu ganti mengikut mata pelajaran atau kelas bagi pemantauan Melindungi Masa Instruksional.
          </p>
        </div>

        {/* Controls: Timeframe & Metric Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'today'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'month'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulan Ini ({currentMonth})
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'all'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Keseluruhan Rekod
            </button>
          </div>

          {/* Metric mode toggle: Subjek vs Kelas */}
          <div className="flex items-center bg-blue-50 p-1 rounded-xl text-xs font-bold border border-blue-200">
            <button
              onClick={() => setMetricMode('subject')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                metricMode === 'subject'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mengikut Subjek</span>
            </button>
            <button
              onClick={() => setMetricMode('class')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                metricMode === 'class'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Mengikut Kelas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mini KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-slate-500 font-semibold block">Jumlah Waktu Ganti Dilindungi</span>
            <span className="text-xl font-black text-slate-900">{totalSessions} Waktu</span>
          </div>
          <span className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
            <Layers className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-slate-500 font-semibold block">Subjek Paling Kerap Diganti</span>
            <span className="text-xl font-black text-blue-700">
              {topSubject}{' '}
              {topSubjectCount > 0 && (
                <span className="text-xs font-semibold text-slate-500">({topSubjectCount} waktu)</span>
              )}
            </span>
          </div>
          <span className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
            <Award className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-slate-500 font-semibold block">Kelas Paling Kerap Terlibat</span>
            <span className="text-xl font-black text-indigo-700">
              {topClass}{' '}
              {topClassCount > 0 && (
                <span className="text-xs font-semibold text-slate-500">({topClassCount} waktu)</span>
              )}
            </span>
          </div>
          <span className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
            <TrendingUp className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Recharts Bar Chart Area */}
      <div className="w-full pt-2">
        {activeData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Tiada Data Waktu Ganti Untuk Tempoh Ini</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Sila jana jadual guru ganti atau pilih tempoh &quot;Bulan Ini&quot; / &quot;Keseluruhan Rekod&quot; untuk melihat carta statistik.
            </p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeData}
                margin={{
                  top: 20,
                  right: 25,
                  left: 0,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{
                    value: 'Jumlah Waktu (Sesi)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#64748b',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {activeData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={activeColors[index % activeColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart Footer Legend / Insights */}
      {activeData.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">
              {metricMode === 'subject' ? 'Subjek Terlibat:' : 'Kelas Terlibat:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeData.slice(0, 8).map((item, idx) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: activeColors[idx % activeColors.length] }}
                  />
                  {item.name} ({item.count})
                </span>
              ))}
              {activeData.length > 8 && (
                <span className="text-slate-400 font-medium">+{activeData.length - 8} lagi</span>
              )}
            </div>
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            * Data MMI diselaraskan mengikut Jadual SK St Patrick Mukah
          </div>
        </div>
      )}
    </div>
  );
};
