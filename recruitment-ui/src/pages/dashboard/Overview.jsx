import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Send, CheckCircle2, XCircle, Clock, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Spinner } from "../../components/SkeletonCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Overview() {
  const [data, setData] = useState({ stats: {}, recent: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const role = user.role?.toLowerCase();
      if (role === "admin") return navigate("/dashboard/admin", { replace: true });
      if (role === "hrd") return navigate("/dashboard/hrd", { replace: true });
    }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/applicant/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [navigate]);

  const statCards = [
    { title: "Total Applied", value: data.stats.total, icon: Send, color: "text-cafe-maroon", bg: "bg-cafe-maroon" },
    { title: "In Progress", value: data.stats.in_progress, icon: Clock, color: "text-blue-600", bg: "bg-blue-600" },
    { title: "Accepted", value: data.stats.accepted, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-600" },
    { title: "Rejected", value: data.stats.rejected, icon: XCircle, color: "text-red-500", bg: "bg-red-500" },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cafe-cream">
        <Spinner />
      </div>
    );
  }

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-0.5 bg-cafe-orange rounded-full" />
          <span className="text-[9px] font-black text-cafe-maroon uppercase tracking-[0.4em]">Applicant Console</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
          Dashboard <span className="text-cafe-orange">Overview</span>
        </h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Motion.div key={card.title} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:border-cafe-orange hover:shadow-md transition-all duration-300">
              <div className={`w-10 h-10 ${card.bg} text-white flex items-center justify-center mb-4 rounded-lg shadow-lg shadow-black/5`}>
                <Icon size={18} />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
              <p className={`text-3xl font-black ${card.color}`}>{card.value || 0}</p>
            </Motion.div>
          );
        })}
      </div>

      {/* Recent + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-[11px] font-black text-cafe-maroon uppercase tracking-widest">Recent Activity</h3>
            <Link to="/dashboard/my-applications" className="text-[9px] font-black text-cafe-orange uppercase tracking-widest flex items-center gap-1.5 hover:underline transition-all">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {data.recent && data.recent.length > 0 ? (
              data.recent.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-cafe-cream rounded-lg hover:bg-white hover:shadow-sm transition-all border-l-4 border-cafe-maroon group">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-cafe-maroon shadow-sm group-hover:bg-cafe-maroon group-hover:text-white transition-all">
                      <Send size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-cafe-maroon uppercase tracking-tight">{app.job_opening?.title}</h4>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">{app.job_opening?.branch?.name} &middot; {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border ${
                    app.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    app.status === "Rejected" ? "bg-red-50 text-red-600 border-red-100" :
                    app.status === "Interview" ? "bg-purple-50 text-purple-600 border-purple-100" :
                    app.status === "Under Review" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    "bg-cafe-orange/10 text-cafe-orange border-cafe-orange/20"
                  }`}>{app.status}</span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No applications sent yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-cafe-maroon rounded-xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-cafe-orange">Next Step</h3>
            <p className="text-xl font-black leading-tight mb-4">Keep your documents updated for a higher chance.</p>
            <div className="h-1 w-12 bg-cafe-orange rounded-full mb-4" />
            <p className="text-[9px] text-gray-300 font-bold uppercase leading-relaxed">Our HR team reviews applications within 3-5 working days.</p>
          </div>
          <Send className="absolute -right-8 -bottom-8 text-white/5" size={160} />
        </div>
      </div>
    </Motion.div>
  );
}
