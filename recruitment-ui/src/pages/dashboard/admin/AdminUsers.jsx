import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, UserPlus, Mail, X, Loader2, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // 1. AMBIL DATA USERS DARI DATABASE
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/users", config);
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil data users:", err);
      Swal.fire("Gagal!", "Tidak dapat memuat data pengguna.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. LOGIKA TAMBAH USER (SUBMIT FORM)
  const handleAddUser = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      await axios.post("http://localhost:8000/api/admin/users", payload, config);
      
      Swal.fire({
        title: "Berhasil!",
        text: "User baru telah berhasil didaftarkan.",
        icon: "success",
        confirmButtonColor: "#4a0404", // Cafe Maroon
      });

      setShowModal(false); // Tutup modal
      fetchUsers(); // Refresh data tabel
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan pada server.";
      Swal.fire({
        title: "Gagal Menyimpan!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#4a0404",
      });
    } finally {
      setBtnLoading(false);
    }
  };

  // 3. LOGIKA HAPUS USER
  const handleDeleteUser = (id, name) => {
    Swal.fire({
      title: `<span style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #4a0404;">Hapus Akses ${name}?</span>`,
      text: "Pengguna ini tidak akan bisa login lagi ke dalam sistem rekrutmen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4a0404",
      confirmButtonText: "HAPUS PERMANEN",
      cancelButtonText: "BATAL",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/admin/users/${id}`, config);
          fetchUsers(); // Refresh tabel setelah hapus
          Swal.fire("Terhapus!", "Akses pengguna berhasil dihapus.", "success");
        } catch{
          Swal.fire("Gagal!", "Tidak dapat menghapus user ini.", "error");
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
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-cafe-orange"></div>
            <span className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.4em]">
              Otoritas Infrastruktur
            </span>
          </div>
          <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
            User <span className="text-cafe-orange">Management</span>
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cafe-maroon text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cafe-orange transition-all shadow-md"
        >
          <UserPlus size={16} /> Tambah User
        </button>
      </header>

      {/* TABEL DATA USERS */}
      <div className="bg-white border-2 border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b-2 border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="p-6">Nama & Email</th>
              <th className="p-6">Role / Hak Akses</th>
              <th className="p-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-all"
                >
                  <td className="p-6">
                    <p className="font-black text-cafe-maroon uppercase text-sm tracking-tight">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} /> {user.email}
                    </p>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "hrd"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-400 font-bold uppercase text-xs">
                  Tidak ada data pengguna lain ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL FORM TAMBAH USER */}
      {showModal && (
        <div className="fixed inset-0 bg-cafe-maroon/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md shadow-2xl border-b-8 border-cafe-orange transform transition-all">
            {/* Header Modal */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-cafe-maroon uppercase tracking-widest text-xs">
                Registrasi User Baru
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} className="text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Isi Form */}
            <form onSubmit={handleAddUser} className="p-8 space-y-5">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full border-2 border-gray-100 p-3 text-xs font-bold outline-none focus:border-cafe-maroon bg-gray-50/50"
                  required
                  placeholder="CONTOH: BUDI SANTOSO"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">
                  Alamat Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full border-2 border-gray-100 p-3 text-xs font-bold outline-none focus:border-cafe-maroon bg-gray-50/50"
                  required
                  placeholder="budi@sekolah.sch.id"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">
                  Password Akun
                </label>
                <input
                  name="password"
                  type="password"
                  className="w-full border-2 border-gray-100 p-3 text-xs font-bold outline-none focus:border-cafe-maroon bg-gray-50/50"
                  required
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">
                  Tentukan Tingkat Akses (Role)
                </label>
                <select
                  name="role"
                  className="w-full border-2 border-gray-100 p-3 text-xs font-bold outline-none focus:border-cafe-maroon bg-white"
                  required
                >
                  <option value="hrd">HRD (TIM MANAJEMEN REKRUTMEN)</option>
                  <option value="applicant">PELAMAR (AKSES PORTAL PELAMAR)</option>
                  <option value="admin">ADMIN (SUPER USER/KONTROL PENUH)</option>
                </select>
              </div>

              {/* Tombol Simpan */}
              <button
                disabled={btnLoading}
                type="submit"
                className="w-full bg-cafe-maroon text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cafe-orange transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {btnLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <ShieldCheck size={16} />
                )}
                Simpan User Baru
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}