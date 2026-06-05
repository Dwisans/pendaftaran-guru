import { motion as Motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, AlertTriangle } from "lucide-react";

export default function GlobalModal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  showConfirm = false,
  onConfirm,
}) {
  const iconMap = {
    success: { bg: "bg-green-50", icon: CheckCircle, color: "text-green-600" },
    error: { bg: "bg-red-50", icon: showConfirm ? AlertTriangle : AlertCircle, color: "text-red-600" },
    default: { bg: "bg-orange-50", icon: AlertCircle, color: "text-cafe-orange" },
  };
  const scheme = type === "success" ? iconMap.success : showConfirm ? iconMap.error : iconMap.default;
  const IconComponent = scheme.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cafe-maroon/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <Motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className={`h-1.5 w-full ${type === "success" ? "bg-green-500" : showConfirm ? "bg-red-500" : "bg-cafe-orange"}`} />
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className={`p-4 ${scheme.bg} rounded-full`}>
                  <IconComponent className={scheme.color} size={40} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-cafe-maroon uppercase tracking-tighter mb-3">
                  {title}
                </h3>
                <p className="text-gray-500 text-[11px] font-semibold leading-relaxed">
                  {message}
                </p>
              </div>
              {showConfirm ? (
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-50 text-gray-500 py-3.5 text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-100 transition-all active:scale-95 rounded-lg"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={() => { if (onConfirm) onConfirm(); onClose(); }}
                    className="w-full bg-red-600 text-white py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 rounded-lg shadow-md shadow-red-600/10"
                  >
                    Yes, Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full mt-8 bg-cafe-maroon text-white py-3.5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cafe-orange transition-all active:scale-95 rounded-lg"
                >
                  Continue
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-cafe-maroon transition-colors p-1"
            >
              <X size={16} />
            </button>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
