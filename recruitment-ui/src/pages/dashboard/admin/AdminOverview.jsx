import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import { Users, Building2, Briefcase, FileText, UserPlus, Calendar, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Spinner } from "../../../components/SkeletonCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/stats", { headers }),
          axios.get("http://localhost:8000/api/admin/users", { headers }).catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data);
        setRecentUsers(Array.isArray(usersRes.data) ? usersRes.data.slice(0, 5) : []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Spinner /></div>;

  const cards = [
    { label: "Total Pengguna", value: stats?.total_users, icon: Users, color: "bg-blue-600" },
    { label: "Cabang Sekolah", value: stats?.total_branches, icon: Building2, color: "bg-cafe-orange" },
    { label: "Lowongan Dibuka", value: stats?.total_jobs, icon: Briefcase, color: "bg-amber-700" },
    { label: "Berkas Lamaran", value: stats?.total_applications, icon: FileText, color: "bg-emerald-600" },
  ];

  const getRoleBadge = (role) => {
    const r = role?.toLowerCase();
    if (r === "admin") return "bg-purple-100 text-purple-700";
    if (r === "hrd") return "bg-blue-100 text-blue-700";
    return "bg-cafe-orange/10 text-cafe-orange";
  };

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-0.5 bg-cafe-orange rounded-full" />
          <span className="text-[9px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Sistem Rekrutmen</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
          Admin <span className="text-cafe-orange">Overview</span>
        </h2>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Motion.div key={card.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:border-cafe-orange hover:shadow-md transition-all duration-300">
              <div className={`w-10 h-10 ${card.color} text-white flex items-center justify-center mb-4 rounded-lg shadow-lg shadow-black/5`}>
                <Icon size={18} />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-3xl font-black text-cafe-maroon">{card.value || 0}</p>
            </Motion.div>
          );
        })}
      </div>

      {/* Recent Users + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-[11px] font-black text-cafe-maroon uppercase tracking-widest flex items-center gap-2">
              <UserPlus size={14} className="text-cafe-orange" /> Pengguna Terdaftar
            </h3>
            <Link to="/dashboard/admin/users" className="text-[9px] font-black text-cafe-orange uppercase tracking-widest flex items-center gap-1.5 hover:underline transition-all">
              Kelola <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentUsers.length > 0 ? recentUsers.map((user, i) => (
              <div key={user.id || i} className="flex items-center justify-between p-3 rounded-lg hover:bg-cafe-cream transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cafe-maroon/5 flex items-center justify-center text-cafe-maroon font-black text-xs">
                    {user.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-cafe-maroon uppercase">{user.name}</p>
                    <p className="text-[7px] text-gray-400 font-bold">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-wider rounded ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </div>
            )) : (
              <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                <Users size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Belum ada data pengguna.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-cafe-maroon rounded-xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Calendar size={36} className="text-white/10 mb-4" />
              <h4 className="text-lg font-black uppercase tracking-tight mb-2">{new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</h4>
              <p className="text-[9px] font-medium text-white/50 uppercase tracking-widest leading-relaxed">
                Pantau perkembangan sistem rekrutmen secara berkala.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-cafe-maroon uppercase tracking-widest mb-4">Akses Cepat</h4>
            <div className="space-y-3">
              <Link to="/dashboard/admin/users"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-cafe-orange/30 hover:bg-cafe-cream transition-all">
                <Users size={16} className="text-cafe-orange" />
                <span className="text-[9px] font-black uppercase text-cafe-maroon">Kelola Pengguna</span>
              </Link>
              <Link to="/dashboard/admin/branches"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-cafe-orange/30 hover:bg-cafe-cream transition-all">
                <Building2 size={16} className="text-cafe-orange" />
                <span className="text-[9px] font-black uppercase text-cafe-maroon">Atur Cabang</span>
              </Link>
              <Link to="/dashboard/admin/report"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-cafe-orange/30 hover:bg-cafe-cream transition-all">
                <FileText size={16} className="text-cafe-orange" />
                <span className="text-[9px] font-black uppercase text-cafe-maroon">Cetak Laporan</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
