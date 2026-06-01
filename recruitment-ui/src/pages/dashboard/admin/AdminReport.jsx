import { useState, useEffect } from "react";
import axios from "axios";
import { Printer, Loader2, Calendar, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // State tambahan jika API error

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/admin/report", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportData(res.data);
        setError(false);
      } catch (err) {
        console.error("Gagal memuat laporan:", err);
        setError(true);
        Swal.fire({
          title: "Sistem Error 500",
          text: "Terjadi kesalahan internal di server Laravel saat mengolah data rekrutmen.",
          icon: "error",
          confirmButtonColor: "#4a0404",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // 1. TAMPILAN JIKA SEDANG LOADING
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cafe-maroon" size={32} />
      </div>
    );
  }

  // 2. TAMPILAN JIKA SERVER TERNYATA ERROR 500
  if (error || !reportData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h3 className="font-black text-cafe-maroon uppercase text-lg mb-2">
          Gagal Membuka Laporan
        </h3>
        <p className="text-xs text-gray-400 max-w-sm">
          Server Laravel mengalami kendala pemrosesan query. Periksa kembali
          penamaan relasi tabel di model Anda.
        </p>
      </div>
    );
  }

  // 3. AMAN: Destructuring baru dilakukan setelah kita yakin data tidak null
  const { stats, applications } = reportData;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Style Khusus Cetak Versi Final */}
      <style>{`
  @media print {
    /* 1. Sembunyikan elemen no-print dan navigasi */
    .no-print, aside, nav, button, header, .sidebar, .navbar { 
      display: none !important; 
    }
    
    /* 2. Sembunyikan tombol logout atau komponen melayang secara radikal */
    [class*="fixed"], [class*="absolute"], [class*="z-50"], [class*="top-"] {
      display: none !important;
      position: static !important;
    }

    /* 3. Bersihkan sisa ruang kosong (margin/padding bawaan layout dashboard) */
    div, main, section {
      padding-left: 0 !important;
      padding-top: 0 !important;
      margin-left: 0 !important;
      margin-top: 0 !important;
      box-shadow: none !important;
      border: none !important;
    }
    
    /* 4. Paksa layout menjadi lembaran kertas bersih */
    body, html, #root { 
      background-color: white !important;
      color: black !important;
      display: block !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
    }
    
    /* 5. Optimasi area dokumen laporan */
    .print-area { 
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    table { page-break-inside: auto; width: 100% !important; }
    tr { page-break-inside: avoid; page-break-after: auto; }
  }
`}</style>

      {/* HEADER & AKSI */}
      <header className="mb-10 flex justify-between items-end no-print">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-cafe-orange"></div>
            <span className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.4em]">
              Kearsipan & Pelaporan
            </span>
          </div>
          <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
            Recruitment <span className="text-cafe-orange">Report</span>
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="bg-cafe-maroon text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cafe-orange transition-all shadow-md"
          >
            <Printer size={16} /> Cetak PDF / Print
          </button>
        </div>
      </header>

      {/* KONTEN UTAMA LAPORAN */}
      <div className="print-area bg-white p-10 border border-gray-100 shadow-sm">
        <div className="text-center border-b-4 border-cafe-maroon pb-6 mb-8">
          <h1 className="text-2xl font-black text-cafe-maroon uppercase tracking-tight">
            LAPORAN EXECUTIVE PROSES REKRUTMEN GURU
          </h1>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1 flex items-center justify-center gap-2">
            <Calendar size={14} /> Per tanggal:{" "}
            {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
          </p>
        </div>

        {/* Ringkasan Angka */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Akun Pelamar", value: stats?.total_pelamar },
            { label: "Lowongan Dibuka", value: stats?.total_lowongan },
            { label: "Berkas Lamaran Masuk", value: stats?.lamaran_masuk },
            { label: "Kandidat Diterima", value: stats?.diterima },
          ].map((item, i) => (
            <div key={i} className="border-2 border-gray-100 p-4 text-center">
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-black text-cafe-maroon">
                {item.value || 0}
              </p>
            </div>
          ))}
        </div>

        {/* Tabel Data Lamaran */}
        <h3 className="font-black text-cafe-maroon uppercase text-xs tracking-wider mb-4">
          Rincian Aktivitas Lamaran Masuk
        </h3>
        <div className="border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                <th className="p-4 border-r border-gray-200">Nama Pelamar</th>
                <th className="p-4 border-r border-gray-200">
                  Posisi & Cabang
                </th>
                <th className="p-4 border-r border-gray-200">Tanggal Submit</th>
                <th className="p-4 text-center">Status Akhir</th>
              </tr>
            </thead>
            <tbody>
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <td className="p-4 border-r border-gray-200 font-bold text-gray-700 uppercase">
                      {/* Jalur pemanggilan berantai: app -> applicant -> user -> name */}
                      {app.applicant?.user?.name || (
                        <span className="text-red-400 font-normal italic">
                          Nama Tidak Ditemukan
                        </span>
                      )}
                      <p className="text-[10px] text-gray-400 font-normal lowercase">
                        {app.applicant?.user?.email || "email@tidakada.com"}
                      </p>
                    </td>
                    <td className="p-4 border-r border-gray-200 font-medium">
                      <span className="font-bold text-cafe-maroon">
                        {app.job_opening?.title}
                      </span>
                      <p className="text-[10px] text-cafe-orange font-bold uppercase">
                        {app.job_opening?.branch?.name}
                      </p>
                    </td>
                    <td className="p-4 border-r border-gray-200 text-gray-500">
                      {new Date(app.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4 text-center font-black uppercase tracking-widest text-[9px]">
                      <span
                        className={
                          app.status === "Accepted"
                            ? "text-green-600"
                            : app.status === "Rejected"
                              ? "text-red-500"
                              : "text-blue-500"
                        }
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-10 text-center text-gray-400 font-bold uppercase"
                  >
                    Belum ada data pelamar masuk untuk dilaporkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan */}
        <div className="mt-16 flex justify-end text-center">
          <div className="w-64">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-16">
              Disahkan Oleh, Admin Sistem
            </p>
            <div className="border-b-2 border-gray-400 w-full mx-auto mb-1"></div>
            <p className="text-xs font-black text-cafe-maroon uppercase tracking-tight">
              SUPER ADMINISTRATOR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
