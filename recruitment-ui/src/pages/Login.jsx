import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom"; // PERBAIKAN: useSearchParams ditambahkan di sini
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Membaca query parameter (?token=...&user=...)

  const API_URL = "http://localhost:8000";

  // 1. OTOMATISASI LOGIN GOOGLE (Membaca Callback dari URL)
  useEffect(() => {
    const tokenFromGoogle = searchParams.get("token");
    const userFromGoogle = searchParams.get("user");

    if (tokenFromGoogle && userFromGoogle) {
      try {
        // Simpan kiriman kredensial dari Google langsung ke localStorage
        localStorage.setItem("token", tokenFromGoogle);
        localStorage.setItem("user", userFromGoogle);

        const userData = JSON.parse(userFromGoogle);

        // Jeda mikro 100ms agar I/O LocalStorage selesai ditulis sepenuhnya
        setTimeout(() => {
          const role = userData?.role?.toUpperCase();

          if (role === "ADMIN") {
            navigate("/dashboard/admin");
          } else if (role === "HRD") {
            navigate("/dashboard/hrd");
          } else {
            navigate("/dashboard"); // Untuk Pelamar
          }
        }, 100);
      } catch (error) {
        console.error("Gagal memproses parsing data login Google:", error);
        alert("Terjadi kesalahan sinkronisasi profil Google.");
      }
    }
  }, [searchParams, navigate]);

  // 2. LOGIKA LOGIN MANUAL (Form Email & Password)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Inisialisasi CSRF Protection (Laravel Sanctum)
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      // Kirim data login ke API Backend
      const response = await axios.post(
        `${API_URL}/api/login`,
        { email, password },
        { withCredentials: true },
      );

      const token = response.data.access_token;
      const userData = response.data.user;

      if (token && userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Jeda mikro 100ms untuk memastikan sinkronisasi data LocalStorage
        setTimeout(() => {
          const role = userData.role.toUpperCase();

          if (role === "ADMIN") {
            navigate("/dashboard/admin");
          } else if (role === "HRD") {
            navigate("/dashboard/hrd");
          } else {
            navigate("/dashboard"); // Untuk Pelamar
          }
        }, 100);
      } else {
        alert("Gagal mendapatkan akses token dari server.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Email atau Password salah!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-100 shadow-sm">
        <div className="mb-4 text-left">
          <Link
            to="/"
            className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-cafe-orange flex items-center gap-1 transition-all"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-cafe-maroon uppercase tracking-tighter">
            Sign <span className="text-cafe-orange">In</span>
          </h1>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.3em] mt-2">
            English Cafe Recruitment Portal
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full border-2 border-gray-50 p-3 focus:border-cafe-orange outline-none text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full border-2 border-gray-50 p-3 focus:border-cafe-orange outline-none text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cafe-maroon text-white py-4 flex items-center justify-center gap-3 hover:bg-cafe-orange disabled:bg-gray-300 transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {loading ? "Processing..." : "Log In to Account"}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-4">
            Or continue with
          </p>
          <button
            type="button"
            className="w-full border-2 border-gray-100 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all mb-6"
            onClick={() =>
              (window.location.href = `${API_URL}/api/auth/google`)
            }
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4"
            />
            <span className="text-[10px] font-black uppercase">
              Google Account
            </span>
          </button>

          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest pt-4 border-t border-gray-50">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cafe-orange hover:underline ml-1"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
