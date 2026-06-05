import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";
import { Spinner } from "../../components/SkeletonCard";

export default function Profile() {
  const [formData, setFormData] = useState({ phone: "", address: "", education: "", experience_years: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "success", title: "", message: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/me", { headers: { Authorization: `Bearer ${token}` } });
        const applicantData = response.data?.user?.applicant;
        if (applicantData) {
          setFormData({
            phone: applicantData.phone || "",
            address: applicantData.address || "",
            education: applicantData.education || "",
            experience_years: applicantData.experience_years ? Number(applicantData.experience_years) : 0,
          });
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/applicant/update", {
        phone: formData.phone, address: formData.address, education: formData.education, experience_years: Number(formData.experience_years),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setModalConfig({ isOpen: true, type: "success", title: "Update Successful", message: "Your personal details have been updated and synchronized." });
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Update Failed", message: error.response?.data?.message || "We couldn't save your changes." });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-cafe-cream"><Spinner /></div>;

  return (
    <>
      <Motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-10 bg-cafe-cream min-h-screen">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">Personal Details</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter mt-1">
            My <span className="text-cafe-orange">Profile</span>
          </h2>
        </header>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 max-w-6xl border-t-2 border-t-cafe-maroon">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-wider">Phone Number</label>
                <input type="text" required placeholder="08xxxxxxxxxx"
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange bg-cafe-cream/50 outline-none transition-all text-sm font-bold"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-wider">Education</label>
                <select required value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange bg-white outline-none text-sm font-bold">
                  <option value="">Select Education</option>
                  <option value="SMA/K">SMA/K</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-wider">Experience (Years)</label>
              <input type="number" required min="0"
                className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange bg-cafe-cream/50 outline-none text-sm font-bold"
                value={formData.experience_years} onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })} />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-wider">Full Address</label>
              <textarea rows="3" required placeholder="Alamat lengkap domisili saat ini..."
                className="w-full border-2 border-gray-100 rounded-lg p-3.5 focus:border-cafe-orange bg-cafe-cream/50 outline-none text-sm font-bold"
                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <button type="submit" disabled={saving}
              className="bg-cafe-maroon text-white px-8 py-4 rounded-lg flex items-center gap-3 hover:bg-cafe-orange disabled:bg-gray-400 transition-all group shadow-md shadow-gray-200/50 text-[9px] font-black uppercase tracking-widest">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </Motion.div>
      <GlobalModal {...modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </>
  );
}
