import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, Loader2, Trash2, ExternalLink, ShieldCheck } from "lucide-react";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";

export default function Documents() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("CV");
  const [uploading, setUploading] = useState(false);
  const [myDocuments, setMyDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "success", title: "", message: "" });

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/applicant/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyDocuments(response.data.data);
    } catch {
      console.error("Gagal memuat dokumen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", docType);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/applicant/upload-document", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      setModalConfig({ isOpen: true, type: "success", title: "Berhasil!", message: `${docType} Anda telah berhasil diamankan di portal.` });
      setFile(null);
      fetchDocuments();
    } catch (err) {
      setModalConfig({ isOpen: true, type: "error", title: "Gagal", message: err.response?.data?.message || "Terjadi kesalahan saat upload." });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus dokumen ini dari sistem?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/applicant/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Gagal menghapus file." });
    }
  };

  return (
    <>
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-[#FAFAFA] min-h-screen">
        
        {/* SECTION 1: HEADER & UPLOAD (ATAS) */}
        <section className="max-w-6xl mx-auto mb-16">
          <header className="mb-8">
            <span className="text-cafe-orange text-[10px] font-black uppercase tracking-[0.4em]">Vault System</span>
            <h2 className="text-4xl font-black text-cafe-maroon uppercase tracking-tighter">
              Document <span className="text-cafe-orange">Upload</span>
            </h2>
          </header>

          <div className="bg-white border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Tipe Dokumen</label>
                <select 
                  className="w-full bg-gray-50 border-2 border-gray-50 p-3 text-[11px] font-black uppercase tracking-widest outline-none focus:border-cafe-orange transition-all"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="CV">Curriculum Vitae</option>
                  <option value="KTP">Kartu Tanda Penduduk</option>
                  <option value="CERTIFICATE">Ijazah / Sertifikat</option>
                </select>
              </div>

              <div className="relative group">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">File Seleksi</label>
                <div className="relative border-2 border-dashed border-gray-200 p-3 text-center group-hover:border-cafe-orange transition-all">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase truncate">
                    {file ? <span className="text-cafe-maroon">{file.name}</span> : "Pilih File (Max 2MB)"}
                  </p>
                </div>
              </div>

              <button disabled={uploading || !file} className="bg-cafe-maroon text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cafe-orange transition-all shadow-lg flex items-center justify-center gap-3">
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                {uploading ? "SINKRONISASI..." : "KIRIM DOKUMEN"}
              </button>
            </form>
          </div>
        </section>

        {/* SECTION 2: DOCUMENT LIST (BAWAH - 3 KOLOM) */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xs font-black text-cafe-maroon uppercase tracking-widest">Dokumen Tersimpan</h3>
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{myDocuments.length} Berkas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {myDocuments.map((doc) => (
                <Motion.div 
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  {/* Dekorasi kecil di sudut */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gray-50 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-green-500" />
                  </div>

                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="w-10 h-10 bg-orange-50 text-cafe-orange flex items-center justify-center mb-4">
                        <FileText size={20} />
                      </div>
                      <h4 className="text-[12px] font-black text-cafe-maroon uppercase tracking-widest mb-1">
                        {doc.document_type}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">
                        Sinkron: {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-auto flex border-t border-gray-50 pt-4 gap-2">
                      <a 
                        href={`http://localhost:8000/storage/${doc.file_path}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 bg-gray-50 text-gray-400 py-2 flex items-center justify-center hover:bg-cafe-maroon hover:text-white transition-all"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="w-12 bg-gray-50 text-gray-400 py-2 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </AnimatePresence>

            {myDocuments.length === 0 && !loading && (
              <div className="col-span-full py-20 bg-white border-2 border-dashed border-gray-50 flex flex-col items-center justify-center opacity-40">
                <FileText size={40} className="text-gray-200 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Belum ada data di arsip</p>
              </div>
            )}
          </div>
        </section>

      </Motion.div>

      <GlobalModal {...modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </>
  );
}