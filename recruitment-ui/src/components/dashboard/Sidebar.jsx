import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, FileText, User, LogOut, Search,
  Users, Loader2, Building2, Globe,
} from "lucide-react";
import axios from "axios";
import logoSrc from "../../assets/logo.png";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        const res = await axios.get("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Auth Error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) { console.error("Logout error:", error); }
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  };

  const userRole = user?.role?.toUpperCase();
  const menuItems = [];

  if (userRole === "PELAMAR") {
    menuItems.push(
      { name: "Overview", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
      { name: "Browse Jobs", icon: <Search size={18} />, path: "/dashboard/browse-jobs" },
      { name: "My Applications", icon: <Briefcase size={18} />, path: "/dashboard/my-applications" },
      { name: "Documents", icon: <FileText size={18} />, path: "/dashboard/documents" },
      { name: "Profile", icon: <User size={18} />, path: "/dashboard/profile" },
    );
  } else if (userRole === "HRD") {
    menuItems.push(
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard/hrd" },
      { name: "Data Lamaran", icon: <Briefcase size={18} />, path: "/dashboard/hrd/applications" },
      { name: "Lowongan Kerja", icon: <Briefcase size={18} />, path: "/dashboard/hrd/jobs" },
    );
  } else if (userRole === "ADMIN") {
    menuItems.push(
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard/admin" },
      { name: "User Management", icon: <Users size={18} />, path: "/dashboard/admin/users" },
      { name: "Branches", icon: <Building2 size={18} />, path: "/dashboard/admin/branches" },
      { name: "Laporan", icon: <FileText size={18} />, path: "/dashboard/admin/report" },
    );
  }

  if (loading) {
    return (
      <div className="w-64 bg-cafe-maroon h-screen p-6 flex items-center justify-center fixed left-0 top-0">
        <Loader2 className="animate-spin text-white/20" size={32} />
      </div>
    );
  }

  return (
    <aside className="w-64 bg-cafe-maroon h-screen flex flex-col fixed left-0 top-0 z-50 shadow-2xl shadow-black/10 print:hidden">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden ring-2 ring-white/10 group-hover:ring-cafe-orange/50 transition-all duration-300">
            <img src={logoSrc} alt="English Cafe" className="w-full h-full object-contain brightness-0 invert p-1.5" />
          </div>
          <div className="leading-none">
            <span className="text-base font-black tracking-tight text-white block">ENGLISH CAFE.</span>
            <span className="text-[7px] font-bold text-cafe-orange/70 tracking-[0.3em] uppercase">Recruitment</span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cafe-orange flex items-center justify-center text-white font-black text-xs shadow-lg shadow-cafe-orange/20">
            {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black text-white truncate">{user?.name || "User"}</p>
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.15em]">{user?.role || "—"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[7px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">Menu</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg transition-all duration-200 text-[11px] font-black uppercase tracking-widest ${
                isActive
                  ? "bg-cafe-orange text-white shadow-lg shadow-cafe-orange/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`${isActive ? "text-white" : "text-white/30"} transition-colors`}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link to="/"
          className="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 text-[11px] font-black uppercase tracking-widest transition-all duration-200">
          <Globe size={18} className="text-white/30" />
          Portal Utama
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-white/50 hover:text-red-300 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest transition-all duration-200">
          <LogOut size={18} className="text-white/30" />
          Logout
        </button>
      </div>
    </aside>
  );
}
