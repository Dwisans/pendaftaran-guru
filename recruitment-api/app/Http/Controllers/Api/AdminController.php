<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Branch;
use App\Models\Application; // Pastikan Model-model ini sudah ada
use App\Models\JobOpening;   // Pasangkan dengan nama model lowongan Anda
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    // ==========================================
    // 1. DASHBOARD OVERVIEW STATS
    // ==========================================
    public function dashboardStats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_branches' => Branch::count(),
            'total_jobs' => JobOpening::count(), // Sesuaikan jika nama model Anda berbeda
            'total_applications' => Application::count(),
        ]);
    }

    // ==========================================
    // 2. MANAJEMEN USER
    // ==========================================
    public function users()
    {
        // Ambil semua user kecuali admin yang sedang login
        $users = User::where('id', '!=', Auth::id())->latest()->get();
        return response()->json($users);
    }

    public function storeUser(Request $request)
    {
        // 1. Validasi input (gunakan huruf besar agar sinkron dengan database)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string'
        ]);

        // 2. Ambil input role lalu ubah ke huruf kapital
        $roleInput = strtoupper($request->role);

        // 3. Mapping jika frontend mengirim kata 'APPLICANT' agar menjadi 'PELAMAR'
        if ($roleInput === 'APPLICANT' || $roleInput === 'PELAMAR') {
            $roleFinal = 'PELAMAR';
        } elseif ($roleInput === 'HRD') {
            $roleFinal = 'HRD';
        } else {
            $roleFinal = 'ADMIN';
        }

        // 4. Proses Insert ke Database dengan aman
        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password), // Enkripsi password Anda
            'role' => $roleFinal, // Menggunakan role yang sudah dipastikan KAPITAL
        ]);

        return response()->json([
            'message' => 'User berhasil didaftarkan!',
            'data' => $user
        ], 201);
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User berhasil dihapus permanently.']);
    }

    // ==========================================
    // 3. CRUD MANAJEMEN CABANG (BRANCHES)
    // ==========================================
    public function indexBranch()
    {
        return response()->json(Branch::latest()->get());
    }

    public function storeBranch(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:branches,name',
            'location' => 'required|string'
        ]);

        $branch = Branch::create($request->all());
        return response()->json(['message' => 'Cabang berhasil ditambahkan', 'data' => $branch], 201);
    }

    public function updateBranch(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:branches,name,' . $id,
            'location' => 'required|string'
        ]);

        $branch->update($request->all());
        return response()->json(['message' => 'Cabang berhasil diperbarui', 'data' => $branch]);
    }

    public function destroyBranch($id)
    {
        $branch = Branch::findOrFail($id);

        // Proteksi: Jika cabang masih dipakai di lowongan kerja, sebaiknya dicegah / cascade.
        $branch->delete();
        return response()->json(['message' => 'Cabang berhasil dihapus.']);
    }

    public function rekrutmenReport()
    {
        try {
            // 1. Ambil Statistik
            // Ganti \App\Models\JobOpening jika nama model lowongan Anda bukan itu (misal: Job, Lowongan, dll)
            $stats = [
                'total_pelamar' => \App\Models\User::where('role', 'PELAMAR')->count(),
                'total_lowongan' => \App\Models\JobOpening::count(),
                'lamaran_masuk' => \App\Models\Application::count(),
                'diterima' => \App\Models\Application::where('status', 'Accepted')->count(),
            ];

            // 2. Ambil Aplikasi / Berkas Lamaran Masuk
            // PERHATIKAN: 'user', 'jobOpening', 'branch' harus sama persis dengan nama fungsi di Model Application Anda!
            // Jika di model Anda menulisnya 'job_opening' (snake_case), maka ubah di bawah menjadi 'job_opening.branch'
            $applications = \App\Models\Application::with([
                'applicant.user' => function ($query) {
                    $query->select('id', 'name', 'email');
                },
                'jobOpening.branch'
            ])
                ->latest()
                ->take(50)
                ->get();

            return response()->json([
                'stats' => $stats,
                'applications' => $applications
            ], 200);
        } catch (\Exception $e) {
            // Jika error, kirim pesan error aslinya agar kelihatan di Network browser Anda
            return response()->json([
                'message' => 'Gagal memproses laporan: ' . $e->getMessage()
            ], 500);
        }
    }
}
