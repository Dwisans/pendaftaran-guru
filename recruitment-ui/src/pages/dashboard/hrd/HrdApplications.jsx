import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  FileText,
  ExternalLink,
  Loader2,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import axios from "axios";

export default function HrdApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8000/api/hrd/applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(res.data.data);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData(e.target);
    const payload = {
      status: formData.get("status"),
      hrd_notes: formData.get("hrd_notes"),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8000/api/hrd/applications/${selectedApp.id}/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSelectedApp(null);
      fetchApplications();
    } catch {
      alert("Gagal memperbarui status.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredApps = applications.filter(
    (app) =>
      app.applicant?.user?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.job_opening?.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-cafe-maroon" size={40} />
      </div>
    );

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-cafe-orange"></div>
            <span className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.4em]">
              Recruitment Process
            </span>
          </div>
          <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
            Data <span className="text-cafe-orange">Lamaran</span>
          </h2>
        </div>

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari Nama atau Posisi..."
            className="pl-12 pr-6 py-3 bg-white border-2 border-gray-100 w-full md:w-80 text-[11px] font-black uppercase tracking-widest outline-none focus:border-cafe-maroon transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* TABLE */}
      <div className="bg-white shadow-xl overflow-hidden border-b-8 border-cafe-maroon">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-cafe-maroon text-white">
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest">
                Kandidat
              </th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest">
                Posisi & Cabang
              </th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest">
                Status
              </th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-center">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredApps.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-orange-50/30 transition-colors group"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cafe-maroon text-white flex items-center justify-center font-black text-sm">
                      {app.applicant?.user?.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-cafe-maroon uppercase">
                        {app.applicant?.user?.name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">
                        {app.applicant?.user?.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700 uppercase">
                      {app.job_opening?.title}
                    </span>
                    <span className="text-[9px] text-cafe-orange font-bold uppercase italic">
                      {app.job_opening?.branch?.name}
                    </span>
                  </div>
                </td>
                <td className="p-5">
                  <span
                    className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest 
                    ${
                      app.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : app.status === "Interview"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="p-2 bg-cafe-orange text-white hover:bg-cafe-maroon transition-all shadow-md"
                  >
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL REVIEW */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 bg-cafe-maroon/40 backdrop-blur-sm z-100 flex items-center justify-center p-6">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col shadow-2xl border-t-8 border-cafe-orange"
            >
              {/* MODAL HEADER */}
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-cafe-maroon" size={20} />
                  <div>
                    <h3 className="font-black text-cafe-maroon uppercase tracking-tighter leading-none">
                      Review Aplikasi Lamaran
                    </h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                      Kandidat: {selectedApp.applicant?.user?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-cafe-maroon transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="flex-1 overflow-y-auto p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* SISI KIRI: DOCUMENTS */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-cafe-maroon uppercase mb-6 flex items-center gap-2 border-b-2 border-cafe-orange pb-2 w-fit">
                      <FileText size={14} /> Berkas Administrasi
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                      {selectedApp.applicant?.documents?.length > 0 ? (
                        selectedApp.applicant.documents.map((doc) => {
                          // Menggunakan kolom document_type langsung dari database
                          // Gunakan pembersihan sederhana jika datanya null
                          const titleFromDb = doc.document_type || "Dokumen";

                          return (
                            <a
                              key={doc.id}
                              href={`http://localhost:8000/storage/${doc.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-100 hover:border-cafe-orange hover:bg-white transition-all group shadow-sm"
                            >
                              <div className="flex items-center gap-4">
                                {/* Label Badge */}
                                <div className="px-3 py-2 bg-cafe-maroon text-white text-[10px] font-black tracking-widest min-w-17.5 text-center shadow-md uppercase">
                                  {titleFromDb}
                                </div>

                                <div className="flex flex-col">
                                  {/* Judul sesuai isi kolom database */}
                                  <span className="text-[12px] font-black text-cafe-maroon uppercase tracking-tight">
                                    FILE: {titleFromDb}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-bold uppercase italic tracking-tighter">
                                    Klik untuk melihat detail berkas
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[8px] font-black text-cafe-orange uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                  Lihat File
                                </span>
                                <ExternalLink
                                  size={16}
                                  className="text-gray-300 group-hover:text-cafe-orange transition-colors"
                                />
                              </div>
                            </a>
                          );
                        })
                      ) : (
                        <div className="p-10 border-2 border-dashed border-gray-100 text-center rounded-md">
                          <p className="text-[10px] font-bold text-gray-400 uppercase italic">
                            Kandidat belum mengunggah berkas apapun.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SISI KANAN: STATUS & ACTION */}
                  <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
                    <h4 className="text-[11px] font-black text-cafe-maroon uppercase mb-6 flex items-center gap-2 border-b-2 border-cafe-orange pb-2 w-fit">
                      <AlertCircle size={14} /> Tindakan HRD
                    </h4>
                    <form onSubmit={handleUpdateStatus} className="space-y-6">
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                          Update Status Lamaran
                        </label>
                        <select
                          name="status"
                          defaultValue={selectedApp.status}
                          className="w-full border-2 border-gray-200 p-3 text-[11px] font-black uppercase outline-none focus:border-cafe-maroon bg-white cursor-pointer transition-all"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                          Catatan Untuk Pelamar
                        </label>
                        <textarea
                          name="hrd_notes"
                          defaultValue={selectedApp.hrd_notes}
                          placeholder="Tulis instruksi atau pesan untuk kandidat..."
                          className="w-full border-2 border-gray-200 p-4 text-[11px] font-bold h-40 outline-none focus:border-cafe-maroon bg-white resize-none transition-all"
                        ></textarea>
                        <p className="text-[8px] text-gray-400 font-bold uppercase mt-2 italic">
                          *Catatan ini akan muncul di dashboard pelamar.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="w-full bg-cafe-maroon text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cafe-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-cafe-maroon/20"
                      >
                        {updateLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                        {updateLoading
                          ? "Memproses Data..."
                          : "Finalisasi & Kirim Update"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
