import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Building2, Briefcase, FileText, Loader2 } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Gagal memuat statistik admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-cafe-maroon" size={32} />
    </div>
  );

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-cafe-orange"></div>
          <span className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Sistem Rekrutmen</span>
        </div>
        <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
          Admin <span className="text-cafe-orange">Overview</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Pengguna", value: stats?.total_users, icon: <Users size={24}/>, color: "text-blue-600" },
          { label: "Cabang Sekolah", value: stats?.total_branches, icon: <Building2 size={24}/>, color: "text-orange-600" },
          { label: "Lowongan Dibuka", value: stats?.total_jobs, icon: <Briefcase size={24}/>, color: "text-amber-700" },
          { label: "Berkas Lamaran", value: stats?.total_applications, icon: <FileText size={24}/>, color: "text-green-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-cafe-orange transition-all duration-300">
            <div className={`${stat.color} mb-4`}>{stat.icon}</div>
            <div>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-cafe-maroon tracking-tight">{stat.value || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}