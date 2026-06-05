import { useState, useEffect } from "react";
import axios from "axios";
import { Printer, Loader2, Calendar, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";
import { Spinner } from "../../../components/SkeletonCard";

export default function AdminReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/admin/report", { headers: { Authorization: `Bearer ${token}` } });
        setReportData(res.data);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
        Swal.fire({ title: "Sistem Error 500", text: "Terjadi kesalahan internal di server.", icon: "error", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
      } finally { setLoading(false); }
    };
    fetchReport();
  }, []);

  const handlePrint = () => window.print();

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Spinner /></div>;

  if (error || !reportData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={44} />
        <h3 className="font-black text-cafe-maroon uppercase text-lg mb-2">Gagal Membuka Laporan</h3>
        <p className="text-[10px] text-gray-400 max-w-sm">Server mengalami kendala pemrosesan query. Periksa kembali penamaan relasi tabel di model Anda.</p>
      </div>
    );
  }

  const { stats, applications } = reportData;

  return (
    <div className="p-8 md:p-10 bg-cafe-cream min-h-screen">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body, html, #root { background-color: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
          .print-area { display: block !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; border: none !important; box-shadow: none !important; }
          table { page-break-inside: auto; width: 100% !important; }
          tr { page-break-inside: avoid; }
          aside, nav, header.fixed, [class*="sidebar"], [class*="Sidebar"] { display: none !important; }
          main, [class*="ml-64"], [style*="margin-left"] { margin-left: 0 !important; }
          body > div.flex > div:first-child { display: none !important; }
        }
      `}</style>

      <header className="mb-10 flex justify-between items-end no-print">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-cafe-orange rounded-full" />
            <span className="text-[9px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Kearsipan &amp; Pelaporan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter">Recruitment <span className="text-cafe-orange">Report</span></h2>
        </div>
        <button onClick={handlePrint} className="bg-cafe-maroon text-white px-6 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cafe-orange transition-all shadow-md no-print">
          <Printer size={15} /> Cetak PDF / Print
        </button>
      </header>

      <div className="print-area bg-white rounded-xl p-10 border border-gray-100 shadow-sm">
        <div className="text-center border-b-4 border-cafe-maroon pb-6 mb-8">
          <h1 className="text-xl md:text-2xl font-black text-cafe-maroon uppercase tracking-tight">LAPORAN EXECUTIVE PROSES REKRUTMEN GURU</h1>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1 flex items-center justify-center gap-2">
            <Calendar size={13} /> Per tanggal: {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Akun Pelamar", value: stats?.total_pelamar },
            { label: "Lowongan Dibuka", value: stats?.total_lowongan },
            { label: "Berkas Lamaran Masuk", value: stats?.lamaran_masuk },
            { label: "Kandidat Diterima", value: stats?.diterima },
          ].map((item, i) => (
            <div key={i} className="border-2 border-gray-100 rounded-xl p-4 text-center">
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider mb-1">{item.label}</p>
              <p className="text-2xl font-black text-cafe-maroon">{item.value || 0}</p>
            </div>
          ))}
        </div>

        <h3 className="font-black text-cafe-maroon uppercase text-[10px] tracking-wider mb-4">Rincian Aktivitas Lamaran Masuk</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-cafe-cream border-b border-gray-200 text-[9px] font-black uppercase text-gray-500 tracking-wider">
                <th className="p-4 border-r border-gray-200">Nama Pelamar</th>
                <th className="p-4 border-r border-gray-200">Posisi &amp; Cabang</th>
                <th className="p-4 border-r border-gray-200">Tanggal Submit</th>
                <th className="p-4 text-center">Status Akhir</th>
              </tr>
            </thead>
            <tbody>
              {applications && applications.length > 0 ? applications.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-cafe-cream/50">
                  <td className="p-4 border-r border-gray-200 font-bold text-gray-700 uppercase">
                    {app.applicant?.user?.name || <span className="text-red-400 font-normal italic">Nama Tidak Ditemukan</span>}
                    <p className="text-[9px] text-gray-400 font-normal lowercase">{app.applicant?.user?.email || "email@tidakada.com"}</p>
                  </td>
                  <td className="p-4 border-r border-gray-200 font-medium">
                    <span className="font-bold text-cafe-maroon">{app.job_opening?.title}</span>
                    <p className="text-[9px] text-cafe-orange font-bold uppercase">{app.job_opening?.branch?.name}</p>
                  </td>
                  <td className="p-4 border-r border-gray-200 text-gray-500">{new Date(app.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border ${
                      app.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                      app.status === "Rejected" ? "bg-red-50 text-red-600 border-red-100" :
                      app.status === "Interview" ? "bg-purple-50 text-purple-600 border-purple-100" :
                      app.status === "Under Review" ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-cafe-orange/10 text-cafe-orange border-cafe-orange/20"
                    }`}>{app.status}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-bold uppercase">Belum ada data pelamar masuk.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-14 flex justify-end text-center">
          <div className="w-64">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-14">Disahkan Oleh, Admin Sistem</p>
            <div className="border-b-2 border-gray-400 w-full mx-auto mb-1" />
            <p className="text-[11px] font-black text-cafe-maroon uppercase tracking-tight">SUPER ADMINISTRATOR</p>
          </div>
        </div>
      </div>
    </div>
  );
}
