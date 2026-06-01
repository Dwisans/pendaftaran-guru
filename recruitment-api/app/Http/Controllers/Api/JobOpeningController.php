<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobOpening;
use Illuminate\Http\Request;

class JobOpeningController extends Controller
{
    public function index()
    {
        // Mengambil lowongan dengan status 'open' (sesuai field di model Anda)
        // Eager load 'branch' untuk mendapatkan nama lokasi
        $jobs = JobOpening::with('branch')
            ->withCount('applications')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar Lowongan Aktif',
            'data'    => $jobs
        ], 200);
    }

    public function show($id)
    {
        $job = JobOpening::with('branch')->find($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Lowongan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $job
        ], 200);
    }
}
