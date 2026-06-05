import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Search, Calendar, MapPin, MessageSquare, Trash2 } from "lucide-react";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";
import { Spinner } from "../../components/SkeletonCard";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "success", title: "", message: "", showConfirm: false, onConfirm: null });

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/applicant/my-applications", { headers: { Authorization: `Bearer ${token}` } });
      setApplications(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, []);

  const triggerWithdrawConfirmation = (appId) => {
    setSelectedAppId(appId);
    setModalConfig({ isOpen: true, type: "error", title: "Cancel Application?", message: "Are you sure you want to withdraw this application? This action cannot be undone.", showConfirm: true });
  };

  const handleExecuteWithdraw = async () => {
    if (!selectedAppId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/applicant/applications/${selectedAppId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedAppId(null);
      setModalConfig({ isOpen: true, type: "success", title: "Application Withdrawn", message: "Your application has been successfully canceled.", showConfirm: false });
      fetchApps();
    } catch (err) {
      setSelectedAppId(null);
      setModalConfig({ isOpen: true, type: "error", title: "Withdraw Failed", message: err.response?.data?.message || "Failed to withdraw application.", showConfirm: false });
    }
  };

  const getStatusStyle = (status) => ({
    Submitted: "bg-cafe-orange/10 text-cafe-orange border border-cafe-orange/20",
    "Under Review": "bg-blue-50 text-blue-600 border border-blue-100",
    Interview: "bg-purple-50 text-purple-600 border border-purple-100",
    Accepted: "bg-green-50 text-green-600 border border-green-200",
    Rejected: "bg-red-50 text-red-600 border border-red-100",
  }[status] || "bg-gray-50 text-gray-500");

  if (loading) return <div className="h-screen flex items-center justify-center bg-cafe-cream"><Spinner /></div>;

  return (
    <>
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10 bg-cafe-cream min-h-screen">
        <header className="mb-10">
          <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">Tracking System</span>
          <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter mt-1">
            My <span className="text-cafe-orange">Applications</span>
          </h2>
        </header>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cafe-cream border-b border-gray-100">
                  <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Position &amp; Branch</th>
                  <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Applied Date</th>
                  <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                  <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Notes &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-cafe-cream/50 transition-colors">
                    <td className="p-5">
                      <span className="text-[11px] font-black text-cafe-maroon uppercase">{app.job_opening?.title}</span>
                      <div className="flex items-center gap-1 mt-1 text-gray-400">
                        <MapPin size={9} />
                        <span className="text-[8px] font-bold uppercase">{app.job_opening?.branch?.name}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={11} />
                        <span className="text-[9px] font-bold uppercase">{new Date(app.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${getStatusStyle(app.status)}`}>{app.status}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          {app.hrd_notes ? (
                            <div className="flex items-center gap-2 text-cafe-orange group cursor-help relative inline-flex">
                              <span className="text-[8px] font-black uppercase">View Feedback</span>
                              <MessageSquare size={12} />
                              <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-cafe-maroon text-white text-[8px] leading-relaxed hidden group-hover:block z-10 rounded-lg shadow-xl">
                                {app.hrd_notes}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[8px] font-bold text-gray-300 uppercase italic">Pending Review</span>
                          )}
                        </div>
                        {app.status === "Submitted" && (
                          <button onClick={() => triggerWithdrawConfirmation(app.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-[8px] font-black uppercase tracking-wider transition-colors rounded-lg">
                            <Trash2 size={11} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-cafe-cream rounded-full flex items-center justify-center mb-4 text-gray-200">
                  <Search size={28} />
                </div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">No applications found</p>
              </div>
            )}
          </div>
        </div>
      </Motion.div>
      <GlobalModal {...modalConfig} onConfirm={handleExecuteWithdraw} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </>
  );
}
