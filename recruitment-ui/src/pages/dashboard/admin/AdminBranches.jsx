import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // State untuk menangani Mode Edit & Form Input
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // 1. AMBIL DATA CABANG DARI BACKEND
  const fetchBranches = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/branches",
        config,
      );
      setBranches(res.data.data || res.data);
    } catch (err) {
      console.error("Gagal mengambil data cabang:", err);
      Swal.fire("Gagal!", "Tidak dapat memuat data cabang sekolah.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // 2. LOGIKA SIMPAN (TAMBAH / UPDATE)
  const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    setBtnLoading(true);

    // Kapitalisasi dilakukan di sini saat submit, agar kursor tidak melompat saat mengetik
    const payload = {
      name: name.toUpperCase(),
      location,
    };

    try {
      if (isEditMode) {
        // Mode Update
        await axios.put(
          `http://localhost:8000/api/admin/branches/${editId}`,
          payload,
          config,
        );
        Swal.fire({
          title: "Diperbarui!",
          text: "Data cabang berhasil diubah.",
          icon: "success",
          confirmButtonColor: "#4a0404",
        });
      } else {
        // Mode Tambah Baru
        await axios.post(
          "http://localhost:8000/api/admin/branches",
          payload,
          config,
        );
        Swal.fire({
          title: "Berhasil!",
          text: "Cabang baru berhasil ditambahkan.",
          icon: "success",
          confirmButtonColor: "#4a0404",
        });
      }

      resetForm();
      fetchBranches();
    } catch (err) {
      const msg = err.response?.data?.message || "Terjadi kesalahan sistem.";
      Swal.fire({
        title: "Gagal Menyimpan!",
        text: msg,
        icon: "error",
        confirmButtonColor: "#4a0404",
      });
    } finally {
      setBtnLoading(false);
    }
  };

  // 3. AKTIFKAN MODE EDIT SAAT TOMBOL DIKLIK
  const startEdit = (branch) => {
    setIsEditMode(true);
    setEditId(branch.id);
    setName(branch.name);
    setLocation(branch.location);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll halus ke atas menuju form
  };

  // 4. RESET FORM KE SEMULA
  const resetForm = () => {
    setIsEditMode(false);
    setEditId(null);
    setName("");
    setLocation("");
  };

  // 5. LOGIKA HAPUS CABANG
  const handleDeleteBranch = (id, branchName) => {
    Swal.fire({
      title: `<span style="font-size: 16px; font-weight: 900; text-transform: uppercase; color: #4a0404;">Hapus Cabang ${branchName}?</span>`,
      text: "Pastikan tidak ada lowongan aktif yang menggunakan cabang ini sebelum menghapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4a0404",
      confirmButtonText: "YA, HAPUS",
      cancelButtonText: "BATAL",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8000/api/admin/branches/${id}`,
            config,
          );
          fetchBranches();
          Swal.fire("Terhapus!", "Data cabang berhasil dihapus.", "success");
        } catch {
          Swal.fire(
            "Gagal!",
            "Cabang gagal dihapus, kemungkinan masih terikat data lowongan.",
            "error",
          );
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cafe-maroon" size={32} />
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-cafe-orange"></div>
          <span className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.4em]">
            Infrastruktur Lokasi
          </span>
        </div>
        <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
          Branch <span className="text-cafe-orange">Management</span>
        </h2>
      </header>

      {/* DYNAMIC FORM (TAMBAH / EDIT) */}
      <div
        className={`bg-white p-8 border-2 ${isEditMode ? "border-cafe-orange" : "border-gray-100"} shadow-sm mb-8 transition-all duration-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-cafe-maroon uppercase text-xs tracking-wider">
            {isEditMode ? "Edit Data Cabang Sekolah" : "Tambah Cabang Baru"}
          </h3>
          {isEditMode && (
            <button
              onClick={resetForm}
              className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
            >
              <X size={14} /> Batal Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSaveBranch}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)} // Mengalir normal tanpa interupsi re-render kursor
            type="text"
            className="flex-1 border-2 border-gray-100 p-3 text-xs font-bold outline-none focus:border-cafe-maroon bg-gray-50/50 uppercase" // Class uppercase Tailwind menjaga visual ketikan
            placeholder="NAMA SEKOLAH (CONTOH: SMA EC SEMARANG)"
            required
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            className="flex-1 border-2 border-gray-100 p-3 text-xs font-bold outline-none focus:border-cafe-maroon bg-gray-50/50"
            placeholder="ALAMAT / LOKASI SINGKAT"
            required
          />
          <button
            disabled={btnLoading}
            type="submit"
            className={`${
              isEditMode ? "bg-cafe-maroon" : "bg-cafe-orange"
            } text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all min-w-35 disabled:opacity-50`}
          >
            {btnLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : isEditMode ? (
              <RefreshCw size={14} />
            ) : (
              <Plus size={14} />
            )}
            {isEditMode ? "Perbarui" : "Simpan"}
          </button>
        </form>
      </div>

      {/* GRID DAFTAR CABANG */}
      <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-4">
        Daftar Cabang Aktif ({branches.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.length > 0 ? (
          branches.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 border border-gray-100 shadow-sm border-l-4 border-l-cafe-maroon flex flex-col justify-between group hover:border-cafe-orange hover:shadow-md transition-all duration-300"
            >
              <div>
                <h4 className="font-black text-cafe-maroon uppercase text-sm tracking-tight mb-1">
                  {b.name}
                </h4>
                <p className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                  <MapPin size={13} className="text-cafe-orange" /> {b.location}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2 border-t border-gray-50 mt-6 pt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(b)}
                  className="p-2 text-gray-400 hover:text-cafe-maroon hover:bg-gray-50 rounded transition-all"
                  title="Edit Cabang"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteBranch(b.id, b.name)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                  title="Hapus Cabang"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-10 text-center border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-xs">
            Belum ada cabang sekolah yang terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}
