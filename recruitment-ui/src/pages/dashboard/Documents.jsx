import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, Trash2, ExternalLink, ShieldCheck } from "lucide-react";
import axios from "axios";
import GlobalModal from "../../components/ui/GlobalModal";
import { Spinner } from "../../components/SkeletonCard";

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
      const response = await axios.get("http://localhost:8000/api/applicant/documents", { headers: { Authorization: `Bearer ${token}` } });
      setMyDocuments(response.data.data);
    } catch { console.error("Gagal memuat dokumen"); }
    finally { setLoading(false); }
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
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus dokumen ini dari sistem?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/applicant/documents/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchDocuments();
    } catch {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Gagal menghapus file." });
    }
  };

  return (
    <>
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10 bg-cafe-cream min-h-screen">
        <section className="max-w-6xl mx-auto mb-14">
          <header className="mb-8">
            <span className="text-cafe-orange text-[9px] font-black uppercase tracking-[0.4em]">Vault System</span>
            <h2 className="text-3xl md:text-4xl font-black text-cafe-maroon uppercase tracking-tighter mt-1">
              Document <span className="text-cafe-orange">Upload</span>
            </h2>
          </header>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-wider">Tipe Dokumen</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-cafe-cream border-2 border-gray-100 rounded-lg p-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cafe-orange transition-all">
                  <option value="CV">Curriculum Vitae</option>
                  <option value="KTP">Kartu Tanda Penduduk</option>
                  <option value="CERTIFICATE">Ijazah / Sertifikat</option>
                </select>
              </div>
              <div className="relative group">
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 tracking-wider">File Seleksi</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-3.5 text-center group-hover:border-cafe-orange transition-all bg-cafe-cream/50">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-[9px] font-bold text-gray-400 uppercase truncate">
                    {file ? <span className="text-cafe-maroon">{file.name}</span> : "Pilih File (Max 2MB)"}
                  </p>
                </div>
              </div>
              <button disabled={uploading || !file}
                className="bg-cafe-maroon text-white py-4 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-cafe-orange transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50">
                {uploading ? <Loader2 className="animate-spin" size={15} /> : <Upload size={15} />}
                {uploading ? "MENGUNGGAH..." : "KIRIM DOKUMEN"}
              </button>
            </form>
          </div>
        </section>

        <section className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[11px] font-black text-cafe-maroon uppercase tracking-widest">Dokumen Tersimpan</h3>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{myDocuments.length} Berkas</span>
          </div>
          {loading ? <Spinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {myDocuments.map((doc) => (
                  <Motion.div key={doc.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <ShieldCheck size={13} className="text-green-500" />
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="mb-5">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg text-cafe-orange flex items-center justify-center mb-4">
                          <FileText size={18} />
                        </div>
                        <h4 className="text-[11px] font-black text-cafe-maroon uppercase tracking-widest mb-1">{doc.document_type}</h4>
                        <p className="text-[8px] text-gray-400 font-bold uppercase">Upload: {new Date(doc.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-auto flex border-t border-gray-50 pt-4 gap-2">
                        <a href={`http://localhost:8000/storage/${doc.file_path}`} target="_blank" rel="noreferrer"
                          className="flex-1 bg-cafe-cream text-gray-400 py-2.5 rounded-lg flex items-center justify-center hover:bg-cafe-maroon hover:text-white transition-all">
                          <ExternalLink size={13} />
                        </a>
                        <button onClick={() => handleDelete(doc.id)}
                          className="w-11 bg-cafe-cream text-gray-400 py-2.5 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </AnimatePresence>
              {myDocuments.length === 0 && !loading && (
                <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-50 flex flex-col items-center justify-center opacity-50">
                  <FileText size={36} className="text-gray-200 mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Belum ada data di arsip</p>
                </div>
              )}
            </div>
          )}
        </section>
      </Motion.div>
      <GlobalModal {...modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </>
  );
}
