<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobOpening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HrdController extends Controller
{
    public function index()
    {
        // Ambil lamaran, relasi ke pelamar (applicant), user (untuk nama/email), 
        // lowongan (jobOpening), dan cabang (branch)
        $applications = Application::with(['applicant.user', 'applicant.documents', 'jobOpening.branch'])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $applications]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Submitted,Under Review,Interview,Accepted,Rejected',
            'hrd_notes' => 'nullable|string'
        ]);

        $app = Application::findOrFail($id);
        $app->update([
            'status' => $request->status,
            'hrd_notes' => $request->hrd_notes
        ]);

        return response()->json(['success' => true, 'message' => 'Status lamaran berhasil diperbarui']);
    }

    /**
     * Menyimpan lowongan baru ke database
     */
    public function storeJob(Request $request)
    {
        $request->validate([
            'title'        => 'required|string',
            'branch_id'    => 'required|exists:branches,id',
            'description'  => 'required|string',
            'requirements' => 'required|string',
        ]);

        $job = \App\Models\JobOpening::create([
            'title'        => $request->title,
            'branch_id'    => $request->branch_id,
            'description'  => $request->description,
            'requirements' => $request->requirements,
            'status'       => 'open',
        ]);

        return response()->json($job, 201);
    }

    public function toggleStatus($id)
    {
        $job = JobOpening::findOrFail($id);
        $job->status = ($job->status === 'open') ? 'closed' : 'open';
        $job->save();

        return response()->json(['message' => 'Status lowongan diperbarui', 'data' => $job]);
    }

    public function destroy($id)
    {
        $job = JobOpening::findOrFail($id);
        $job->delete();

        return response()->json(['message' => 'Lowongan berhasil dihapus']);
    }
}
