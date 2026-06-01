import { motion as Motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, AlertTriangle } from "lucide-react";

export default function GlobalModal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  showConfirm = false, // Prop baru untuk mengaktifkan mode konfirmasi
  onConfirm, // Prop baru untuk menangkap fungsi eksekusi aksi
}) {
  // Penentuan skema warna dinamis berdasarkan tipe modal
  const getColorScheme = () => {
    if (type === "success") return "bg-green-600";
    if (type === "error" && showConfirm) return "bg-red-600"; // Merah tegas jika konfirmasi hapus
    return "bg-cafe-orange"; // Bawaan untuk info/peringatan biasa
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-cafe-maroon/20 backdrop-blur-sm">
          {/* Overlay klik untuk tutup */}
          <div className="absolute inset-0" onClick={onClose}></div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-sm shadow-[20px_20px_0px_rgba(116,29,29,0.1)] border border-gray-100"
          >
            {/* Dekorasi Garis Atas */}
            <div className={`h-2 w-full ${getColorScheme()}`}></div>

            <div className="p-8">
              {/* Bagian Icon Universal */}
              <div className="flex justify-center mb-6">
                {type === "success" ? (
                  <div className="p-4 bg-green-50 rounded-full">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                ) : showConfirm ? (
                  <div className="p-4 bg-red-50 rounded-full">
                    <AlertTriangle className="text-red-600" size={40} />
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 rounded-full">
                    <AlertCircle className="text-cafe-orange" size={40} />
                  </div>
                )}
              </div>

              {/* Konten Teks */}
              <div className="text-center">
                <h3 className="text-2xl font-black text-cafe-maroon uppercase tracking-tighter mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Tombol Aksi Dinamis */}
              {showConfirm ? (
                // Tampilan tombol ganda bersandingan jika mode konfirmasi diaktifkan
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-50 text-gray-500 py-4 text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-100 transition-all active:scale-95"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={() => {
                      if (onConfirm) onConfirm();
                      onClose();
                    }}
                    className="w-full bg-red-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-md shadow-red-600/10"
                  >
                    Yes, Cancel
                  </button>
                </div>
              ) : (
                // Tampilan default tombol tunggal bawaan sebelumnya
                <button
                  onClick={onClose}
                  className="w-full mt-8 bg-cafe-maroon text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cafe-orange transition-all active:scale-95"
                >
                  Continue
                </button>
              )}
            </div>

            {/* Tombol Close Pojok */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-cafe-maroon transition-colors"
            >
              <X size={18} />
            </button>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
