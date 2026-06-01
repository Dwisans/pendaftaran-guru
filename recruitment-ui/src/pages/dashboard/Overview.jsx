import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import {
  LayoutDashboard,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Overview() {
  const [data, setData] = useState({ stats: {}, recent: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inisialisasi navigate

  useEffect(() => {
    // 1. CEK ROLE TERLEBIH DAHULU SEBELUM FETCH DATA
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const role = user.role?.toLowerCase();

      if (role === "admin") {
        return navigate("/dashboard/admin", { replace: true });
      } else if (role === "hrd") {
        return navigate("/dashboard/hrd", { replace: true });
      }
    }

    // 2. JIKA DIA PELAMAR, BARU JALANKAN FETCH DATA
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/applicant/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Tambahkan navigate ke dependency

  // Komponen Kecil untuk Kartu Statistik
  const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-cafe-orange transition-all">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
          {title}
        </p>
        <p className={`text-3xl font-black ${colorClass}`}>{value || 0}</p>
      </div>
      <div
        className={`${colorClass} opacity-10 group-hover:opacity-30 transition-opacity`}
      >
        {icon}
      </div>
    </div>
  );

  // Tampilan saat Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-cafe-orange" size={40} />
          <p className="text-[10px] font-black text-cafe-maroon uppercase tracking-[0.3em]">
            Synchronizing Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 bg-[#FAFAFA] min-h-screen"
    >
      {/* Header */}
      <header className="mb-12 flex justify-between items-center">
        <div>
          <span className="text-cafe-orange text-[10px] font-black uppercase tracking-[0.5em]">
            Applicant Console
          </span>
          <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
            Dashboard{" "}
            <span className="text-outline-sm text-cafe-orange">Overview</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
            {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
          </p>
        </div>
      </header>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Applied"
          value={data.stats.total}
          icon={<Send size={40} />}
          colorClass="text-cafe-maroon"
        />
        <StatCard
          title="Under Review"
          value={data.stats.submitted}
          icon={<Clock size={40} />}
          colorClass="text-blue-500"
        />
        <StatCard
          title="Accepted"
          value={data.stats.accepted}
          icon={<CheckCircle2 size={40} />}
          colorClass="text-green-600"
        />
        <StatCard
          title="Rejected"
          value={data.stats.rejected}
          icon={<XCircle size={40} />}
          colorClass="text-red-500"
        />
      </div>

      {/* Recent Activity & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Tabel Lamaran Terbaru */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h3 className="text-xs font-black text-cafe-maroon uppercase tracking-widest">
              Recent Activity
            </h3>
            <Link
              to="/dashboard/my-applications"
              className="text-[10px] font-black text-cafe-orange uppercase tracking-widest flex items-center gap-2 hover:underline transition-all"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {data.recent && data.recent.length > 0 ? (
              data.recent.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-5 bg-gray-50 hover:bg-white hover:shadow-md transition-all border-l-4 border-cafe-maroon group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-white flex items-center justify-center text-cafe-maroon shadow-sm group-hover:bg-cafe-maroon group-hover:text-white transition-colors">
                      <LayoutDashboard size={18} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-cafe-maroon uppercase tracking-tight">
                        {app.job_opening?.title}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">
                        {app.job_opening?.branch?.name} • Applied{" "}
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black px-4 py-1.5 uppercase tracking-widest shadow-sm ${
                      app.status === "Accepted"
                        ? "bg-green-600 text-white"
                        : app.status === "Rejected"
                          ? "bg-red-600 text-white"
                          : app.status === "Interview"
                            ? "bg-purple-600 text-white"
                            : app.status === "Under Review"
                              ? "bg-blue-600 text-white"
                              : "bg-cafe-orange text-white" // Untuk 'Submitted'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-gray-100">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  No applications sent yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Tip/Pesan */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-cafe-maroon p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-cafe-orange">
                Next Step
              </h3>
              <p className="text-xl font-black leading-tight mb-6">
                Keep your documents updated for a higher chance.
              </p>
              <div className="h-1 w-12 bg-cafe-orange mb-6"></div>
              <p className="text-[10px] text-gray-300 font-bold uppercase leading-relaxed">
                Our HR team usually reviews applications within 3-5 working
                days. Check your email regularly.
              </p>
            </div>
            <LayoutDashboard
              className="absolute -right-10 -bottom-10 text-white/5"
              size={200}
            />
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
