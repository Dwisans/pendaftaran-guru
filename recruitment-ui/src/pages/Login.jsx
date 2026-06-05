import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";
import logoSrc from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    const tokenFromGoogle = searchParams.get("token");
    const userFromGoogle = searchParams.get("user");
    if (tokenFromGoogle && userFromGoogle) {
      try {
        localStorage.setItem("token", tokenFromGoogle);
        localStorage.setItem("user", userFromGoogle);
        const userData = JSON.parse(userFromGoogle);
        const role = userData?.role?.toUpperCase();
        setTimeout(() => {
          if (role === "ADMIN") navigate("/dashboard/admin");
          else if (role === "HRD") navigate("/dashboard/hrd");
          else navigate("/dashboard");
        }, 100);
      } catch {
        alert("Terjadi kesalahan sinkronisasi profil Google.");
      }
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
      const response = await axios.post(`${API_URL}/api/login`, { email, password }, { withCredentials: true });
      const token = response.data.access_token;
      const userData = response.data.user;
      if (token && userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setTimeout(() => {
          const role = userData.role.toUpperCase();
          if (role === "ADMIN") navigate("/dashboard/admin");
          else if (role === "HRD") navigate("/dashboard/hrd");
          else navigate("/dashboard");
        }, 100);
      } else alert("Gagal mendapatkan akses token dari server.");
    } catch (error) {
      alert(error.response?.data?.message || "Email atau Password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cafe-cream p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-cafe-orange transition-colors">
            <ArrowLeft size={12} /> Kembali ke Beranda
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-cafe-maroon via-cafe-orange to-cafe-brick" />
          <div className="p-8 md:p-10">
            <header className="mb-8 text-center">
              <img src={logoSrc} alt="English Cafe" className="w-14 h-14 mx-auto mb-5 object-contain" />
              <h1 className="text-2xl font-black text-cafe-maroon uppercase tracking-tighter">
                Sign <span className="text-cafe-orange">In</span>
              </h1>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-[0.3em] mt-2">English Cafe Recruitment Portal</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-wider">Email Address</label>
                <input type="email" required placeholder="name@example.com"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-wider">Password</label>
                <input type="password" required placeholder="••••••••"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-cafe-maroon text-white py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-cafe-orange disabled:bg-gray-300 transition-all group text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cafe-maroon/10">
                {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                {loading ? "Processing..." : "Log In to Account"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-4">Or continue with</p>
              <button type="button"
                onClick={() => window.location.href = `${API_URL}/api/auth/google`}
                className="w-full border-2 border-gray-100 rounded-lg py-3.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all mb-6">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Google Account</span>
              </button>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider pt-4 border-t border-gray-50">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-cafe-orange hover:underline ml-1">Register Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
