import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/job-openings",
        );
        setJobs(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil lowongan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/applicant/apply`,
        { job_opening_id: jobId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Application Sent!",
        message:
          "Your application has been successfully submitted. Please check your Overview for updates.",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Application Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong. Have you already applied for this position?",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-cafe-orange" size={40} />
      </div>
    );
  }

  return (
    <>
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 bg-gray-50 min-h-screen"
      >
        <header className="mb-10">
          <span className="text-cafe-orange text-[10px] font-black uppercase tracking-[0.4em]">
            Opportunities
          </span>
          <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
            Available <span className="text-cafe-orange">Positions</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-cafe-maroon uppercase mb-1 group-hover:text-cafe-orange transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {job.branch?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Briefcase
                  className="text-gray-100 group-hover:text-cafe-orange/20 transition-colors"
                  size={40}
                />
              </div>

              <p className="text-gray-500 text-xs leading-relaxed mb-8 line-clamp-3">
                {job.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/dashboard/browse-jobs/${job.id}`}
                  className="bg-gray-50 text-center text-gray-500 border border-gray-200 py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    View Details
                  </span>
                </Link>

                <button
                  onClick={() => handleApply(job.id)}
                  className="bg-cafe-maroon text-white py-3 flex items-center justify-center gap-3 hover:bg-cafe-orange transition-all group/btn"
                >
                  <Send size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Apply
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-20 bg-white border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">
              No job openings available at the moment.
            </p>
          </div>
        )}
      </Motion.div>

      <GlobalModal
        {...modalConfig}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </>
  );
}
