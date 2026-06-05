import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapPin, Plus, Trash2, Edit3, Loader2, RefreshCw, X } from "lucide-react";
import Swal from "sweetalert2";
import { Spinner } from "../../../components/SkeletonCard";

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBranches = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/branches", config);
      setBranches(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Gagal!", text: "Tidak dapat memuat data cabang.", icon: "error", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBranches(); }, [fetchBranches]);

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;
    setBtnLoading(true);
    const payload = { name: name.toUpperCase(), location };
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8000/api/admin/branches/${editId}`, payload, config);
        Swal.fire({ title: "Diperbarui!", text: "Data cabang berhasil diubah.", icon: "success", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
      } else {
        await axios.post("http://localhost:8000/api/admin/branches", payload, config);
        Swal.fire({ title: "Berhasil!", text: "Cabang baru berhasil ditambahkan.", icon: "success", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
      }
      resetForm();
      fetchBranches();
    } catch (err) {
      Swal.fire({ title: "Gagal!", text: err.response?.data?.message || "Terjadi kesalahan.", icon: "error", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
    } finally { setBtnLoading(false); }
  };

  const startEdit = (branch) => {
    setIsEditMode(true);
    setEditId(branch.id);
    setName(branch.name);
    setLocation(branch.location);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => { setIsEditMode(false); setEditId(null); setName(""); setLocation(""); };

  const handleDeleteBranch = (id, branchName) => {
    Swal.fire({
      title: `<span style="font-size: 15px; font-weight: 900; text-transform: uppercase; color: #7E262E;">Hapus Cabang ${branchName}?</span>`,
      text: "Pastikan tidak ada lowongan aktif yang menggunakan cabang ini.", icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", cancelButtonColor: "#7E262E", confirmButtonText: "YA, HAPUS", cancelButtonText: "BATAL",
      customClass: { popup: "rounded-2xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/admin/branches/${id}`, config);
          fetchBranches();
          Swal.fire({ title: "Terhapus!", text: "Data cabang berhasil dihapus.", icon: "success", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
        } catch {
          Swal.fire({ title: "Gagal!", text: "Cabang masih terikat data lowongan.", icon: "error", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
        }
      }
    });
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="p-8 md:p-10 bg-cafe-cream min-h-screen">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-0.5 bg-cafe-orange rounded-full" />
          <span className="text-[9px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Infrastruktur Lokasi</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter">Branch <span className="text-cafe-orange">Management</span></h2>
      </header>

      <div className={`bg-white rounded-xl p-8 border-2 ${isEditMode ? "border-cafe-orange" : "border-gray-100"} shadow-sm mb-8 transition-all`}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-black text-cafe-maroon uppercase text-[11px] tracking-wider">
            {isEditMode ? "Edit Data Cabang Sekolah" : "Tambah Cabang Baru"}
          </h3>
          {isEditMode && (
            <button onClick={resetForm} className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">
              <X size={13} /> Batal Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSaveBranch} className="flex flex-col md:flex-row gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} type="text"
            className="flex-1 border-2 border-gray-100 rounded-lg p-3.5 text-[11px] font-bold outline-none focus:border-cafe-maroon bg-cafe-cream/50 uppercase"
            placeholder="NAMA SEKOLAH (CONTOH: SMA EC SEMARANG)" required />
          <input value={location} onChange={(e) => setLocation(e.target.value)} type="text"
            className="flex-1 border-2 border-gray-100 rounded-lg p-3.5 text-[11px] font-bold outline-none focus:border-cafe-maroon bg-cafe-cream/50"
            placeholder="ALAMAT / LOKASI SINGKAT" required />
          <button type="submit" disabled={btnLoading}
            className={`${isEditMode ? "bg-cafe-maroon" : "bg-cafe-orange"} text-white px-8 py-3.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all min-w-35 disabled:opacity-50`}>
            {btnLoading ? <Loader2 className="animate-spin" size={13} /> : isEditMode ? <RefreshCw size={13} /> : <Plus size={13} />}
            {isEditMode ? "Perbarui" : "Simpan"}
          </button>
        </form>
      </div>

      <h3 className="font-black text-gray-400 uppercase text-[9px] tracking-[0.2em] mb-4">Daftar Cabang Aktif ({branches.length})</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.length > 0 ? branches.map((b) => (
          <div key={b.id}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-cafe-maroon flex flex-col justify-between group hover:border-cafe-orange hover:shadow-md transition-all">
            <div>
              <h4 className="font-black text-cafe-maroon uppercase text-sm tracking-tight mb-1">{b.name}</h4>
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5 font-medium">
                <MapPin size={12} className="text-cafe-orange" /> {b.location}
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-50 mt-5 pt-4 opacity-40 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(b)}
                className="p-2 text-gray-400 hover:text-cafe-maroon hover:bg-cafe-cream rounded-lg transition-all" title="Edit Cabang">
                <Edit3 size={15} />
              </button>
              <button onClick={() => handleDeleteBranch(b.id, b.name)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus Cabang">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full bg-white p-10 text-center rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
            Belum ada cabang sekolah yang terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}
