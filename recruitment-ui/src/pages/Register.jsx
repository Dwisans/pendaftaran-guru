import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";
import logoSrc from "../assets/logo.png";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", password_confirmation: "", phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
      const response = await axios.post(`${API_URL}/api/register`, formData, { withCredentials: true });
      const token = response.data.access_token;
      const userData = response.data.user;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
      } else alert("Gagal mendapatkan akses token dari server.");
    } catch (error) {
      if (error.response && error.response.status === 422) setErrors(error.response.data);
      else alert(error.response?.data?.message || "Terjadi kesalahan sistem saat registrasi.");
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
          <div className="h-1.5 bg-gradient-to-r from-cafe-orange via-cafe-brick to-cafe-maroon" />
          <div className="p-8 md:p-10">
            <header className="mb-8 text-center">
              <img src={logoSrc} alt="English Cafe" className="w-14 h-14 mx-auto mb-5 object-contain" />
              <h1 className="text-2xl font-black text-cafe-maroon uppercase tracking-tighter">
                Sign <span className="text-cafe-orange">Up</span>
              </h1>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-[0.3em] mt-2">Create Your Recruitment Account</p>
            </header>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1.5 tracking-wider">Full Name</label>
                <input type="text" name="name" required placeholder="John Doe"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
                  value={formData.name} onChange={handleChange} />
                {errors.name && <p className="text-red-500 text-[9px] font-bold uppercase mt-1">{errors.name[0]}</p>}
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1.5 tracking-wider">Email Address</label>
                <input type="email" name="email" required placeholder="name@example.com"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
                  value={formData.email} onChange={handleChange} />
                {errors.email && <p className="text-red-500 text-[9px] font-bold uppercase mt-1">{errors.email[0]}</p>}
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1.5 tracking-wider">Phone Number / WhatsApp</label>
                <input type="text" name="phone" required placeholder="08xxxxxxxxxx"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
                  value={formData.phone} onChange={handleChange} />
                {errors.phone && <p className="text-red-500 text-[9px] font-bold uppercase mt-1">{errors.phone[0]}</p>}
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1.5 tracking-wider">Password</label>
                <input type="password" name="password" required placeholder="Min. 8 Characters"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
                  value={formData.password} onChange={handleChange} />
                {errors.password && <p className="text-red-500 text-[9px] font-bold uppercase mt-1">{errors.password[0]}</p>}
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1.5 tracking-wider">Confirm Password</label>
                <input type="password" name="password_confirmation" required placeholder="••••••••"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
                  value={formData.password_confirmation} onChange={handleChange} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-cafe-maroon text-white py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-cafe-orange disabled:bg-gray-300 transition-all group mt-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cafe-maroon/10">
                {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                {loading ? "Registering..." : "Register Account"}
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
                Already have an account?{" "}
                <Link to="/login" className="text-cafe-orange hover:underline ml-1">Log In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
