<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;

class ReportController extends Controller
{
    public function summary() {
    return response()->json([
        'success' => true,
        'stats' => [
            'total_applicants' => \App\Models\User::where('role', 'PELAMAR')->count(),
            'total_applications' => \App\Models\Application::count(),
            'pending' => \App\Models\Application::where('status', 'Submitted')->count(),
            'accepted' => \App\Models\Application::where('status', 'Accepted')->count(),
        ]
    ]);
}
}
