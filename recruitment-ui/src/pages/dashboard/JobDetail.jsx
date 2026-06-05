import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Briefcase, Send } from "lucide-react";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";
import { Spinner } from "../../components/SkeletonCard";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "success", title: "", message: "" });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/job-openings/${jobId}`)
      .then(r => setJob(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/applicant/apply", { job_opening_id: jobId }, { headers: { Authorization: `Bearer ${token}` } });
      setModalConfig({ isOpen: true, type: "success", title: "Application Sent!", message: "Your application has been successfully submitted." });
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Application Failed", message: error.response?.data?.message || "Something went wrong." });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-cafe-cream"><Spinner /></div>;

  if (!job) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 font-bold">Position not found.</p>
        <button onClick={() => navigate("/dashboard/browse-jobs")} className="mt-4 text-cafe-orange text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto">
          <ArrowLeft size={14} /> Back to Openings
        </button>
      </div>
    );
  }

  return (
    <>
      <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-10 bg-cafe-cream min-h-screen">
        <button onClick={() => navigate("/dashboard/browse-jobs")}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-cafe-orange mb-6 transition-colors">
          <ArrowLeft size={13} /> Back to Positions
        </button>
        <div className="bg-white rounded-xl border border-gray-100 p-8 md:p-10 shadow-sm max-w-6xl">
          <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
            <div>
              <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">Job Requirement</span>
              <h2 className="text-2xl md:text-3xl font-black text-cafe-maroon uppercase tracking-tighter mt-1 mb-3">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><MapPin size={11} /> {job.branch?.name}</span>
                <span className="flex items-center gap-1.5"><Calendar size={11} /> Published: {new Date(job.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <Briefcase className="text-cafe-orange/10 shrink-0" size={52} />
          </div>
          <div className="text-gray-600 text-sm leading-relaxed mb-10 whitespace-pre-line">
            <h4 className="text-[10px] font-black text-cafe-maroon uppercase tracking-wider mb-4">Job Description &amp; Qualifications</h4>
            {job.description}
          </div>
          <button onClick={handleApply}
            className="w-full sm:w-auto px-8 bg-cafe-maroon text-white py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-cafe-orange transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cafe-maroon/10">
            <Send size={14} /> Submit Application For This Role
          </button>
        </div>
      </Motion.div>
      <GlobalModal {...modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </>
  );
}
