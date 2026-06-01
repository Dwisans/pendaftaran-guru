import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
  Search,
  Users,
  Loader2,
  Building2,
  Globe, // Tambahkan ikon Globe untuk navigasi ke landing page
} from "lucide-react";
import axios from "axios";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Ambil data User langsung dari Database via API /me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("Auth Error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // 2. Fungsi Logout (Diarahkan ke Landing Page)
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Bersihkan penyimpanan lokal
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // PERBAIKAN: Setelah logout sukses, lempar ke landing page (/)
      navigate("/", { replace: true });
    }
  };

  // 3. Logika Penentuan Menu berdasarkan Role
  const userRole = user?.role?.toUpperCase();
  const menuItems = [];

  if (userRole === "PELAMAR") {
    menuItems.push(
      {
        name: "Overview",
        icon: <LayoutDashboard size={20} />,
        path: "/dashboard",
      },
      {
        name: "Browse Jobs",
        icon: <Search size={20} />,
        path: "/dashboard/browse-jobs",
      },
      {
        name: "My Applications",
        icon: <Briefcase size={20} />,
        path: "/dashboard/my-applications",
      },
      {
        name: "Documents",
        icon: <FileText size={20} />,
        path: "/dashboard/documents",
      },
      {
        name: "Profile",
        icon: <User size={20} />,
        path: "/dashboard/profile",
      },
    );
  } else if (userRole === "HRD") {
    menuItems.push(
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        path: "/dashboard/hrd",
      },
      {
        name: "Data Lamaran",
        icon: <Briefcase size={20} />,
        path: "/dashboard/hrd/applications",
      },
      {
        name: "Lowongan Kerja",
        icon: <Briefcase size={20} />,
        path: "/dashboard/hrd/jobs",
      },
    );
  } else if (userRole === "ADMIN") {
    menuItems.push(
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        path: "/dashboard/admin",
      },
      {
        name: "User Management",
        icon: <Users size={20} />,
        path: "/dashboard/admin/users",
      },
      {
        name: "Branches",
        icon: <Building2 size={20} />,
        path: "/dashboard/admin/branches",
      },
      {
        name: "Laporan",
        icon: <FileText size={20} />,
        path: "/dashboard/admin/report",
      },
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
    <div className="w-64 bg-cafe-maroon h-screen p-6 flex flex-col fixed left-0 top-0 z-50">
      <div className="mb-12 px-4">
        <h1 className="text-white font-black text-xl tracking-tighter uppercase leading-none">
          EC <span className="text-cafe-orange">Portal.</span>
          <span className="block text-[8px] text-gray-400 tracking-[0.3em] mt-1 font-bold">
            Recruitment
          </span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-sm transition-all text-[11px] font-black uppercase tracking-widest ${
                isActive
                  ? "bg-cafe-orange text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bagian Bawah: Navigasi Luar & Akses Sesi */}
      <div className="space-y-1 border-t border-white/10 pt-4">
        {/* MENU TAMBAHAN: Kembali ke landing page tanpa menghapus login */}
        <Link
          to="/"
          className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 text-[11px] font-black uppercase tracking-widest transition-all rounded-sm"
        >
          <Globe size={20} />
          Portal Utama
        </Link>

        {/* TOMBOL LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-400 text-[11px] font-black uppercase tracking-widest transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}