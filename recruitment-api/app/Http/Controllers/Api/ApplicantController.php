<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Applicant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;

class ApplicantController extends Controller
{
    /**
     * Mengambil statistik untuk Dashboard Overview
     */
    public function dashboardStats(Request $request)
    {
        $user = $request->user();

        // Memastikan data applicant ada (silent create jika belum ada)
        $applicant = $user->applicant()->firstOrCreate(['user_id' => $user->id]);

        $stats = [
            'total_applications' => $user->applications()->count(),
            'pending' => $user->applications()->where('status', 'PENDING')->count(),
            'accepted' => $user->applications()->where('status', 'ACCEPTED')->count(),
            // Mengambil 5 lamaran terakhir beserta data lowongan dan cabangnya
            'recent_applications' => $user->applications()
                ->with(['jobOpening.branch'])
                ->latest()
                ->take(5)
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Menyimpan atau Update profil pelamar
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'address' => 'required|string',
            'education' => 'required|string',
            'experience_years' => 'required|integer|min:0',
        ]);

        // Mendapatkan user yang sedang login melalui token autentikasi
        $user = $request->user();

        // Pastikan query mencari berdasarkan user_id agar data terupdate, bukan membuat baris baru
        $applicant = \App\Models\Applicant::updateOrCreate(
            ['user_id' => $user->id], // Kunci pencarian data lama
            [
                'phone' => $request->phone,
                'address' => $request->address,
                'education' => $request->education,
                'experience_years' => $request->experience_years,
            ]
        );

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'applicant' => $applicant
        ], 200);
    }

    public function uploadDocument(Request $request)
    {
        $request->validate([
            'document_type' => 'required|in:CV,KTP,CERTIFICATE',
            'file' => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        $user = Auth::user();

        // Pastikan kita mengambil applicant_id dari relasi user, bukan user_id langsung
        $applicantId = $user->applicant->id;

        // Simpan file
        $path = $request->file('file')->store('documents', 'public');

        // Gunakan updateOrCreate agar jika user upload ulang tipe yang sama, file lama terupdate
        $document = Document::updateOrCreate(
            [
                'applicant_id' => $applicantId, // PASTIKAN NAMA KOLOM SESUAI MIGRATION
                'document_type' => $request->document_type,
            ],
            [
                'file_path' => $path,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'data' => $document
        ]);
    }

    public function getDocuments()
    {
        $user = Auth::user();
        $documents = Document::where('applicant_id', $user->applicant->id)->get();

        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }

    // app/Http/Controllers/Api/ApplicantController.php

    public function deleteDocument($id)
    {
        $user = Auth::user();
        $document = Document::where('id', $id)
            ->where('applicant_id', $user->applicant->id)
            ->first();

        if (!$document) {
            return response()->json(['success' => false, 'message' => 'Document not found'], 404);
        }

        // Hapus file fisik dari storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json(['success' => true, 'message' => 'Document deleted successfully']);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'job_opening_id' => 'required|exists:job_openings,id',
        ]);

        $user = Auth::user();
        $applicant = $user->applicant;

        if (!$applicant) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found. Please complete your profile first.'
            ], 422);
        }

        // --- LOGIKA PENGECEKAN DOKUMEN ---

        // Ambil semua tipe dokumen yang sudah diunggah pelamar
        $uploadedTypes = $applicant->documents()->pluck('document_type')->toArray();

        // Tentukan dokumen apa saja yang WAJIB ada
        $requiredDocs = ['CV', 'KTP'];

        // Cek apakah ada dokumen wajib yang belum diunggah
        foreach ($requiredDocs as $doc) {
            if (!in_array($doc, $uploadedTypes)) {
                return response()->json([
                    'success' => false,
                    'message' => "You must upload your $doc before applying for a job."
                ], 422);
            }
        }

        // --- LANJUT KE PROSES APPLY JIKA DOKUMEN LENGKAP ---

        $alreadyApplied = Application::where('applicant_id', $applicant->id)
            ->where('job_opening_id', $request->job_opening_id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied for this position.'
            ], 422);
        }

        // Buat data lamaran baru
        Application::create([
            'applicant_id' => $user->applicant->id,
            'job_opening_id' => $request->job_opening_id,
            'status' => 'Submitted', // DISESUAIKAN DENGAN MIGRATION
            'applied_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lamaran berhasil dikirim!'
        ]);
    }

    public function getDashboardData()
    {
        $user = Auth::user();
        $applicantId = $user->applicant->id;

        $stats = [
            'total'        => Application::where('applicant_id', $applicantId)->count(),
            // Kita gabungkan Submitted, Under Review, dan Interview sebagai "In Progress"
            'in_progress'  => Application::where('applicant_id', $applicantId)
                ->whereIn('status', ['Submitted', 'Under Review', 'Interview'])
                ->count(),
            'accepted'     => Application::where('applicant_id', $applicantId)->where('status', 'Accepted')->count(),
            'rejected'     => Application::where('applicant_id', $applicantId)->where('status', 'Rejected')->count(),
        ];

        $recent = Application::with(['jobOpening.branch'])
            ->where('applicant_id', $applicantId)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'recent' => $recent
        ]);
    }

    public function getAllApplications()
    {
        $user = Auth::user();

        $applications = Application::with(['jobOpening.branch'])
            ->where('applicant_id', $user->applicant->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    /**
     * Membatalkan / menghapus lamaran pelamar.
     */
    public function destroy($id)
    {
        // 1. Cari data Applicant (Pelamar) berdasarkan user_id yang sedang login
        $applicant = Applicant::where('user_id', Auth::id())->first();

        if (!$applicant) {
            return response()->json([
                'success' => false,
                'message' => 'Profil pelamar tidak ditemukan.'
            ], 404);
        }

        // 2. Cari lamaran menggunakan 'applicant_id' (bukan user_id)
        $application = Application::where('id', $id)
            ->where('applicant_id', $applicant->id) // Menyesuaikan foreign key asli database Anda
            ->first();

        // 3. Jika data lamaran tidak ditemukan
        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Data lamaran tidak ditemukan atau Anda tidak memiliki akses.'
            ], 404);
        }

        // 4. Aturan bisnis: Hanya boleh dibatalkan jika statusnya masih 'Submitted'
        if ($application->status !== 'Submitted') {
            return response()->json([
                'success' => false,
                'message' => 'Lamaran tidak dapat dibatalkan karena sedang diproses oleh HRD.'
            ], 400);
        }

        // 5. Eksekusi hapus data lamaran
        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lamaran berhasil dibatalkan.'
        ], 200);
    }
}
