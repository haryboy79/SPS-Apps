import React, { useState, useRef } from 'react';
import {
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Download,
  Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReliefAssignment, AbsentTeacherInput, TeacherTimetable } from '../types';
import { formatMalayDate } from '../utils/reliefEngine';
import { SCHOOL_INFO } from '../data/timeSlots';
import { SchoolLogo } from './logos/SchoolLogo';
import { TS25Logo } from './logos/TS25Logo';

interface PrintPdfViewProps {
  currentDate: string;
  currentDay: string;
  absentTeachers: AbsentTeacherInput[];
  assignments: ReliefAssignment[];
  preparedBy: string;
  setPreparedBy: (name: string) => void;
  verifiedBy: string;
  setVerifiedBy: (name: string) => void;
  teachers?: TeacherTimetable[];
}

export const PrintPdfView: React.FC<PrintPdfViewProps> = ({
  currentDate,
  currentDay,
  absentTeachers,
  assignments,
  preparedBy,
  setPreparedBy,
  verifiedBy,
  setVerifiedBy,
  teachers = [],
}) => {
  const [printMode, setPrintMode] = useState<'master' | 'slips'>('master');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Status message
  const [pdfStatusMessage, setPdfStatusMessage] = useState<string | null>(null);
  const [pdfStatusType, setPdfStatusType] = useState<'info' | 'success' | 'error'>('info');

  const printableRef = useRef<HTMLDivElement>(null);

  // Custom original logo PNG state persisted in localStorage
  const [logoSpsUrl, setLogoSpsUrl] = useState<string | undefined>(() => {
    return localStorage.getItem('sk_st_patrick_logo_sps') || undefined;
  });

  const [logoTs25Url, setLogoTs25Url] = useState<string | undefined>(() => {
    return localStorage.getItem('sk_st_patrick_logo_ts25') || undefined;
  });

  const spsInputRef = useRef<HTMLInputElement>(null);
  const ts25InputRef = useRef<HTMLInputElement>(null);

  // Handle uploading original SPS logo PNG
  const handleUploadSps = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoSpsUrl(result);
        localStorage.setItem('sk_st_patrick_logo_sps', result);
        window.dispatchEvent(new Event('sps_logo_updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle uploading original TS25 logo PNG
  const handleUploadTs25 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoTs25Url(result);
        localStorage.setItem('sk_st_patrick_logo_ts25', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset logos to default
  const handleResetLogos = () => {
    setLogoSpsUrl(undefined);
    setLogoTs25Url(undefined);
    localStorage.removeItem('sk_st_patrick_logo_sps');
    localStorage.removeItem('sk_st_patrick_logo_ts25');
    window.dispatchEvent(new Event('sps_logo_updated'));
  };

  /**
   * Safe helper to download a Blob as a file in any browser/iframe
   */
  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 1000);
  };

  /**
   * Internal generator that produces a jsPDF object and blob from printableRef
   */
  const generatePdfBlob = async (): Promise<{ pdf: jsPDF; blob: Blob; fileName: string } | null> => {
    if (!printableRef.current) return null;
    const element = printableRef.current;

    // Small pause to let DOM refresh
    await new Promise((r) => setTimeout(r, 120));

    const modeLabel = printMode === 'master' ? 'JADUAL_GURU_GANTI_MMI' : 'KERATAN_SLIP_GURU_GANTI';
    const cleanDate = (currentDate || new Date().toISOString().split('T')[0]).replace(/-/g, '_');
    const fileName = `${modeLabel}_SK_ST_PATRICK_MUKAH_${cleanDate}.pdf`;

    // Try HTML2Canvas first
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        ignoreElements: (el) => el.classList.contains('print:hidden'),
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - margin * 2; // 190mm
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      if (contentHeight <= pageHeight - margin * 2) {
        // Fits on single page
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
      } else {
        // Multiple pages slicing
        const pageCanvasHeight = (canvas.width * (pageHeight - margin * 2)) / contentWidth;
        let remainingHeight = canvas.height;
        let currentY = 0;

        while (remainingHeight > 0) {
          const chunkHeight = Math.min(pageCanvasHeight, remainingHeight);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = chunkHeight;
          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0,
              currentY,
              canvas.width,
              chunkHeight,
              0,
              0,
              canvas.width,
              chunkHeight
            );
            const pageImgData = pageCanvas.toDataURL('image/png');
            const renderedHeight = (chunkHeight * contentWidth) / canvas.width;

            if (currentY > 0) {
              pdf.addPage();
            }
            pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, renderedHeight);
          }
          currentY += chunkHeight;
          remainingHeight -= chunkHeight;
        }
      }

      const blob = pdf.output('blob');
      return { pdf, blob, fileName };
    } catch (canvasErr) {
      console.warn('html2canvas method encountered an error, falling back to jsPDF html method:', canvasErr);
      
      // Fallback: jsPDF built-in html renderer
      try {
        const fallbackPdf = new jsPDF('p', 'mm', 'a4');
        await fallbackPdf.html(element, {
          callback: () => {},
          x: 10,
          y: 10,
          width: 190,
          windowWidth: element.scrollWidth,
          autoPaging: 'text',
        });
        const blob = fallbackPdf.output('blob');
        return { pdf: fallbackPdf, blob, fileName };
      } catch (fallbackErr) {
        console.error('All PDF rendering methods failed:', fallbackErr);
        throw fallbackErr;
      }
    }
  };

  /**
   * Direct Save as PDF (downloads PDF file directly to device)
   */
  const handleDownloadPdf = async () => {
    if (!printableRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPdfStatusType('info');
    setPdfStatusMessage('Sedang menyusun dokumen format A4 berkualiti tinggi...');

    try {
      const result = await generatePdfBlob();
      if (!result) throw new Error('Gagal memproses paparan dokumen.');

      const { pdf, blob, fileName } = result;

      // Download to local device using both methods for maximum reliability
      try {
        pdf.save(fileName);
      } catch (saveErr) {
        console.warn('pdf.save failed, using blob download fallback:', saveErr);
        downloadBlob(blob, fileName);
      }

      setPdfStatusType('success');
      setPdfStatusMessage(`✅ Fail "${fileName}" berjaya dimuat turun ke peranti anda.`);
      setTimeout(() => setPdfStatusMessage(null), 6000);
    } catch (err: unknown) {
      console.error('Error generating PDF:', err);
      const errMsg = err instanceof Error ? err.message : 'Sila cuba lagi.';
      setPdfStatusType('error');
      setPdfStatusMessage(`❌ Ralat simpan PDF: ${errMsg}. Sila cuba sekali lagi.`);
      setTimeout(() => setPdfStatusMessage(null), 8000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden during print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Simpan PDF Jadual Guru Ganti (TS25)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Format rasmi SK St Patrick Mukah mengikut standard PPD Mukah & TS25. Fail PDF format A4 boleh dimuat turun terus ke peranti anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setPrintMode('master')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                printMode === 'master'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Jadual Keseluruhan (Master)</span>
            </button>
            <button
              onClick={() => setPrintMode('slips')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                printMode === 'slips'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Keratan Slip Guru Ganti</span>
            </button>
          </div>

          {/* Primary Save as PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
            title="Muat turun fail PDF ke komputer atau telefon anda"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menjana Fail PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Simpan Sebagai PDF (.pdf)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {pdfStatusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 print:hidden shadow-xs transition-all ${
            pdfStatusType === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : pdfStatusType === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-300'
              : 'bg-blue-50 text-blue-900 border border-blue-300'
          }`}
        >
          {pdfStatusType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : pdfStatusType === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Loader2 className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
          )}
          <span className="flex-1">{pdfStatusMessage}</span>
        </div>
      )}

      {/* Pengurusan Fail Logo Asal PNG (Hidden during print) */}
      <div className="bg-white rounded-xl border border-blue-200 p-4 print:hidden shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900">
              Gunakan Fail Logo Asal PNG Anda (100% Mengikut Fail Asal)
            </h4>
          </div>
          {(logoSpsUrl || logoTs25Url) && (
            <button
              onClick={handleResetLogos}
              className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Set Semula Logo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* SPS Logo input */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <SchoolLogo src={logoSpsUrl} className="w-9 h-9 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Logo SPS (SK St Patrick)</span>
                <span className="text-[10px] text-slate-500">
                  {logoSpsUrl ? '✅ Fail Asal PNG Digunakan' : 'Gunakan fail: LOGO SPS 2024 (line luar).png'}
                </span>
              </div>
            </div>
            <div>
              <input
                ref={spsInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadSps}
                className="hidden"
              />
              <button
                onClick={() => spsInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Pilih Fail PNG</span>
              </button>
            </div>
          </div>

          {/* TS25 Logo input */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <TS25Logo src={logoTs25Url} className="w-9 h-9 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Logo TS25 Asal</span>
                <span className="text-[10px] text-slate-500">
                  {logoTs25Url ? '✅ Fail Asal PNG Digunakan' : 'Gunakan fail: ts25-logo-png.png'}
                </span>
              </div>
            </div>
            <div>
              <input
                ref={ts25InputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadTs25}
                className="hidden"
              />
              <button
                onClick={() => ts25InputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Pilih Fail PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan "Disediakan Oleh" & "Disahkan Oleh" (Hidden during print) */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 print:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Disediakan Oleh (Pilih dari Dropdown Pentadbir / Penolong Kanan / AJK Jadual):
          </label>
          <div className="relative">
            <select
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-bold appearance-none pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <optgroup label="⭐ PENTADBIR UTAMA">
                <option value="GURU BESAR">GURU BESAR</option>
              </optgroup>
              <optgroup label="🔷 PENOLONG KANAN">
                <option value="PENOLONG KANAN PENTADBIRAN">PENOLONG KANAN PENTADBIRAN</option>
                <option value="PENOLONG KANAN HAL EHWAL MURID (HEM)">
                  PENOLONG KANAN HAL EHWAL MURID (HEM)
                </option>
                <option value="PENOLONG KANAN KOKURIKULUM">PENOLONG KANAN KOKURIKULUM</option>
              </optgroup>
              <optgroup label="📋 JAWATANKUASA JADUAL WAKTU">
                <option value="PENYELARAS JADUAL WAKTU (AJK)">PENYELARAS JADUAL WAKTU (AJK)</option>
                <option value="SETIAUSAHA JADUAL WAKTU (AJK)">SETIAUSAHA JADUAL WAKTU (AJK)</option>
                <option value="AHLI JAWATANKUASA JADUAL WAKTU">AHLI JAWATANKUASA JADUAL WAKTU</option>
              </optgroup>
              {teachers.length > 0 && (
                <optgroup label="👨‍🏫 GURU-GURU SK ST PATRICK (AJK JADUAL WAKTU)">
                  {teachers.map((t) => (
                    <option key={t.id} value={`${t.name} (AJK JADUAL WAKTU)`}>
                      {t.name} (AJK Jadual Waktu)
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Disahkan Oleh (Status Pengesahan Pentadbir):
          </label>
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold flex items-center justify-between">
            <span>GURU BESAR, SK ST PATRICK, MUKAH</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
              Cetakan Komputer Sah
            </span>
          </div>
        </div>
      </div>

      {/* PRINTABLE DOCUMENT AREA */}
      <div
        ref={printableRef}
        id="printable-relief-schedule"
        className="bg-white rounded-xl shadow-lg border border-slate-200 print:border-none print:shadow-none p-6 md:p-8 max-w-4xl mx-auto"
      >
        {printMode === 'master' ? (
          /* ========================================================
             FORMAT 1: JADUAL KESELURUHAN GURU GANTI HARIAN (MASTER)
             ======================================================== */
          <div className="space-y-5">
            {/* Header Sekolah Bersama Logo SPS dan TS25 */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 gap-4">
              {/* Logo Sekolah (Kiri) */}
              <div className="shrink-0 flex items-center justify-center">
                <SchoolLogo src={logoSpsUrl} className="w-20 h-20 md:w-24 md:h-24" />
              </div>

              {/* Teks Rasmi Kepala Surat (Tengah) */}
              <div className="text-center flex-1 space-y-1">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                  {SCHOOL_INFO.name}
                </h1>
                <div className="text-xs text-slate-700 font-bold tracking-wide">
                  KOD SEKOLAH: {SCHOOL_INFO.code} • {SCHOOL_INFO.district}
                </div>
                <div className="text-[11px] text-blue-900 font-extrabold tracking-wider uppercase">
                  {SCHOOL_INFO.program}
                </div>
                <div className="mt-2 inline-block bg-slate-900 text-white px-4 py-1 rounded text-xs font-black uppercase tracking-wider">
                  JADUAL WAKTU GURU GANTI (MMI - MELINDUNGI MASA INSTRUKSIONAL)
                </div>
              </div>

              {/* Logo TS25 (Kanan) */}
              <div className="shrink-0 flex items-center justify-center">
                <TS25Logo src={logoTs25Url} className="w-20 h-20 md:w-24 md:h-24" />
              </div>
            </div>

            {/* Info Tarikh & Guru Cuti */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 rounded p-3 bg-slate-50/50">
              <div>
                <p>
                  <strong className="text-slate-900">Tarikh:</strong> {formatMalayDate(currentDate)}
                </p>
                <p className="mt-1">
                  <strong className="text-slate-900">Hari:</strong> {currentDay}
                </p>
                <p className="mt-1">
                  <strong className="text-slate-900">Edisi Jadual:</strong> {SCHOOL_INFO.edition}
                </p>
              </div>
              <div>
                <strong className="text-slate-900 block mb-1">
                  Guru Tidak Hadir ({absentTeachers.length} Orang):
                </strong>
                {absentTeachers.length === 0 ? (
                  <span className="text-slate-500 italic">Tiada guru bercuti</span>
                ) : (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {absentTeachers.map((t) => (
                      <li key={t.teacherId}>
                        <span className="font-semibold">{t.teacherName}</span>{' '}
                        <span className="text-[11px] text-slate-500">({t.reason})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Jadual Matriks Ganti (Tanpa Kolum Tandatangan) */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-900">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-center">
                    <th className="border border-slate-900 py-2 px-1 w-8">BIL</th>
                    <th className="border border-slate-900 py-2 px-2 w-16">WAKTU</th>
                    <th className="border border-slate-900 py-2 px-2 w-24">MASA</th>
                    <th className="border border-slate-900 py-2 px-2 w-16">KELAS</th>
                    <th className="border border-slate-900 py-2 px-2 w-16">SUBJEK</th>
                    <th className="border border-slate-900 py-2 px-2 text-left">GURU TIDAK HADIR</th>
                    <th className="border border-slate-900 py-2 px-2 text-left">GURU PENGGANTI</th>
                    <th className="border border-slate-900 py-2 px-2 text-left">CATATAN / BAHAN MMI</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="border border-slate-900 py-6 text-center text-slate-500 italic">
                        Tiada sebarang waktu ganti dijana untuk tarikh ini.
                      </td>
                    </tr>
                  ) : (
                    assignments.map((asg, idx) => (
                      <tr key={asg.id} className="border-b border-slate-400">
                        <td className="border border-slate-900 py-2 px-1 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-900 py-2 px-2 text-center font-bold">
                          {asg.period}
                        </td>
                        <td className="border border-slate-900 py-2 px-2 text-center text-[11px]">
                          {asg.timeSlot}
                        </td>
                        <td className="border border-slate-900 py-2 px-2 text-center font-bold">
                          {asg.className}
                        </td>
                        <td className="border border-slate-900 py-2 px-2 text-center font-bold">
                          {asg.subject}
                        </td>
                        <td className="border border-slate-900 py-2 px-2">
                          <div className="font-semibold text-slate-900">{asg.absentTeacherName}</div>
                          <div className="text-[10px] text-slate-600">({asg.reasonForAbsence})</div>
                        </td>
                        <td className="border border-slate-900 py-2 px-2 font-bold text-slate-900">
                          {asg.reliefTeacherName || <span className="text-red-600">BELUM DIISI</span>}
                        </td>
                        <td className="border border-slate-900 py-2 px-2 text-[11px] text-slate-700">
                          {asg.notesMMI || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Peringatan Pelaksanaan MMI */}
            <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
              <strong className="text-slate-800">PERINGATAN GURU PENGGANTI (MMI - TS25):</strong>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Sila masuk ke kelas tepat pada masanya mengikut waktu yang telah ditetapkan.</li>
                <li>Pastikan murid menjalankan aktiviti pembelajaran seperti mana arahan / modul MMI di atas.</li>
                <li>Kawalan kelas dan keselamatan murid adalah tanggungjawab guru pengganti sepanjang masa tersebut.</li>
              </ol>
            </div>

            {/* Bahagian Perakuan & Pengesahan (Tanpa Tandatangan - Cetakan Komputer Sah) */}
            <div className="grid grid-cols-2 gap-6 pt-4 text-xs border-t border-slate-300">
              <div className="p-3 rounded-lg border border-slate-300 bg-slate-50/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Disediakan Oleh:</span>
                <p className="font-extrabold text-slate-900 uppercase text-xs">
                  {preparedBy || 'PENYELARAS JADUAL WAKTU (AJK)'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Jawatankuasa Jadual Waktu & MMI, SK St Patrick Mukah
                </p>
                <p className="text-[10px] text-slate-500 pt-1">
                  Tarikh Dijana: {formatMalayDate(currentDate)}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-300 bg-slate-50/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Disahkan Oleh:</span>
                <p className="font-extrabold text-slate-900 uppercase text-xs">
                  GURU BESAR
                </p>
                <p className="text-[11px] text-slate-600">
                  SK St Patrick, Mukah (PPD Mukah)
                </p>
                <p className="text-[10px] text-emerald-800 font-semibold pt-1">
                  Status: Sah Diperakui Melalui Sistem
                </p>
              </div>
            </div>

            {/* Notis Cetakan Komputer Rasmi */}
            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-500 font-semibold italic">
                *** Cetakan komputer ini dijana secara automatik melalui Sistem e-GuruGanti MMI SK St Patrick, Mukah. Cetakan ini sah dan tidak memerlukan tandatangan fizikal. ***
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================
             FORMAT 2: KERATAN SLIP GURU GANTI (4 PER PAGE SLIPS)
             ======================================================== */
          <div className="space-y-6">
            <div className="text-center pb-2 border-b border-slate-300 print:hidden">
              <h3 className="font-bold text-sm text-slate-800">
                Format Keratan Slip Guru Ganti (4 Keping Setiap Muka Surat)
              </h3>
              <p className="text-xs text-slate-500">
                Lengkap dengan Logo SPS & TS25 • Cetakan komputer tanpa perlu tandatangan
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignments.map((asg, idx) => (
                <div
                  key={asg.id}
                  className="border-2 border-dashed border-slate-400 p-4 rounded-lg bg-slate-50/30 text-xs space-y-2.5 relative break-inside-avoid"
                >
                  {/* Slip Header with both logos */}
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <div className="flex items-center gap-2">
                      <SchoolLogo src={logoSpsUrl} className="w-8 h-8" />
                      <div>
                        <span className="font-black text-slate-900 text-xs block leading-tight">
                          {SCHOOL_INFO.name}
                        </span>
                        <span className="text-[9px] text-blue-900 font-extrabold uppercase">
                          SLIP GURU GANTI (TS25)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white font-bold text-[9px]">
                        SLIP #{idx + 1}
                      </span>
                      <TS25Logo src={logoTs25Url} className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Slip Details */}
                  <div className="space-y-1">
                    <p>
                      <strong>Kepada Guru Ganti:</strong>{' '}
                      <span className="font-bold text-blue-900 uppercase">
                        {asg.reliefTeacherName || '(Belum Ditugaskan)'}
                      </span>
                    </p>
                    <p>
                      <strong>Tarikh / Hari:</strong> {formatMalayDate(currentDate)} ({currentDay})
                    </p>
                    <p>
                      <strong>Waktu & Masa:</strong> Waktu {asg.period} ({asg.timeSlot})
                    </p>
                    <p>
                      <strong>Kelas & Subjek:</strong>{' '}
                      <span className="font-bold text-slate-900">
                        {asg.className} - {asg.subject}
                      </span>
                    </p>
                    <p>
                      <strong>Guru Asal:</strong> {asg.absentTeacherName} ({asg.reasonForAbsence})
                    </p>
                    <p className="text-[11px] bg-white p-1.5 rounded border border-slate-200">
                      <strong>Bahan MMI:</strong> {asg.notesMMI || 'Modul Latihan MMI disediakan di meja guru'}
                    </p>
                  </div>

                  {/* Slip Footer (Tanpa Tandatangan) */}
                  <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-600">
                    <span className="font-semibold text-slate-700">Disediakan: {preparedBy}</span>
                    <span className="text-slate-500 italic">
                      * Cetakan Komputer Sah (TS25) • Tidak Perlu Tandatangan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
