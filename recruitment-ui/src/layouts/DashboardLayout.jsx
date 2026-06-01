import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Tetap di Kiri */}
      <Sidebar />

      {/* Konten Utama di Kanan */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-end items-center">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">
                Halo, Pelamar!
              </p>
              <p className="text-xs text-gray-500">Status: Aktif</p>
            </div>
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
              P
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
