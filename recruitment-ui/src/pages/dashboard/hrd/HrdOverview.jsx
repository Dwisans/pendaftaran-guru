import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Users, Briefcase, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../../../components/SkeletonCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export default function HrdOverview() {
  const [data, setData] = useState({ stats: null, recentApps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [statsRes, appsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/internal/reports", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8000/api/hrd/applications", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setData({ stats: statsRes.data.stats, recentApps: appsRes.data.data.slice(0, 5) });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-cafe-cream"><Spinner /></div>;

  const cards = [
    { title: "Total Pelamar", value: data.stats?.total_applicants || 0, icon: Users, color: "bg-cafe-maroon" },
    { title: "Total Lamaran", value: data.stats?.total_applications || 0, icon: Briefcase, color: "bg-cafe-orange" },
    { title: "Perlu Review", value: data.stats?.pending || 0, icon: Clock, color: "bg-amber-500" },
    { title: "Diterima", value: data.stats?.accepted || 0, icon: CheckCircle, color: "bg-emerald-600" },
  ];

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-0.5 bg-cafe-orange rounded-full" />
          <span className="text-[9px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Management Dashboard</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
          HRD <span className="text-cafe-orange">Overview</span>
        </h2>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Motion.div key={card.title} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:border-cafe-orange hover:shadow-md transition-all duration-300">
              <div className={`w-10 h-10 ${card.color} text-white flex items-center justify-center mb-4 rounded-lg shadow-lg shadow-black/5`}>
                <Icon size={18} />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
              <p className="text-3xl font-black text-cafe-maroon">{card.value}</p>
            </Motion.div>
          );
        })}
      </div>

      {/* Recent + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-black text-cafe-maroon uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-cafe-orange" /> Lamaran Terbaru
            </h3>
            <Link to="/dashboard/hrd/applications" className="text-[9px] font-black text-cafe-orange uppercase hover:underline">Lihat Semua</Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {data.recentApps.map((app) => (
                <div key={app.id} className="p-4 flex items-center justify-between hover:bg-cafe-cream/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cafe-cream flex items-center justify-center text-cafe-maroon font-black text-xs">
                      {app.applicant?.user?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-cafe-maroon uppercase">{app.applicant?.user?.name}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">{app.job_opening?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-[7px] font-black uppercase tracking-tighter rounded-lg border ${
                      app.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                      app.status === "Rejected" ? "bg-red-50 text-red-600 border-red-100" :
                      app.status === "Interview" ? "bg-purple-50 text-purple-600 border-purple-100" :
                      app.status === "Under Review" ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-cafe-orange/10 text-cafe-orange border-cafe-orange/20"
                    }`}>
                      {app.status}
                    </span>
                    <ChevronRight size={13} className="text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-cafe-maroon rounded-xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10"><Briefcase size={160} /></div>
          <div className="relative z-10">
            <h4 className="text-xl font-black uppercase tracking-tighter mb-4 leading-tight">Butuh Tenaga <br /> Pengajar Baru?</h4>
            <p className="text-[9px] font-medium text-gray-300 uppercase tracking-widest leading-relaxed mb-6">
              Pastikan setiap kandidat diperiksa secara teliti untuk menjaga kualitas pendidikan.
            </p>
          </div>
          <Link to="/dashboard/hrd/applications"
            className="relative z-10 bg-cafe-orange text-white text-center py-3.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-cafe-maroon transition-all duration-300">
            Mulai Seleksi Sekarang
          </Link>
        </div>
      </div>
    </Motion.div>
  );
}
