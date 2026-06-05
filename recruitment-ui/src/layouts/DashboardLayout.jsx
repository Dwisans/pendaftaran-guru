import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import axios from "axios";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cafe-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-cafe-maroon/30" size={40} />
      </div>
    );
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div className="flex min-h-screen bg-cafe-cream">
      <Sidebar />
      <main className="flex-1 ml-64 h-screen flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-end shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-cafe-maroon uppercase tracking-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                {user?.role || "—"}
              </p>
            </div>
            <div className="w-10 h-10 bg-cafe-orange rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cafe-orange/20">
              {initials}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
