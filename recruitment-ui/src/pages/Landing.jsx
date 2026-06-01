import React from "react";
import {
  ChevronRight,
  MapPin,
  Award,
  Users,
  ArrowRight,
  Globe,
  Quote,
  PlayCircle,
  Plus,
  Minus,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Target,
  Zap,
  Star,
  Briefcase,
  CircleDollarSign,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Menggunakan huruf kapital 'Motion' agar lolos dari validasi ESLint
import { motion as Motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { SkeletonCard } from "../components/SkeletonCard";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Landing = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [showAllJobs, setShowAllJobs] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  // 1. CEK AUTENTIKASI AWAL (SINKRON DENGAN OVERVIEW)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(storedUser);
        const role = parsedUser?.role?.toLowerCase(); // Menggunakan huruf kecil

        if (role === "admin") {
          setDashboardPath("/dashboard/admin");
        } else if (role === "hrd") {
          setDashboardPath("/dashboard/hrd");
        } else {
          setDashboardPath("/dashboard"); // Default rute pelamar
        }
      } catch (e) {
        console.error("Gagal membaca data user dari storage", e);
      }
    }
  }, []);

  useEffect(() => {
    const getBranches = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/branches");
        setBranches(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data cabang:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    getBranches();
  }, []);

  const mainOffice = branches.find((b) => b.id === 1) || branches[0];
  const otherBranches = branches.filter((b) => b.id !== mainOffice?.id);
  const displayedBranches = showAll ? otherBranches : otherBranches.slice(0, 3);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/job-openings",
        );
        setJobs(response.data.data);
      } catch (error) {
        console.error("Gagal memuat lowongan:", error);
      } finally {
        setTimeout(() => setJobsLoading(false), 600);
      }
    };
    fetchJobs();
  }, []);

  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 3);

  // 2. PROSES TOMBOL APPLY (SINKRON DENGAN OVERVIEW DAN AUTH MIDDLEWARE)
  const handleApplyJob = (jobId) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData || token === "undefined" || token === "null") {
      console.log("Token tidak ditemukan, mengalihkan ke login...");
      return navigate("/login", {
        state: { redirectTo: `/dashboard/browse-jobs/${jobId}` },
      });
    }

    try {
      const user = JSON.parse(userData);
      const role = user.role?.toLowerCase(); // Menggunakan huruf kecil

      if (role === "admin") {
        navigate("/dashboard/admin");
      } else if (role === "hrd") {
        navigate("/dashboard/hrd");
      } else {
        // Jika Pelamar, arahkan langsung ke halaman apply lowongan terkait
        console.log(
          "Token & role terverifikasi, mengalihkan ke detail pekerjaan...",
        );
        navigate(`/dashboard/browse-jobs/${jobId}`);
      }
    } catch (error) {
      console.error("Gagal memproses parsing data user saat apply:", error);
      navigate("/login");
    }
  };

  const stats = [
    { label: "Founded", val: "2012" },
    { label: "Active Tutors", val: "50+" },
    { label: "Community", val: "15k+" },
    { label: "Centers", val: "12" },
  ];

  return (
    <div className="w-full min-h-screen bg-white selection:bg-cafe-maroon selection:text-white text-cafe-maroon antialiased overflow-x-hidden">
      {/* --- MODERN NAVIGATION --- */}
      <Motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-6 md:px-20 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cafe-maroon rounded-sm shadow-inner flex items-center justify-center text-white font-black">
            E
          </div>
          <div className="leading-none border-l-2 border-gray-100 pl-3">
            <span className="text-xl font-black tracking-[-0.07em] text-cafe-maroon block">
              ENGLISH CAFE.
            </span>
            <span className="text-[9px] font-bold text-cafe-brick tracking-[0.4em] uppercase opacity-70">
              Official Portal
            </span>
          </div>
        </div>
        <div className="hidden lg:flex gap-12 font-bold text-[10px] text-cafe-maroon/60 uppercase tracking-[0.3em]">
          {["About", "Career", "Location"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-cafe-orange transition-all relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cafe-orange group-hover:w-full transition-all"></span>
            </a>
          ))}
        </div>

        {isLoggedIn ? (
          <Link
            to={dashboardPath}
            className="bg-cafe-orange text-white px-10 py-3.5 rounded-sm font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-cafe-maroon transition-all shadow-lg shadow-cafe-orange/20 active:scale-95"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="bg-cafe-maroon text-white px-10 py-3.5 rounded-sm font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-cafe-maroon/20 active:scale-95"
          >
            Apply Now
          </Link>
        )}
      </Motion.nav>

      {/* --- HERO SECTION --- */}
      <header className="px-6 md:px-20 py-24 md:py-40 bg-white overflow-hidden border-b border-gray-50">
        <div className="max-w-400 mx-auto grid lg:grid-cols-12 gap-20 items-center">
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="lg:col-span-6 relative z-10"
          >
            <Motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-4 py-2 bg-cafe-orange/10 rounded-full mb-10 border border-cafe-orange/20"
            >
              <Zap size={14} className="text-cafe-orange animate-pulse" />
              <span className="text-cafe-orange font-black text-[10px] uppercase tracking-[0.3em]">
                Hiring Innovators 2026
              </span>
            </Motion.div>

            <Motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black text-cafe-maroon leading-[0.85] mb-10 tracking-[-0.08em] uppercase decoration-cafe-brick decoration-4 underline-offset-12 underline"
            >
              Impact <br /> Through <br />
              <span className="text-cafe-brick no-underline">Education.</span>
            </Motion.h1>

            <Motion.p
              variants={itemVariants}
              className="text-xl text-cafe-maroon/80 mb-14 font-medium leading-relaxed max-w-2xl border-l-4 border-gray-100 pl-8"
            >
              Kami tidak hanya mengajar, kami membangun ekosistem. English Cafe
              adalah platform di mana passion Anda bertemu dengan kultur
              progresif.
            </Motion.p>

            <Motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 items-center"
            >
              <a
                href="#jobs"
                className="bg-cafe-maroon text-white px-14 py-6 rounded-sm font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center gap-4 shadow-2xl shadow-cafe-maroon/20 group"
              >
                Explore Roles{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </a>
            </Motion.div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-cafe-orange/5 -z-10 translate-x-20 rounded-full"></div>

            <div className="relative w-full h-150 bg-gray-50 p-3 rounded-sm border border-gray-100 shadow-2xl overflow-hidden group">
              <Motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
                src={HERO_IMAGE_URL}
                alt="English Cafe Vibe"
                className="w-full h-full object-cover rounded-sm"
              />
              <div className="absolute inset-0 bg-linear-to-t from-cafe-maroon/30 via-transparent to-transparent opacity-60"></div>
            </div>

            <Motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-12 -left-12 bg-white p-6 rounded-sm shadow-2xl border border-gray-100 hidden md:flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-cafe-orange/10 rounded-full flex items-center justify-center text-cafe-orange">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Rating Alumni
                </p>
                <p className="text-2xl font-black text-cafe-maroon">4.9/5</p>
              </div>
            </Motion.div>

            <Motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
              }}
              className="absolute top-10 -right-10 bg-cafe-brick text-white p-6 rounded-sm shadow-2xl hidden md:block"
            >
              <PlayCircle size={40} className="opacity-80" />
              <p className="font-black text-sm uppercase tracking-widest mt-3">
                Watch
                <br />
                Vibe
              </p>
            </Motion.div>
          </Motion.div>
        </div>
      </header>

      {/* --- STATS --- */}
      <section className="bg-cafe-maroon py-24 px-6 md:px-20 border-y border-cafe-maroon overflow-hidden">
        <div className="max-w-400 mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center items-center">
          {stats.map((s, i) => (
            <Motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-white relative group"
            >
              <h3 className="text-6xl font-black mb-2 tracking-[-0.06em] text-cafe-orange">
                {s.val}
              </h3>
              <p className="text-white/40 font-bold text-[10px] uppercase tracking-[0.5em]">
                {s.label}
              </p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section
        id="about"
        className="py-32 md:py-48 bg-[#FCFAF8] px-6 md:px-20 border-b border-gray-100 overflow-hidden relative"
      >
        <div className="max-w-400 mx-auto">
          <div className="grid lg:grid-cols-12 gap-24 items-center mb-24">
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative hidden lg:block"
            >
              <div className="bg-white h-150 rounded-sm shadow-2xl p-4 border border-gray-100 rotate-2 flex items-center justify-center">
                <Minus
                  size={100}
                  strokeWidth={0.5}
                  className="text-cafe-maroon/10"
                />
              </div>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative z-10"
            >
              <span className="text-cafe-brick text-[11px] font-black uppercase tracking-[0.5em]">
                Who We Are
              </span>
              <h2 className="text-6xl md:text-7xl font-black text-cafe-maroon mb-12 tracking-[-0.07em] uppercase leading-none mt-5">
                Melawan <br /> Kekakuan <br />{" "}
                <span className="text-cafe-brick underline decoration-2 underline-offset-8">
                  Formalitas.
                </span>
              </h2>
              <p className="text-2xl text-cafe-maroon/80 font-medium mb-10 leading-relaxed italic border-l-4 border-gray-100 pl-8">
                "Berdiri sejak 2012, kami membangun jembatan antara metode
                belajar yang efektif dan kenyamanan suasana cafe."
              </p>
            </Motion.div>
          </div>

          <Motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {[
              {
                t: "Conceptual",
                d: "Non-Formal & Community Based",
                i: <Zap />,
              },
              { t: "Focus", d: "Confidence & Speaking Fluency", i: <Target /> },
              { t: "Culture", d: "Progresif, Santai, Setara", i: <Users /> },
              { t: "elite", d: "Selective professional tutors", i: <Award /> },
            ].map((item, i) => (
              <Motion.div
                variants={itemVariants}
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 border border-gray-100 rounded-sm hover:border-cafe-brick/30 transition-all group shadow-sm"
              >
                <div className="w-12 h-12 bg-cafe-orange/5 rounded-sm flex items-center justify-center text-cafe-orange mb-8 group-hover:bg-cafe-brick group-hover:text-white transition-colors">
                  {React.cloneElement(item.i, { size: 24 })}
                </div>
                <h5 className="font-black text-[12px] uppercase tracking-widest text-cafe-brick mb-2">
                  {item.t}
                </h5>
                <p className="text-sm font-medium opacity-60 leading-relaxed">
                  {item.d}
                </p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* --- JOB OPENINGS SECTION --- */}
      <section
        id="jobs"
        className="py-32 bg-[#FDFDFD] px-6 md:px-20 border-b border-gray-100"
      >
        <div className="max-w-400 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-cafe-orange text-[11px] font-black uppercase tracking-[0.5em] mb-4 block">
                Careers
              </span>
              <h2 className="text-6xl font-black text-cafe-maroon uppercase tracking-tighter leading-none">
                Available <span className="text-cafe-orange">Positions.</span>
              </h2>
            </div>

            {!jobsLoading && jobs.length > 3 && (
              <button
                onClick={() => setShowAllJobs(!showAllJobs)}
                className="px-8 py-3 border-2 border-cafe-maroon text-cafe-maroon font-black text-[10px] uppercase tracking-widest hover:bg-cafe-maroon hover:text-white transition-all"
              >
                {showAllJobs ? "Show Less" : `View All ${jobs.length} Jobs`}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {jobsLoading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-white border border-gray-100 rounded-sm animate-pulse shadow-sm"
                  ></div>
                ))
              : displayedJobs.map((job, index) => (
                  <Motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white p-12 border border-gray-100 shadow-sm hover:border-cafe-orange hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full relative"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-10">
                        <span className="text-[10px] font-black text-cafe-orange uppercase tracking-widest px-3 py-1 bg-cafe-orange/5 rounded-full">
                          {job.status}
                        </span>
                        <Briefcase
                          size={20}
                          className="text-gray-200 group-hover:text-cafe-maroon transition-colors"
                        />
                      </div>

                      <h3 className="text-2xl font-black text-cafe-maroon uppercase tracking-tight mb-6 leading-tight">
                        {job.title}
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-500">
                          <MapPin size={16} className="text-cafe-orange" />
                          <span className="text-sm font-bold uppercase tracking-tighter">
                            {job.branch?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                          <CircleDollarSign
                            size={16}
                            className="text-cafe-orange"
                          />
                          <span className="text-sm font-medium">
                            {job.salary_range || "Competitive Salary"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12">
                      <button
                        onClick={() => handleApplyJob(job.id)}
                        className="w-full py-5 bg-cafe-maroon text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cafe-orange transition-all shadow-xl active:scale-95"
                      >
                        Apply Now
                      </button>
                    </div>

                    <div className="absolute top-12 right-12 text-gray-50 group-hover:text-cafe-orange/10 font-black text-6xl pointer-events-none transition-colors">
                      0{index + 1}
                    </div>
                  </Motion.div>
                ))}
          </div>

          {!jobsLoading && jobs.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-sm">
              <p className="text-gray-400 font-bold uppercase tracking-widest">
                Belum ada lowongan yang dibuka.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* --- LOCATION --- */}
      <section
        id="location"
        className="py-32 bg-white px-6 md:px-20 border-b border-gray-100"
      >
        <div className="max-w-400 mx-auto">
          <div className="grid lg:grid-cols-12 gap-24 items-center mb-32">
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-cafe-brick text-[11px] font-black uppercase tracking-[0.5em]">
                  Headquarter
                </span>
                <h2 className="text-6xl font-black text-cafe-maroon mt-4 uppercase tracking-tighter">
                  Central <span className="text-cafe-orange">Office.</span>
                </h2>
              </div>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-gray-100 w-full"></div>
                  <div className="h-6 bg-gray-100 w-2/3"></div>
                </div>
              ) : (
                <div className="pl-8 border-l-2 border-cafe-orange/20 space-y-6">
                  <p className="text-2xl font-medium text-cafe-maroon/80 leading-relaxed">
                    {mainOffice?.name}
                  </p>
                  <p className="text-lg text-gray-500 italic">
                    {mainOffice?.location}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 h-125 bg-gray-50 border-10 border-white shadow-2xl rounded-sm overflow-hidden relative">
              <iframe
                title="HQ Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25553.76206595683!2d112.0301912918209!3d-7.604859810187884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7847257f24bed5%3A0xf08ee618fb307d6f!2sPT%20Imersa%20Solusi%20Teknologi!5e0!3m2!1sid!2sid!4v1775620631088!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>

          <div className="pt-24 border-t border-gray-100">
            <div className="flex justify-between items-end mb-16 px-4">
              <div>
                <span className="text-cafe-brick text-[11px] font-black uppercase tracking-[0.5em]">
                  Explore Networks
                </span>
                <h3 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter mt-3">
                  Other <span className="text-cafe-orange">Branches.</span>
                </h3>
              </div>

              {!loading && otherBranches.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-[11px] font-bold uppercase tracking-widest text-cafe-maroon/70 border-b-2 border-cafe-orange/30 pb-2 hover:border-cafe-orange hover:text-cafe-orange transition-all duration-300"
                >
                  {showAll ? "Show Less" : "View All Branches"}
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading
                ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : displayedBranches.map((branch, index) => (
                    <Motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-white p-12 rounded-sm border-2 border-cafe-orange/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] hover:border-cafe-orange/20 hover:shadow-[0_25px_60px_-15px_rgba(126,38,46,0.1)] transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-cafe-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                      <div className="w-16 h-16 bg-cafe-orange/5 rounded-full flex items-center justify-center text-cafe-orange mb-8 group-hover:bg-cafe-orange group-hover:text-white transition-colors duration-300">
                        <MapPin size={28} />
                      </div>

                      <h4 className="text-2xl font-black text-cafe-maroon/95 mb-4 uppercase tracking-tight leading-snug">
                        {branch.name}
                      </h4>

                      <p className="text-[15px] font-medium text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-6 group-hover:border-cafe-orange/20 transition-colors">
                        {branch.location}
                      </p>
                    </Motion.div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-cafe-maroon px-6 md:px-20 py-24 text-white">
        <div className="max-w-400 mx-auto grid lg:grid-cols-4 md:grid-cols-2 gap-16">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-cafe-maroon font-black">
                E
              </div>
              <span className="text-xl font-black tracking-[-0.07em] text-white">
                ENGLISH CAFE.
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-60 mb-10">
              Mengubah paradigma pendidikan melalui kenyamanan kultur cafe. #1
              Cafe-Style Learning Community.
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-black text-[11px] uppercase tracking-[0.5em] text-cafe-orange mb-9">
              Navigation
            </h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
              <li>
                <a href="#" className="hover:text-cafe-orange transition-all">
                  Teacher Training
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cafe-orange transition-all">
                  HQ Semarang
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cafe-orange transition-all">
                  Job Board
                </a>
              </li>
            </ul>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-black text-[11px] uppercase tracking-[0.5em] text-cafe-orange mb-9">
              Contact
            </h4>
            <ul className="space-y-6 text-sm font-medium text-white/80 border-l border-white/10 pl-6">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-cafe-orange" />
                hello@englishcafe.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-cafe-orange" />
                +62 24 1234 567
              </li>
            </ul>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-black text-[11px] uppercase tracking-[0.5em] text-cafe-orange mb-9">
              Legal
            </h4>
            <div className="flex flex-col gap-4 text-[11px] font-bold uppercase tracking-[0.3em] opacity-40">
              <a href="#" className="hover:opacity-100 transition-opacity">
                Privacy Policy
              </a>
              <a href="#" className="hover:opacity-100 transition-opacity">
                Terms of Work
              </a>
              <p className="mt-10 pt-10 border-t border-white/5 italic text-[10px] leading-loose opacity-60">
                © 2026 ENGLISH CAFE INDONESIA.
                <br />
                BUILT FOR IMPACT.
              </p>
            </div>
          </Motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
