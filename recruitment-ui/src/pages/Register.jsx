import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost:8000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // 1. Inisialisasi CSRF Protection (Sanctum)
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      // 2. Kirim data registrasi ke API
      const response = await axios.post(`${API_URL}/api/register`, formData, {
        withCredentials: true,
      });

      const token = response.data.access_token;
      const userData = response.data.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Karena registrasi publik otomatis menjadi PELAMAR, langsung arahkan ke dashboard utama
        navigate("/dashboard");
      } else {
        alert("Gagal mendapatkan akses token dari server.");
      }
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data);
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Terjadi kesalahan sistem saat registrasi.";
        alert(errorMessage);
      }
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
            Sign <span className="text-cafe-orange">Up</span>
          </h1>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.3em] mt-2">
            Create Your Recruitment Account
          </p>
        </header>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Input Nama */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full border-2 border-gray-50 p-3 focus:border-cafe-orange outline-none text-sm transition-all"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                {errors.name[0]}
              </p>
            )}
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full border-2 border-gray-50 p-3 focus:border-cafe-orange outline-none text-sm transition-all"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                {errors.email[0]}
              </p>
            )}
          </div>

          {/* Input Nomor Telepon */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Phone Number / WhatsApp
            </label>
            <input
              type="text"
              name="phone"
              required
              placeholder="08xxxxxxxxxx"
              className="w-full border-2 border-gray-50 p-3 focus:border-cafe-orange outline-none text-sm transition-all"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                {errors.phone[0]}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Min. 8 Characters"
              className="w-full border-2 border-gray-50 p-3 focus:border-cafe-orange outline-none text-sm transition-all"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                {errors.password[0]}
              </p>
            )}
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              required
              placeholder="••••••••"
              className="w-full border-2 border-gray-50 p-3 focus:border-cafe-orange outline-none text-sm transition-all"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cafe-maroon text-white py-4 flex items-center justify-center gap-3 hover:bg-cafe-orange disabled:bg-gray-300 transition-all group mt-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {loading ? "Registering..." : "Register Account"}
            </span>
          </button>
        </form>

        {/* Bagian Google Sign Up / Register */}
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
            Already have an account?{" "}
            <Link to="/login" className="text-cafe-orange hover:underline ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
