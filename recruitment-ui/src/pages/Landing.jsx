import { Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { SkeletonCard } from "../components/SkeletonCard";
import logoSrc from "../assets/logo.png";
import {
  ArrowRight,
  MapPin,
  Award,
  Users,
  Zap,
  Target,
  Star,
  Briefcase,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  GraduationCap,
} from "lucide-react";

const API = "http://localhost:8000/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [testiActive, setTestiActive] = useState(0);
  const [testiDir, setTestiDir] = useState(1);
  const [branchPage, setBranchPage] = useState(0);
  const [isLoggedIn] = useState(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    return !!(t && u);
  });
  const [dashboardPath] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      const r = u?.role?.toLowerCase();
      if (r === "admin") return "/dashboard/admin";
      if (r === "hrd") return "/dashboard/hrd";
    } catch {
      /* ignore */
    }
    return "/dashboard";
  });

  useEffect(() => {
    axios
      .get(`${API}/branches`)
      .then((r) => setBranches(r.data.data))
      .catch(console.error)
      .finally(() => setTimeout(() => setLoading(false), 400));
    axios
      .get(`${API}/job-openings`)
      .then((r) => setJobs(r.data.data))
      .catch(console.error)
      .finally(() => setTimeout(() => setJobsLoading(false), 400));
  }, []);

  const testimonials = [
    {
      name: "Rina Amelia",
      role: "Mahasiswi Semester 6",
      quote:
        "Metode belajar di English Cafe bikin saya percaya diri bicara Inggris. Suasananya santai, nggak kaku seperti kursus biasa.",
      rating: 5,
    },
    {
      name: "Dimas Prayoga",
      role: "Karyawan Swasta",
      quote:
        "Dulu saya takut bicara Inggris, sekarang bisa presentasi di depan klien asing. Kelas speaking-nya sangat praktis dan aplikatif.",
      rating: 5,
    },
    {
      name: "Siti Nurhaliza",
      role: "Fresh Graduate",
      quote:
        "Persiapan TOEFL di English Cafe sangat membantu saya lolos beasiswa. Tutornya sabar dan cara ngajarnya asik banget.",
      rating: 5,
    },
    {
      name: "Bambang Hartono",
      role: "Pemilik UMKM",
      quote:
        "Kursus English for Business-nya tepat sasaran. Saya jadi lebih percaya diri saat berkomunikasi dengan buyer luar negeri.",
      rating: 5,
    },
    {
      name: "Dewi Sartika",
      role: "Siswi SMA",
      quote:
        "Belajar grammar di sini beda banget sama di sekolah. Lebih gampang dipahami karena dikemas dengan diskusi seru.",
      rating: 4,
    },
  ];

  const mainOffice = branches.find((b) => b.id === 1) || branches[0];
  const branchStep = 3;
  const branchPages = Math.max(1, Math.ceil(branches.length / branchStep));
  const displayed = branches.slice(
    branchPage * branchStep,
    branchPage * branchStep + branchStep,
  );
  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 3);

  const nextTesti = () => {
    setTestiDir(1);
    setTestiActive((p) => (p + 1) % testimonials.length);
  };
  const prevTesti = () => {
    setTestiDir(-1);
    setTestiActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  };
  const goTesti = (i) => {
    setTestiDir(i > testiActive ? 1 : -1);
    setTestiActive(i);
  };
  const nextBranch = () =>
    setBranchPage((p) => Math.min(p + 1, branchPages - 1));
  const prevBranch = () => setBranchPage((p) => Math.max(p - 1, 0));

  const handleApplyJob = (jobId) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData || token === "undefined" || token === "null") {
      return navigate("/login", {
        state: { redirectTo: `/dashboard/browse-jobs/${jobId}` },
      });
    }
    try {
      const user = JSON.parse(userData);
      const role = user.role?.toLowerCase();
      if (role === "pelamar") navigate(`/dashboard/browse-jobs/${jobId}`);
      else navigate(`/dashboard/${role}`);
    } catch {
      navigate("/login");
    }
  };

  const stats = [
    { label: "Founded", val: "2012" },
    { label: "Active Tutors", val: "50+" },
    { label: "Community", val: "15k+" },
    { label: "Centers", val: "12" },
  ];

  const values = [
    {
      t: "Non-Formal Approach",
      d: "Belajar tanpa tekanan, komunitas berbasis dukungan.",
      i: Zap,
    },
    {
      t: "Speaking Fluency",
      d: "Fokus pada kepercayaan diri dan kefasihan bicara.",
      i: Target,
    },
    {
      t: "Equal Culture",
      d: "Progresif, santai, dan setara untuk semua.",
      i: Users,
    },
    {
      t: "Selective Mentors",
      d: "Hanya tutor profesional terbaik yang mengajar.",
      i: Award,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-cafe-maroon antialiased overflow-x-hidden selection:bg-cafe-maroon selection:text-white pt-18">
      {/* ===== NAVIGATION ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100/50">
        <nav
          className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-18"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="English Cafe Home"
          >
            <div className="w-9 h-9 rounded-lg bg-cafe-maroon flex items-center justify-center overflow-hidden">
              <img
                src={logoSrc}
                alt="English Cafe"
                className="w-full h-full object-contain brightness-0 invert p-1.5"
              />
            </div>
            <span className="text-base font-black tracking-tight text-cafe-maroon">
              ENGLISH CAFE.
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {["About", "Career", "Location"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] font-bold text-cafe-maroon/50 uppercase tracking-[0.25em] hover:text-cafe-maroon transition-all duration-300 relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-cafe-orange after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </div>
          {isLoggedIn ? (
            <Link
              to={dashboardPath}
              className="bg-cafe-maroon text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cafe-orange transition-all duration-300 shadow-lg shadow-cafe-maroon/15 active:scale-[0.97] rounded-lg"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-[10px] font-bold text-cafe-maroon/60 uppercase tracking-[0.2em] hover:text-cafe-maroon transition-colors px-4 py-2.5"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-cafe-maroon text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cafe-orange transition-all duration-300 shadow-lg shadow-cafe-maroon/15 active:scale-[0.97] rounded-lg"
              >
                Daftar
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-linear-to-b from-white to-cafe-cream min-h-[85vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[90%] bg-linear-to-bl from-cafe-orange/3 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[60%] bg-linear-to-tr from-cafe-maroon/2 to-transparent rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.012]"
            style={{
              backgroundImage: `radial-gradient(#7E262E 0.5px, transparent 0.5px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-14 items-center">
            <article className="lg:col-span-6">
              <Motion.div initial="hidden" animate="visible" variants={stagger}>
                <Motion.div
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-cafe-maroon/5 rounded-full border border-cafe-maroon/10 mb-8"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cafe-orange" />
                  <span className="text-cafe-maroon/60 font-bold text-[8px] uppercase tracking-[0.3em]">
                    Rekrutmen Guru 2026
                  </span>
                </Motion.div>
                <Motion.h1
                  variants={fadeUp}
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-cafe-maroon leading-[0.88] tracking-tight"
                >
                  Bangun Karier
                  <br />
                  <span className="text-cafe-brick">Bersama</span>{" "}
                  <span className="text-cafe-orange relative">
                    Kami.
                    <span className="absolute -bottom-2 left-0 w-full h-3 bg-cafe-orange/10 -skew-x-6" />
                  </span>
                </Motion.h1>
                <Motion.p
                  variants={fadeUp}
                  className="text-base md:text-lg text-cafe-maroon/60 leading-relaxed mt-6 max-w-lg"
                >
                  English Cafe membuka kesempatan bagi pendidik inspiratif untuk
                  bergabung dalam ekosistem belajar yang progresif, kreatif, dan
                  penuh dampak.
                </Motion.p>
                <Motion.div
                  variants={fadeUp}
                  className="flex flex-wrap gap-4 items-center mt-9"
                >
                  <a
                    href="#career"
                    className="group inline-flex items-center gap-2.5 bg-cafe-maroon text-white px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] rounded-lg hover:bg-cafe-orange transition-all duration-300 shadow-xl shadow-cafe-maroon/15 active:scale-[0.97]"
                  >
                    Jelajahi Posisi
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                  <a
                    href="#about"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-cafe-maroon/50 uppercase tracking-[0.2em] hover:text-cafe-maroon transition-colors"
                  >
                    Tentang Kami <ChevronRight size={12} />
                  </a>
                </Motion.div>
              </Motion.div>
            </article>
            <Motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 relative"
            >
              <div className="relative">
                <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop"
                    alt="Suasana belajar English Cafe"
                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-cafe-maroon/20 via-transparent to-transparent" />
                </div>
                <Motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-4 -left-4 bg-white px-5 py-3.5 rounded-xl shadow-xl border border-gray-100 hidden md:flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 bg-cafe-orange/10 rounded-full flex items-center justify-center text-cafe-orange">
                    <Star size={18} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                      Alumni Rating
                    </p>
                    <p className="text-xl font-black text-cafe-maroon">4.9/5</p>
                  </div>
                </Motion.div>
                <Motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 -right-3 bg-white px-4 py-3 rounded-xl shadow-xl border border-gray-100 hidden lg:flex items-center gap-3"
                >
                  <GraduationCap size={18} className="text-cafe-brick" />
                  <p className="font-black text-[9px] uppercase text-cafe-maroon tracking-wider">
                    Impact Driven
                  </p>
                </Motion.div>
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section
        className="relative bg-cafe-maroon"
        aria-label="Company statistics"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,134,51,0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 relative z-10">
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center"
          >
            {stats.map((s) => (
              <Motion.div key={s.label} variants={fadeUp} className="relative">
                <p className="text-5xl md:text-6xl font-black text-cafe-orange tracking-tight leading-none">
                  {s.val}
                </p>
                <div className="w-6 h-px bg-cafe-orange/30 mx-auto my-3" />
                <p className="text-white/40 font-bold text-[8px] uppercase tracking-[0.45em]">
                  {s.label}
                </p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section
        id="about"
        className="relative py-28 md:py-36 bg-cafe-cream overflow-hidden"
        aria-label="About English Cafe"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-14 items-center mb-28">
            <Motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                  alt="Suasana belajar interaktif English Cafe"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white px-5 py-3 rounded-xl shadow-xl border border-gray-100 hidden md:block">
                <p className="text-[8px] font-bold text-cafe-orange uppercase tracking-[0.3em]">
                  Since
                </p>
                <p className="text-2xl font-black text-cafe-maroon">2012</p>
              </div>
            </Motion.div>
            <article className="lg:col-span-7">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">
                  Who We Are
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-cafe-maroon tracking-tight leading-[1.05] mt-4 mb-8">
                  Melawan Kekakuan{" "}
                  <span className="text-cafe-brick relative">
                    Formalitas.
                    <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-cafe-brick/10 -skew-x-6" />
                  </span>
                </h2>
                <p className="text-base text-cafe-maroon/65 leading-relaxed border-l-2 border-cafe-orange/30 pl-5">
                  Berdiri sejak 2012, kami membangun jembatan antara metode
                  belajar yang efektif dan kenyamanan suasana cafe. Sebuah
                  ekosistem pendidikan non-formal yang mengutamakan kepercayaan
                  diri dan kefasihan berbicara.
                </p>
              </Motion.div>
            </article>
          </div>

          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {values.map((item, i) => {
              const Icon = item.i;
              return (
                <Motion.div
                  key={i}
                  variants={fadeUp}
                  className="group bg-cafe-cream p-6 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-cafe-orange/5 rounded-lg flex items-center justify-center text-cafe-orange mb-5 group-hover:bg-cafe-orange group-hover:text-white transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <h5 className="font-black text-[10px] uppercase tracking-[0.25em] text-cafe-maroon mb-1.5">
                    {item.t}
                  </h5>
                  <p className="text-sm text-cafe-maroon/50 leading-relaxed">
                    {item.d}
                  </p>
                </Motion.div>
              );
            })}
          </Motion.div>
        </div>
      </section>

      {/* ===== JOB OPENINGS ===== */}
      <section
        id="career"
        className="relative py-28 md:py-36 bg-cafe-cream overflow-hidden"
        aria-label="Available job positions"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6"
          >
            <div>
              <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">
                Careers
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-cafe-maroon tracking-tight mt-2">
                Available <span className="text-cafe-orange">Positions.</span>
              </h2>
            </div>
            {!jobsLoading && jobs.length > 3 && (
              <button
                onClick={() => setShowAllJobs(!showAllJobs)}
                className="text-[10px] font-black uppercase tracking-[0.25em] text-cafe-maroon border-b-2 border-cafe-orange/30 pb-1 hover:text-cafe-orange hover:border-cafe-orange transition-all duration-300 shrink-0"
              >
                {showAllJobs ? "Show Less" : `View All ${jobs.length} Jobs`}{" "}
                <ChevronRight size={12} className="inline" />
              </button>
            )}
          </Motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : displayedJobs.map((job, index) => (
                  <Motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <article className="group bg-white rounded-xl border border-gray-100 p-7 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-400 flex flex-col relative overflow-hidden">
                      <div className="flex items-start justify-between mb-5">
                        <span className="text-[8px] font-black text-cafe-orange uppercase tracking-[0.15em] px-2.5 py-1 bg-cafe-orange/5 rounded-md">
                          {job.status}
                        </span>
                        <Briefcase
                          size={16}
                          className="text-gray-200 group-hover:text-cafe-maroon transition-colors"
                        />
                      </div>
                      <h3 className="text-lg font-black text-cafe-maroon uppercase tracking-tight mb-4 leading-tight min-h-12">
                        {job.title}
                      </h3>
                      <div className="space-y-2.5 mb-auto text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin
                            size={13}
                            className="text-cafe-orange shrink-0"
                          />
                          <span className="font-bold text-[10px] uppercase">
                            {job.branch?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <ShieldCheck
                            size={13}
                            className="text-cafe-orange shrink-0"
                          />
                          <span className="font-medium text-[10px]">
                            {job.salary_range || "Competitive Salary"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplyJob(job.id)}
                        className="mt-6 w-full py-3 bg-cafe-maroon text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-cafe-orange transition-all duration-300 rounded-lg active:scale-[0.98]"
                      >
                        Apply Now
                      </button>
                    </article>
                  </Motion.div>
                ))}
          </div>

          {!jobsLoading && jobs.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
              <Briefcase size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
                Belum ada lowongan yang dibuka.
              </p>
            </div>
          )}

          {!jobsLoading && jobs.length > 0 && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to={isLoggedIn ? "/dashboard/browse-jobs" : "/login"}
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-cafe-maroon text-white rounded-lg text-[10px] font-black uppercase tracking-[0.25em] hover:bg-cafe-orange transition-all duration-300 shadow-lg shadow-cafe-maroon/15 active:scale-[0.97]"
              >
                Lihat Semua Lowongan
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Motion.div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS — SLIDER ===== */}
      <section
        className="relative py-28 md:py-36 bg-cafe-cream overflow-hidden"
        aria-label="Testimonials"
      >
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-cafe-orange/2 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-cafe-maroon tracking-tight mt-2">
              Apa Kata <span className="text-cafe-orange">Mereka.</span>
            </h2>
          </Motion.div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait" custom={testiDir}>
                <Motion.div
                  key={testiActive}
                  custom={testiDir}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-2xl p-10 md:p-14 shadow-lg"
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({
                      length: testimonials[testiActive].rating,
                    }).map((_, s) => (
                      <Star
                        key={s}
                        size={16}
                        className="text-cafe-orange"
                        fill="#F58633"
                      />
                    ))}
                  </div>
                  <p className="text-base md:text-lg text-cafe-maroon/65 leading-relaxed mb-10 italic">
                    &ldquo;{testimonials[testiActive].quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-cafe-maroon flex items-center justify-center text-white font-black text-lg">
                      {testimonials[testiActive].name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-cafe-maroon uppercase">
                        {testimonials[testiActive].name}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        {testimonials[testiActive].role}
                      </p>
                    </div>
                  </div>
                </Motion.div>
              </AnimatePresence>
            </div>

            {/* Arrows */}
            <button
              onClick={prevTesti}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-cafe-maroon hover:bg-cafe-maroon hover:text-white hover:border-cafe-maroon transition-all duration-300"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextTesti}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-cafe-maroon hover:bg-cafe-maroon hover:text-white hover:border-cafe-maroon transition-all duration-300"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTesti(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === testiActive
                      ? "bg-cafe-orange w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section
        id="location"
        className="relative py-28 md:py-36 bg-cafe-cream"
        aria-label="Our locations"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-14 items-center mb-28">
            <Motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5"
            >
              <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">
                Headquarter
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-cafe-maroon tracking-tight mt-2">
                Central <span className="text-cafe-orange">Office.</span>
              </h2>
              {loading ? (
                <div className="space-y-3 mt-6">
                  <div className="shimmer-block h-5 w-3/4" />
                  <div className="shimmer-block h-4 w-1/2" />
                </div>
              ) : (
                <div className="mt-6 pl-5 border-l-2 border-cafe-orange/30 space-y-3">
                  <p className="text-lg font-bold text-cafe-maroon">
                    {mainOffice?.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {mainOffice?.location}
                  </p>
                </div>
              )}
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 aspect-video bg-gray-50 rounded-2xl overflow-hidden shadow-xl"
            >
              <iframe
                title="Headquarter Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.991149574766!2d110.39070857431392!3d-7.790760792229163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5766cc4caa07%3A0xf0cb135fb125d8a1!2sEnglish%20Cafe%20-%20Kursus%20Bahasa%20Inggris%20di%20Jogja!5e0!3m2!1sid!2sid!4v1780323427025!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              />
            </Motion.div>
          </div>

          <div className="pt-20 border-t border-gray-100">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-between items-end mb-10"
            >
              <div>
                <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">
                  Explore Networks
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-cafe-maroon tracking-tight mt-2">
                  Other <span className="text-cafe-orange">Branches</span>
                </h3>
              </div>
              {!loading && branchPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevBranch}
                    disabled={branchPage === 0}
                    className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-cafe-maroon hover:bg-cafe-maroon hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={nextBranch}
                    disabled={branchPage >= branchPages - 1}
                    className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-cafe-maroon hover:bg-cafe-maroon hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </Motion.div>
            <div className="relative min-h-50">
              <Motion.div
                key={branchPage}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : displayed.map((branch) => (
                      <div
                        key={branch.id}
                        className="group bg-white p-6 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-cafe-orange/5 rounded-lg flex items-center justify-center text-cafe-orange mb-5 group-hover:bg-cafe-orange group-hover:text-white transition-all duration-300">
                          <MapPin size={18} />
                        </div>
                        <h4 className="text-base font-black text-cafe-maroon uppercase tracking-tight mb-1.5">
                          {branch.name}
                        </h4>
                        <p className="text-sm text-cafe-maroon/50 leading-relaxed">
                          {branch.location}
                        </p>
                      </div>
                    ))}
              </Motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-cafe-maroon text-white" aria-label="Site footer">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <img
                    src={logoSrc}
                    alt="English Cafe"
                    className="w-full h-full object-contain brightness-0 invert p-1.5"
                  />
                </div>
                <span className="text-base font-black tracking-tight">
                  ENGLISH CAFE.
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Mengubah paradigma pendidikan melalui kenyamanan kultur cafe. #1
                Cafe-Style Learning Community.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-12">
              <div>
                <h4 className="font-black text-[9px] uppercase tracking-[0.4em] text-cafe-orange mb-6">
                  Navigasi
                </h4>
                <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-white/50">
                  <li>
                    <a
                      href="#about"
                      className="hover:text-cafe-orange transition-colors"
                    >
                      Tentang
                    </a>
                  </li>
                  <li>
                    <a
                      href="#career"
                      className="hover:text-cafe-orange transition-colors"
                    >
                      Karier
                    </a>
                  </li>
                  <li>
                    <a
                      href="#location"
                      className="hover:text-cafe-orange transition-colors"
                    >
                      Lokasi
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-[9px] uppercase tracking-[0.4em] text-cafe-orange mb-6">
                  Kontak
                </h4>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <Mail size={12} className="text-cafe-orange shrink-0" />{" "}
                    hello@englishcafe.com
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone size={12} className="text-cafe-orange shrink-0" />{" "}
                    +62 24 1234 567
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-[9px] uppercase tracking-[0.4em] text-cafe-orange mb-6">
                  Legal
                </h4>
                <div className="space-y-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                  <a
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Kebijakan Privasi
                  </a>
                  <a
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Syarat Ketentuan
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/5 text-center">
            <p className="text-[9px] text-white/30">
              &copy; 2026 ENGLISH CAFE INDONESIA. Built for Impact.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
