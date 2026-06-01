import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/dashboard/Sidebar";
import Overview from "./pages/dashboard/Overview";
import Profile from "./pages/dashboard/Profile";
import Documents from "./pages/dashboard/Documents";
import BrowseJobs from "./pages/dashboard/BrowseJobs";
import JobDetail from "./pages/dashboard/JobDetail";
import MyApplications from "./pages/dashboard/MyApplications";
import HrdOverview from "./pages/dashboard/hrd/HrdOverview";
import HrdApplications from "./pages/dashboard/hrd/HrdApplications";
import HrdJobs from "./pages/dashboard/hrd/HrdJobs";
import AdminOverview from "./pages/dashboard/admin/AdminOverview";
import AdminUsers from "./pages/dashboard/admin/AdminUsers";
import AdminBranches from "./pages/dashboard/admin/AdminBranches";
import AdminReport from "./pages/dashboard/admin/AdminReport";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Publik */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Halaman Dashboard dengan Layout Sidebar */}
        <Route
          path="/dashboard/*"
          element={
            <div className="flex min-h-screen w-full bg-gray-50">
              {/* Sidebar tetap di kiri */}
              <Sidebar />

              {/* Konten Utama */}
              <main className="flex-1 ml-64">
                <Routes>
                  {/* ================= ROUTES PELAMAR ================= */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute allowedRoles={["PELAMAR"]}>
                        <Overview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute allowedRoles={["PELAMAR"]}>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="documents"
                    element={
                      <ProtectedRoute allowedRoles={["PELAMAR"]}>
                        <Documents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="browse-jobs"
                    element={
                      <ProtectedRoute allowedRoles={["PELAMAR"]}>
                        <BrowseJobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="browse-jobs/:jobId"
                    element={
                      <ProtectedRoute allowedRoles={["PELAMAR"]}>
                        <JobDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="my-applications"
                    element={
                      <ProtectedRoute allowedRoles={["PELAMAR"]}>
                        <MyApplications />
                      </ProtectedRoute>
                    }
                  />

                  {/* ================= ROUTES HRD ================= */}
                  <Route
                    path="hrd"
                    element={
                      <ProtectedRoute allowedRoles={["HRD"]}>
                        <HrdOverview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="hrd/applications"
                    element={
                      <ProtectedRoute allowedRoles={["HRD"]}>
                        <HrdApplications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="hrd/jobs"
                    element={
                      <ProtectedRoute allowedRoles={["HRD"]}>
                        <HrdJobs />
                      </ProtectedRoute>
                    }
                  />

                  {/* ================= ROUTES ADMIN ================= */}
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminOverview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/users"
                    element={
                      <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/branches"
                    element={
                      <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminBranches />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/report"
                    element={
                      <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminReport />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback jika sub-route di dalam /dashboard tidak ditemukan */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </main>
            </div>
          }
        />

        {/* Fallback jika route utama tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
