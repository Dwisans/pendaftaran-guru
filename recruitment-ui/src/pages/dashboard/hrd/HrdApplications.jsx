import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, FileText, ExternalLink, Loader2, ChevronRight, X, CheckCircle2, AlertCircle, Briefcase } from "lucide-react";
import axios from "axios";
import { Spinner } from "../../../components/SkeletonCard";

export default function HrdApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/hrd/applications", { headers: { Authorization: `Bearer ${token}` } });
      setApplications(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData(e.target);
    const payload = { status: formData.get("status"), hrd_notes: formData.get("hrd_notes") };
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:8000/api/hrd/applications/${selectedApp.id}/status`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedApp(null);
      fetchApplications();
    } catch { alert("Gagal memperbarui status."); }
    finally { setUpdateLoading(false); }
  };

  const filteredApps = applications.filter(app =>
    app.applicant?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.job_opening?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-cafe-cream"><Spinner /></div>;

  return (
    <div className="p-8 md:p-10 bg-cafe-cream min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-cafe-orange rounded-full" />
            <span className="text-[9px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Recruitment Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter">Data <span className="text-cafe-orange">Lamaran</span></h2>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Cari Nama atau Posisi..."
            className="pl-11 pr-5 py-3 bg-white border-2 border-gray-100 rounded-lg w-full md:w-72 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cafe-maroon transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border-b-4 border-cafe-maroon">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-cafe-maroon text-white">
              <th className="p-5 text-[9px] font-bold uppercase tracking-widest">Kandidat</th>
              <th className="p-5 text-[9px] font-bold uppercase tracking-widest">Posisi &amp; Cabang</th>
              <th className="p-5 text-[9px] font-bold uppercase tracking-widest">Status</th>
              <th className="p-5 text-[9px] font-bold uppercase tracking-widest text-center">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cafe-maroon text-white flex items-center justify-center font-black text-sm rounded-lg">
                      {app.applicant?.user?.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-cafe-maroon uppercase">{app.applicant?.user?.name}</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase">{app.applicant?.user?.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="text-[11px] font-bold text-gray-700 uppercase">{app.job_opening?.title}</span>
                  <p className="text-[8px] text-cafe-orange font-bold uppercase italic">{app.job_opening?.branch?.name}</p>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border ${
                    app.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    app.status === "Rejected" ? "bg-red-50 text-red-600 border-red-100" :
                    app.status === "Interview" ? "bg-purple-50 text-purple-600 border-purple-100" :
                    app.status === "Under Review" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    "bg-cafe-orange/10 text-cafe-orange border-cafe-orange/20"
                  }`}>{app.status}</span>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => setSelectedApp(app)}
                    className="p-2 bg-cafe-orange text-white hover:bg-cafe-maroon transition-all shadow-md rounded-lg">
                    <ChevronRight size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 bg-cafe-maroon/40 backdrop-blur-sm z-100 flex items-center justify-center p-6">
            <Motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-2xl border-t-4 border-cafe-orange">
              <div className="p-6 border-b flex justify-between items-center bg-cafe-cream rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-cafe-maroon" size={18} />
                  <div>
                    <h3 className="font-black text-cafe-maroon uppercase tracking-tighter text-sm">Review Aplikasi Lamaran</h3>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Kandidat: {selectedApp.applicant?.user?.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-cafe-maroon transition-colors p-2">
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-cafe-maroon uppercase mb-5 flex items-center gap-2 border-b-2 border-cafe-orange pb-2 w-fit">
                      <FileText size={13} /> Berkas Administrasi
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedApp.applicant?.documents?.length > 0 ? (
                        selectedApp.applicant.documents.map((doc) => (
                          <a key={doc.id} href={`http://localhost:8000/storage/${doc.file_path}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-cafe-cream border-2 border-gray-100 hover:border-cafe-orange hover:bg-white transition-all group rounded-xl shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="px-3 py-2 bg-cafe-maroon text-white text-[9px] font-black tracking-widest rounded-lg shadow-md uppercase">
                                {doc.document_type || "Dokumen"}
                              </div>
                              <div>
                                <span className="text-[11px] font-black text-cafe-maroon uppercase tracking-tight">FILE: {doc.document_type}</span>
                                <p className="text-[8px] text-gray-400 font-bold uppercase italic">Klik untuk melihat detail</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[7px] font-black text-cafe-orange uppercase opacity-0 group-hover:opacity-100 transition-all">Lihat</span>
                              <ExternalLink size={14} className="text-gray-300 group-hover:text-cafe-orange transition-colors" />
                            </div>
                          </a>
                        ))
                      ) : (
                        <div className="p-10 border-2 border-dashed border-gray-100 text-center rounded-xl">
                          <p className="text-[9px] font-bold text-gray-400 uppercase italic">Kandidat belum mengunggah berkas.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-cafe-cream p-8 rounded-xl border border-gray-100">
                    <h4 className="text-[10px] font-black text-cafe-maroon uppercase mb-5 flex items-center gap-2 border-b-2 border-cafe-orange pb-2 w-fit">
                      <AlertCircle size={13} /> Tindakan HRD
                    </h4>
                    <form onSubmit={handleUpdateStatus} className="space-y-5">
                      <div>
                        <label className="block text-[8px] font-black text-gray-400 uppercase mb-2 tracking-widest">Update Status Lamaran</label>
                        <select name="status" defaultValue={selectedApp.status}
                          className="w-full border-2 border-gray-200 rounded-lg p-3.5 text-[10px] font-black uppercase outline-none focus:border-cafe-maroon bg-white cursor-pointer transition-all">
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-gray-400 uppercase mb-2 tracking-widest">Catatan Untuk Pelamar</label>
                        <textarea name="hrd_notes" defaultValue={selectedApp.hrd_notes}
                          placeholder="Tulis instruksi atau pesan untuk kandidat..."
                          className="w-full border-2 border-gray-200 rounded-lg p-4 text-[10px] font-bold h-36 outline-none focus:border-cafe-maroon bg-white resize-none transition-all" />
                        <p className="text-[7px] text-gray-400 font-bold uppercase mt-2 italic">*Catatan ini akan muncul di dashboard pelamar.</p>
                      </div>
                      <button type="submit" disabled={updateLoading}
                        className="w-full bg-cafe-maroon text-white py-4 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-cafe-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-cafe-maroon/20">
                        {updateLoading ? <Loader2 className="animate-spin" size={15} /> : <CheckCircle2 size={15} />}
                        {updateLoading ? "Memproses..." : "Finalisasi & Kirim Update"}
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
