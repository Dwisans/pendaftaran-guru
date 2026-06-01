import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  MessageSquare,
  Loader2,
  Trash2,
} from "lucide-react";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk melacak ID lamaran yang akan dihapus saat konfirmasi
  const [selectedAppId, setSelectedAppId] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    showConfirm: false, // Menandakan apakah modal butuh tombol aksi konfirmasi
    onConfirm: null,
  });

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8000/api/applicant/my-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // 1. Fungsi trigger saat tombol "Cancel" diklik (Membuka Modal Konfirmasi bergaya elegan)
  const triggerWithdrawConfirmation = (appId) => {
    setSelectedAppId(appId);
    setModalConfig({
      isOpen: true,
      type: "error", // Menggunakan tema error/merah untuk aksi destruktif (delete)
      title: "Cancel Application?",
      message:
        "Are you sure you want to withdraw this application? This action cannot be undone.",
      showConfirm: true,
    });
  };

  // 2. Fungsi eksekusi yang dijalankan ketika user menekan tombol konfirmasi di dalam modal
  const handleExecuteWithdraw = async () => {
    if (!selectedAppId) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8000/api/applicant/applications/${selectedAppId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Reset ID terpilih dan ubah modal menjadi pesan sukses
      setSelectedAppId(null);
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Application Withdrawn",
        message: "Your application has been successfully canceled.",
        showConfirm: false,
      });

      fetchApps(); // Refresh data tabel
    } catch (err) {
      console.error(err);
      setSelectedAppId(null);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Withdraw Failed",
        message:
          err.response?.data?.message ||
          "Failed to withdraw application. Please try again.",
        showConfirm: false,
      });
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Submitted: "bg-gray-100 text-gray-600",
      "Under Review": "bg-blue-50 text-blue-600",
      Interview: "bg-purple-50 text-purple-600",
      Accepted: "bg-green-50 text-green-600 border border-green-200",
      Rejected: "bg-red-50 text-red-600",
    };
    return styles[status] || "bg-gray-50 text-gray-500";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="animate-spin text-cafe-orange" size={32} />
      </div>
    );
  }

  return (
    <>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-10 bg-[#FAFAFA] min-h-screen"
      >
        <header className="mb-10">
          <span className="text-cafe-orange text-[10px] font-black uppercase tracking-[0.4em]">
            Tracking System
          </span>
          <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
            My <span className="text-cafe-orange">Applications</span>
          </h2>
        </header>

        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Position & Branch
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Applied Date
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Notes & Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-cafe-maroon uppercase">
                          {app.job_opening?.title}
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-gray-400">
                          <MapPin size={10} />
                          <span className="text-[9px] font-bold uppercase">
                            {app.job_opening?.branch?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold uppercase">
                          {new Date(app.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${getStatusStyle(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          {app.hrd_notes ? (
                            <div className="flex items-center gap-2 text-cafe-orange group cursor-help relative inline-flex">
                              <span className="text-[9px] font-black uppercase">
                                View Feedback
                              </span>
                              <MessageSquare size={14} />
                              <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-cafe-maroon text-white text-[9px] leading-relaxed hidden group-hover:block z-10 shadow-xl">
                                {app.hrd_notes}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter italic">
                              Pending Review
                            </span>
                          )}
                        </div>

                        {app.status === "Submitted" && (
                          <button
                            onClick={() => triggerWithdrawConfirmation(app.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-[9px] font-black uppercase tracking-wider transition-colors rounded-sm"
                          >
                            <Trash2 size={12} />
                            Cancel
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
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
                  <Search size={32} />
                </div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                  No applications found
                </p>
              </div>
            )}
          </div>
        </div>
      </Motion.div>

      {/* Komponen Modal yang Diperbarui */}
      <GlobalModal
        {...modalConfig}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleExecuteWithdraw} // Menyuntikkan aksi konfirmasi hapus ke dalam modal
      />
    </>
  );
}
