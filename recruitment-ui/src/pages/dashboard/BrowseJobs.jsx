import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, Send, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";
import { Spinner } from "../../components/SkeletonCard";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "success", title: "", message: "" });

  useEffect(() => {
    axios.get("http://localhost:8000/api/job-openings")
      .then(r => setJobs(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/applicant/apply", { job_opening_id: jobId }, { headers: { Authorization: `Bearer ${token}` } });
      setModalConfig({ isOpen: true, type: "success", title: "Application Sent!", message: "Your application has been successfully submitted." });
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Application Failed", message: error.response?.data?.message || "Something went wrong." });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-cafe-cream"><Spinner /></div>;

  return (
    <>
      <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-10 bg-cafe-cream min-h-screen">
        <header className="mb-10">
          <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">Opportunities</span>
          <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter mt-1">
            Available <span className="text-cafe-orange">Positions</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-cafe-maroon uppercase mb-1 group-hover:text-cafe-orange transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><MapPin size={11} /> {job.branch?.name}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={11} /> {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Briefcase className="text-gray-100 group-hover:text-cafe-orange/20 transition-colors shrink-0" size={36} />
              </div>
              <p className="text-gray-500 text-[12px] leading-relaxed mb-8 line-clamp-3">{job.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/dashboard/browse-jobs/${job.id}`}
                  className="bg-cafe-cream text-center text-gray-500 border border-gray-200 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                  <span className="text-[9px] font-black uppercase tracking-widest">View Details</span>
                  <ArrowRight size={12} />
                </Link>
                <button onClick={() => handleApply(job.id)}
                  className="bg-cafe-maroon text-white py-3.5 rounded-lg flex items-center justify-center gap-3 hover:bg-cafe-orange transition-all group/btn">
                  <Send size={13} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Apply</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <Briefcase size={44} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">No job openings available.</p>
          </div>
        )}
      </Motion.div>
      <GlobalModal {...modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </>
  );
}
