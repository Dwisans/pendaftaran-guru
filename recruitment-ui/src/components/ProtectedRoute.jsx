import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const location = useLocation();

  // 1. Jika token tidak ada, tendang langsung ke halaman Login dengan membawa history lokasi asal
  if (!token || !userString) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let user;
  try {
    user = JSON.parse(userString);
  } catch {
    // Jika data user korup/gagal di-parse, hapus sesi dan paksa login ulang
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toUpperCase();

  // 2. Jika role user tidak ada di dalam daftar allowedRoles
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(
      `Akses ditolak untuk role: ${userRole}. Memerlukan salah satu dari:`,
      allowedRoles,
    );

    // Alihkan secara aman ke dashboard bawaan role mereka sendiri
    if (userRole === "ADMIN") {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (userRole === "HRD") {
      return <Navigate to="/dashboard/hrd" replace />;
    } else if (userRole === "PELAMAR") {
      return <Navigate to="/dashboard" replace />;
    } else {
      // Jika role tidak dikenali sama sekali
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  }

  // 3. Jika lolos semua pengecekan, tampilkan konten halaman asli
  return children;
}
