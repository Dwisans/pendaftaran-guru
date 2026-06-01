<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\JobOpeningController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\HrdController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ApplicantController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Endpoint untuk diakses React Landing Page
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/job-openings', [JobOpeningController::class, 'index']);
Route::get('/job-openings/{id}', [JobOpeningController::class, 'show']);

// --- AUTHENTICATION ROUTES ---

// 1. Breeze & Manual Auth (Register & Login Manual)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. Google OAuth (Berdampingan)
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// 3. Protected Routes (Gunakan Middleware Sanctum bawaan Breeze/Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // KELOMPOK KHUSUS ADMIN (Infrastruktur & User)
    Route::middleware('role:ADMIN')->group(function () {
        // Dashboard Stats Admin
        Route::get('/admin/stats', [AdminController::class, 'dashboardStats']);

        // User Management
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::post('/admin/users', [AdminController::class, 'storeUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'destroyUser']);

        // Branch Management CRUD
        Route::get('/admin/branches', [AdminController::class, 'indexBranch']);
        Route::post('/admin/branches', [AdminController::class, 'storeBranch']);
        Route::put('/admin/branches/{id}', [AdminController::class, 'updateBranch']);
        Route::delete('/admin/branches/{id}', [AdminController::class, 'destroyBranch']);
        
        // Report Management
        Route::get('/admin/report', [AdminController::class, 'rekrutmenReport']);
    });

    // KELOMPOK KHUSUS HRD (Proses Rekrutmen)
    Route::middleware('role:HRD')->group(function () {
        Route::get('/hrd/applications', [HrdController::class, 'index']);
        Route::patch('/hrd/applications/{id}/status', [HrdController::class, 'updateStatus']);
        Route::post('/hrd/jobs', [HrdController::class, 'storeJob']);
        Route::patch('/hrd/jobs/{id}/toggle', [HrdController::class, 'toggleStatus']);
        Route::delete('/hrd/jobs/{id}', [HrdController::class, 'destroy']);
    });

    // KELOMPOK YANG BISA DIAKSES ADMIN & HRD
    Route::middleware('role:ADMIN,HRD')->group(function () {
        Route::get('/internal/reports', [ReportController::class, 'summary']);
    });

    // KELOMPOK PELAMAR
    Route::middleware('role:PELAMAR')->group(function () {
        Route::get('/applicant/dashboard', [ApplicantController::class, 'getDashboardData']);
        // Route Baru untuk Applicant
        Route::get('/applicant/stats', [ApplicantController::class, 'dashboardStats']);
        Route::post('/applicant/update', [ApplicantController::class, 'updateProfile']);
        Route::post('/applicant/upload-document', [ApplicantController::class, 'uploadDocument']);
        Route::get('/applicant/documents', [ApplicantController::class, 'getDocuments']);
        Route::delete('/applicant/documents/{id}', [ApplicantController::class, 'deleteDocument']);
        Route::get('/applicant/my-applications', [ApplicantController::class, 'getAllApplications']);
        Route::delete('/applicant/applications/{id}', [ApplicantController::class, 'destroy']);

        // Route untuk melamar pekerjaan
        Route::post('/applicant/apply', [ApplicantController::class, 'apply']);
    });
});
