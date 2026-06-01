import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Plus,
  Search,
  Briefcase,
  MapPin,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Eye,
  FileText,
  Activity,
  Power,
  PowerOff,
} from "lucide-react";
import axios from "axios";

export default function HrdJobs() {
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // State untuk Tab Filter

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [jobsRes, branchRes] = await Promise.all([
        axios.get("http://localhost:8000/api/job-openings", config),
        axios.get("http://localhost:8000/api/branches", config),
      ]);

      const jobData = Array.isArray(jobsRes.data)
        ? jobsRes.data
        : jobsRes.data.data;
      setJobs(jobData || []);
      setBranches(branchRes.data.data || branchRes.data || []);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = (id, currentStatus) => {
    Swal.fire({
      title: `<span style="font-family: 'Inter', sans-serif; font-weight: 900; text-transform: uppercase; font-size: 18px; color: #4a0404;">Ubah Status Lowongan?</span>`,
      html: `<p style="font-size: 12px; color: #666; font-weight: 700; text-transform: uppercase;">Lowongan akan diubah menjadi ${currentStatus === "open" ? "TUTUP" : "AKTIF"}</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4a0404",
      cancelButtonColor: "#d33",
      confirmButtonText: "YA, UBAH!",
      cancelButtonText: "BATAL",
      background: "#fff",
      borderRadius: "0",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.patch(
            `http://localhost:8000/api/hrd/jobs/${id}/toggle`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchData();
          Swal.fire({
            title: "BERHASIL!",
            text: "Status lowongan telah diperbarui.",
            icon: "success",
            confirmButtonColor: "#4a0404",
          });
        } catch {
          Swal.fire("Gagal!", "Terjadi kesalahan saat mengubah status.", "error");
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: `<span style="font-family: 'Inter', sans-serif; font-weight: 900; text-transform: uppercase; font-size: 18px; color: #4a0404;">Hapus Lowongan?</span>`,
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4a0404",
      confirmButtonText: "HAPUS SEKARANG",
      cancelButtonText: "KEMBALI",
      borderRadius: "0",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:8000/api/hrd/jobs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchData();
          Swal.fire({
            title: "TERHAPUS!",
            text: "Lowongan telah dihapus dari sistem.",
            icon: "success",
            confirmButtonColor: "#4a0404",
          });
        } catch {
          Swal.fire("Gagal!", "Lowongan tidak bisa dihapus karena memiliki data pelamar aktif.", "error");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/hrd/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchData();
    } catch {
      alert("Gagal menambahkan lowongan.");
    } finally {
      setBtnLoading(false);
    }
  };

  // LOGIKA FILTERING GABUNGAN (Pencarian + Status)
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        const matchesSearch =
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.branch?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === "all" || job.status === filterStatus;

        return matchesSearch && matchesStatus;
      })
    : [];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cafe-maroon" size={40} />
      </div>
    );

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-cafe-orange"></div>
            <span className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.4em]">
              Career Management
            </span>
          </div>
          <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
            Manajemen <span className="text-cafe-orange">Lowongan</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari posisi atau cabang..."
              className="pl-12 pr-6 py-3 bg-white border-2 border-gray-100 text-[11px] font-black uppercase outline-none focus:border-cafe-maroon transition-all shadow-sm w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-cafe-maroon text-white px-8 py-3 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-cafe-orange transition-all shadow-lg"
          >
            <Plus size={18} /> Tambah Lowongan
          </button>
        </div>
      </header>

      {/* TAB FILTER STATUS */}
      <div className="flex items-center gap-4 mb-8 bg-white p-2 border-2 border-gray-100 w-fit shadow-sm">
        {[
          { id: "all", label: "Semua", count: jobs.length },
          { id: "open", label: "Aktif", count: jobs.filter((j) => j.status === "open").length },
          { id: "closed", label: "Tutup", count: jobs.filter((j) => j.status === "closed").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              filterStatus === tab.id
                ? "bg-cafe-maroon text-white shadow-lg"
                : "text-gray-400 hover:text-cafe-maroon"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white border-t-4 p-8 shadow-sm hover:shadow-2xl transition-all group relative ${
                job.status === "open" ? "border-cafe-maroon" : "border-gray-300 opacity-75"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-12 h-12 flex items-center justify-center shadow-inner ${
                    job.status === "open" ? "bg-gray-50 text-cafe-maroon" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Briefcase size={24} />
                </div>
                <span
                  className={`text-[8px] font-black px-3 py-1 uppercase tracking-widest shadow-sm ${
                    job.status === "open" ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
                  }`}
                >
                  {job.status === "open" ? "Aktif" : "Tutup"}
                </span>
              </div>

              <h3
                className={`text-xl font-black uppercase tracking-tighter mb-2 leading-tight min-h-12 ${
                  job.status === "open" ? "text-cafe-maroon" : "text-gray-400"
                }`}
              >
                {job.title}
              </h3>

              <div className="flex items-center gap-2 text-cafe-orange mb-6">
                <MapPin size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {job.branch?.name}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed italic">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-gray-100">
                <div className="flex flex-col">
                  <span className="text-lg font-black text-cafe-maroon leading-none">
                    {job.applications_count || 0}
                  </span>
                  <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">
                    Pendaftar
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(job.id, job.status)}
                    className={`p-2 transition-all shadow-sm ${
                      job.status === "open"
                        ? "text-gray-400 hover:text-orange-500 bg-gray-50"
                        : "text-white bg-emerald-500 hover:bg-emerald-600"
                    }`}
                    title={job.status === "open" ? "Tutup Lowongan" : "Buka Lowongan"}
                  >
                    {job.status === "open" ? <PowerOff size={18} /> : <Power size={18} />}
                  </button>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm bg-gray-50"
                    title="Hapus Lowongan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white border-4 border-dashed border-gray-100">
            <AlertTriangle className="mx-auto text-gray-200 mb-4" size={64} />
            <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">
              Tidak ada lowongan ditemukan
            </h4>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH LOWONGAN */}
      {showModal && (
        <div className="fixed inset-0 bg-cafe-maroon/60 backdrop-blur-md z-100 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl shadow-2xl overflow-hidden border-b-8 border-cafe-orange">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cafe-maroon text-white flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <h3 className="font-black text-cafe-maroon uppercase tracking-widest text-xs">
                  Buat Lowongan Baru
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-cafe-maroon"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                    Posisi / Jabatan
                  </label>
                  <input
                    name="title"
                    placeholder="Contoh: Guru Bahasa Inggris SMA"
                    className="w-full border-2 border-gray-100 p-4 text-[12px] font-bold outline-none focus:border-cafe-maroon bg-gray-50 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                    Cabang Sekolah
                  </label>
                  <select
                    name="branch_id"
                    className="w-full border-2 border-gray-100 p-4 text-[12px] font-bold outline-none focus:border-cafe-maroon bg-gray-50 focus:bg-white transition-all cursor-pointer"
                    required
                  >
                    <option value="">Pilih Cabang Penempatan...</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                    Deskripsi Pekerjaan & Durasi
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Sebutkan deskripsi singkat dan batas waktu di sini (Contoh: Dibuka s.d 30 April)..."
                    className="w-full border-2 border-gray-100 p-4 text-[12px] font-bold outline-none focus:border-cafe-maroon bg-gray-50 focus:bg-white transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                    Persyaratan (Requirements)
                  </label>
                  <textarea
                    name="requirements"
                    rows="3"
                    placeholder="Tulis persyaratan utama kandidat..."
                    className="w-full border-2 border-gray-100 p-4 text-[12px] font-bold outline-none focus:border-cafe-maroon bg-gray-50 focus:bg-white transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-cafe-maroon text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-cafe-orange transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {btnLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                {btnLoading ? "Sedang Memproses..." : "Publikasikan Lowongan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}