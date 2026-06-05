import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Trash2, UserPlus, Mail, X, Loader2, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { Spinner } from "../../../components/SkeletonCard";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/users", config);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Gagal!", text: "Tidak dapat memuat data pengguna.", icon: "error", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    try {
      await axios.post("http://localhost:8000/api/admin/users", payload, config);
      Swal.fire({ title: "Berhasil!", text: "User baru berhasil didaftarkan.", icon: "success", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      Swal.fire({ title: "Gagal Menyimpan!", text: err.response?.data?.message || "Terjadi kesalahan.", icon: "error", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
    } finally { setBtnLoading(false); }
  };

  const handleDeleteUser = (id, name) => {
    Swal.fire({
      title: `<span style="font-size: 16px; font-weight: 900; text-transform: uppercase; color: #7E262E;">Hapus Akses ${name}?</span>`,
      text: "Pengguna ini tidak akan bisa login lagi.", icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", cancelButtonColor: "#7E262E", confirmButtonText: "HAPUS PERMANEN", cancelButtonText: "BATAL",
      customClass: { popup: "rounded-2xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/admin/users/${id}`, config);
          fetchUsers();
          Swal.fire({ title: "Terhapus!", text: "Akses pengguna berhasil dihapus.", icon: "success", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
        } catch {
          Swal.fire({ title: "Gagal!", text: "Tidak dapat menghapus user ini.", icon: "error", confirmButtonColor: "#7E262E", customClass: { popup: "rounded-2xl" } });
        }
      }
    });
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="p-8 md:p-10 bg-cafe-cream min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-cafe-orange rounded-full" />
            <span className="text-[9px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Otoritas Infrastruktur</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter">User <span className="text-cafe-orange">Management</span></h2>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-cafe-maroon text-white px-6 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cafe-orange transition-all shadow-md">
          <UserPlus size={15} /> Tambah User
        </button>
      </header>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cafe-cream border-b border-gray-100 text-[9px] font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="p-5">Nama &amp; Email</th>
              <th className="p-5">Role / Hak Akses</th>
              <th className="p-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-cafe-cream/50 transition-all">
                <td className="p-5">
                  <p className="font-black text-cafe-maroon uppercase text-sm tracking-tight">{user.name}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5"><Mail size={11} /> {user.email}</p>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg shadow-sm ${
                    user.role === "admin" ? "bg-purple-100 text-purple-700" :
                    user.role === "hrd" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                  }`}>{user.role}</span>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => handleDeleteUser(user.id, user.name)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={17} /></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="p-10 text-center text-gray-400 font-bold uppercase text-[10px]">Tidak ada data pengguna ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-cafe-maroon/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-b-4 border-cafe-orange transform transition-all">
            <div className="p-6 border-b flex justify-between items-center bg-cafe-cream rounded-t-2xl">
              <h3 className="font-black text-cafe-maroon uppercase tracking-widest text-[11px]">Registrasi User Baru</h3>
              <button onClick={() => setShowModal(false)}><X size={19} className="text-gray-400 hover:text-red-500 transition-colors" /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-8 space-y-5">
              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Nama Lengkap</label>
                <input name="name" type="text" required placeholder="CONTOH: BUDI SANTOSO"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 text-[11px] font-bold outline-none focus:border-cafe-maroon bg-cafe-cream/50" />
              </div>
              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Alamat Email</label>
                <input name="email" type="email" required placeholder="budi@sekolah.sch.id"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 text-[11px] font-bold outline-none focus:border-cafe-maroon bg-cafe-cream/50" />
              </div>
              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Password Akun</label>
                <input name="password" type="password" required placeholder="••••••••"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 text-[11px] font-bold outline-none focus:border-cafe-maroon bg-cafe-cream/50" />
              </div>
              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Tentukan Role</label>
                <select name="role"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 text-[11px] font-bold outline-none focus:border-cafe-maroon bg-white" required>
                  <option value="hrd">HRD (TIM MANAJEMEN REKRUTMEN)</option>
                  <option value="applicant">PELAMAR (AKSES PORTAL PELAMAR)</option>
                  <option value="admin">ADMIN (SUPER USER/KONTROL PENUH)</option>
                </select>
              </div>
              <button type="submit" disabled={btnLoading}
                className="w-full bg-cafe-maroon text-white py-4 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] hover:bg-cafe-orange transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50">
                {btnLoading ? <Loader2 className="animate-spin" size={15} /> : <ShieldCheck size={15} />}
                Simpan User Baru
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
