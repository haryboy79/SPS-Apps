import React, { useState } from 'react';
import {
  Bell,
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Clock,
  Sparkles,
  Share2,
  Users,
} from 'lucide-react';
import { ReliefAssignment } from '../types';
import { formatMalayDate, generateWhatsAppMessage } from '../utils/reliefEngine';
import { SCHOOL_INFO } from '../data/timeSlots';

interface NotificationCenterViewProps {
  currentDate: string;
  currentDay: string;
  assignments: ReliefAssignment[];
  onUpdateStatus: (assignmentId: string, status: ReliefAssignment['status']) => void;
  onUpdateAllStatuses: (status: ReliefAssignment['status']) => void;
}

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  currentDate,
  currentDay,
  assignments,
  onUpdateStatus,
  onUpdateAllStatuses,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  // Group assignments by relief teacher to avoid spamming the same teacher multiple times
  const groupedByTeacher: Record<
    string,
    {
      teacherName: string;
      items: ReliefAssignment[];
    }
  > = {};

  assignments.forEach((asg) => {
    if (!asg.reliefTeacherId) return;
    if (!groupedByTeacher[asg.reliefTeacherId]) {
      groupedByTeacher[asg.reliefTeacherId] = {
        teacherName: asg.reliefTeacherName,
        items: [],
      };
    }
    groupedByTeacher[asg.reliefTeacherId].items.push(asg);
  });

  // Handle single copy
  const handleCopySingle = (asg: ReliefAssignment) => {
    const text = decodeURIComponent(generateWhatsAppMessage(asg, SCHOOL_INFO.name));
    navigator.clipboard.writeText(text);
    setCopiedId(asg.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Generate full broadcast text for staff WhatsApp group
  const generateBroadcastText = () => {
    let text = `📢 *MAKLUMAN JADUAL GURU GANTI (MMI)*\n`;
    text += `🏫 *${SCHOOL_INFO.name}*\n`;
    text += `📅 *Tarikh:* ${formatMalayDate(currentDate)} (${currentDay})\n\n`;
    text += `Berikut adalah senarai guru ganti bagi kelas terlibat hari ini:\n\n`;

    assignments.forEach((asg, index) => {
      text += `*${index + 1}. WAKTU ${asg.period} (${asg.timeSlot})*\n`;
      text += `• Kelas: ${asg.className} (${asg.subject})\n`;
      text += `• Guru Asal: ${asg.absentTeacherName} (${asg.reasonForAbsence})\n`;
      text += `• *GURU GANTI:* ${asg.reliefTeacherName || 'Belum diisi'}\n`;
      if (asg.notesMMI) {
        text += `• Catatan MMI: ${asg.notesMMI}\n`;
      }
      text += `\n`;
    });

    text += `Kerjasama semua guru yang terlibat amat dihargai dalam memastikan kelancaran PdP murid (Melindungi Masa Instruksional - MMI).\n\n_Dikeluarkan oleh Penyelaras Jadual Guru Ganti SK St Patrick, Mukah_`;
    return text;
  };

  const handleCopyBroadcast = () => {
    const text = generateBroadcastText();
    navigator.clipboard.writeText(text);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  const totalNotified = assignments.filter(
    (a) => a.status === 'Diberitahu' || a.status === 'Disahkan' || a.status === 'Selesai'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Pemberitahuan Segera Kepada Guru</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Pusat Notifikasi & Slip Digital Guru
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hantar makluman segera melalui sistem dan pautan WhatsApp rasmi kepada guru yang terpilih menggantikan kelas hari ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onUpdateAllStatuses('Diberitahu')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tandakan Semua &quot;Diberitahu&quot;</span>
          </button>

          <button
            onClick={handleCopyBroadcast}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            {copiedBroadcast ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedBroadcast ? 'Disalin Ke Clipboard!' : 'Salin Siaran WhatsApp Kumpulan'}</span>
          </button>
        </div>
      </div>

      {/* Broadcast Preview Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-50 rounded-xl border border-emerald-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Teks Siaran Ringkas Untuk Kumpulan WhatsApp Rasmi Guru</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Siaran Rasmi
          </span>
        </div>
        <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap bg-white p-3.5 rounded-lg border border-emerald-100 max-h-40 overflow-y-auto leading-relaxed">
          {generateBroadcastText()}
        </pre>
      </div>

      {/* List of Individual Teacher Notification Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Senarai Guru Yang Terlibat Hari Ini ({Object.keys(groupedByTeacher).length} Orang)</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {totalNotified}/{assignments.length} Sesi Telah Diberitahu
          </span>
        </div>

        {Object.keys(groupedByTeacher).length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">
              Tiada Guru Ganti Terpilih Buat Masa Ini
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Sila jana jadual guru ganti terlebih dahulu di menu &quot;Jana Jadual Ganti&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedByTeacher).map(([teacherId, group]) => {
              const allConfirmed = group.items.every((i) => i.status === 'Disahkan' || i.status === 'Selesai');
              const allCompleted = group.items.every((i) => i.status === 'Selesai');

              return (
                <div
                  key={teacherId}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow relative"
                >
                  {/* Teacher Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        {group.teacherName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {group.items.length} Sesi Ganti Hari Ini
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {allCompleted ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selesai
                        </span>
                      ) : allConfirmed ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Disahkan Terima
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Menunggu Respon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sessions details */}
                  <div className="space-y-2">
                    {group.items.map((asg) => (
                      <div
                        key={asg.id}
                        className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-blue-900 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                              Waktu {asg.period}
                            </span>
                            <span className="font-bold text-slate-800">
                              {asg.className} ({asg.subject})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {asg.timeSlot}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-center justify-between">
                          <span>Menggantikan: {asg.absentTeacherName}</span>
                          <span className="text-rose-600 font-medium text-[10px]">
                            {asg.reasonForAbsence}
                          </span>
                        </div>

                        {asg.notesMMI && (
                          <div className="text-[11px] text-slate-500 bg-white p-1 rounded border border-slate-100 italic">
                            MMI: {asg.notesMMI}
                          </div>
                        )}

                        {/* Status Toggle Buttons */}
                        <div className="pt-1.5 flex items-center justify-between border-t border-slate-200/60">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">Status Slip:</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                asg.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : asg.status === 'Disahkan'
                                  ? 'bg-blue-100 text-blue-800'
                                  : asg.status === 'Diberitahu'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {asg.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {asg.status !== 'Disahkan' && asg.status !== 'Selesai' && (
                              <button
                                onClick={() => onUpdateStatus(asg.id, 'Disahkan')}
                                className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-colors"
                                title="Guru telah mengesahkan penerimaan slip"
                              >
                                Sahkan Terima
                              </button>
                            )}
                            {asg.status !== 'Selesai' && (
                              <button
                                onClick={() => onUpdateStatus(asg.id, 'Selesai')}
                                className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                                title="Tandakan kelas telah selesai dijalankan"
                              >
                                Selesai
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions for this teacher */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/?text=${generateWhatsAppMessage(group.items[0], SCHOOL_INFO.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        group.items.forEach((i) => onUpdateStatus(i.id, 'Diberitahu'))
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Hantar WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleCopySingle(group.items[0])}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                      title="Salin Teks Slip Guru Ini"
                    >
                      {copiedId === group.items[0].id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
