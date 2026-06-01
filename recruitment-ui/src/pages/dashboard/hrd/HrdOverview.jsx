import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckCircle, 
  Loader2, 
  Clock, 
  ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HrdOverview() {
  const [data, setData] = useState({ stats: null, recentApps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Kita ambil data statistik dan data lamaran sekaligus
        const [statsRes, appsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/internal/reports", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8000/api/hrd/applications", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setData({
          stats: statsRes.data.stats,
          recentApps: appsRes.data.data.slice(0, 5) // Ambil 5 terbaru saja
        });
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-cafe-maroon" size={40} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Menyiapkan Data...</p>
      </div>
    </div>
  );

  const cards = [
    { title: "Total Pelamar", value: data.stats?.total_applicants || 0, icon: <Users size={20} />, color: "bg-cafe-maroon" },
    { title: "Total Lamaran", value: data.stats?.total_applications || 0, icon: <Briefcase size={20} />, color: "bg-cafe-orange" },
    { title: "Perlu Review", value: data.stats?.pending || 0, icon: <Clock size={20} />, color: "bg-amber-500" },
    { title: "Diterima", value: data.stats?.accepted || 0, icon: <CheckCircle size={20} />, color: "bg-emerald-600" },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-cafe-orange"></div>
          <span className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Management Dashboard</span>
        </div>
        <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
          HRD <span className="text-cafe-orange">Overview</span>
        </h2>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div key={i} className="bg-white border-b-4 border-cafe-maroon p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${card.color} text-white flex items-center justify-center mb-4 shadow-lg shadow-black/10`}>
              {card.icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
            <p className="text-3xl font-black text-cafe-maroon">{card.value}</p>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY SECTION (Biar tidak sepi) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Lamaran Terbaru */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-cafe-maroon uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-cafe-orange" /> Lamaran Terbaru
            </h3>
            <Link to="/dashboard/hrd/applications" className="text-[10px] font-black text-cafe-orange uppercase hover:underline">
              Lihat Semua
            </Link>
          </div>
          
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {data.recentApps.map((app) => (
                <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-cafe-maroon font-black text-xs">
                      {app.applicant?.user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-cafe-maroon uppercase">{app.applicant?.user?.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{app.job_opening?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[8px] font-black px-2 py-1 uppercase tracking-tighter ${
                      app.status === 'Accepted' ? 'text-green-600 bg-green-50' : 'text-cafe-orange bg-orange-50'
                    }`}>
                      {app.status}
                    </span>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Info Panel */}
        <div className="bg-cafe-maroon p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Briefcase size={200} />
          </div>

          <div className="relative z-10">
            <h4 className="text-xl font-black uppercase tracking-tighter mb-4 leading-tight">
              Butuh Tenaga <br /> Pengajar Baru?
            </h4>
            <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest leading-relaxed mb-6">
              Pastikan setiap kandidat diperiksa secara teliti untuk menjaga kualitas pendidikan di sekolah kita.
            </p>
          </div>
          
          <Link 
            to="/dashboard/hrd/applications"
            className="relative z-10 bg-cafe-orange text-white text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-cafe-maroon transition-all"
          >
            Mulai Seleksi Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
}