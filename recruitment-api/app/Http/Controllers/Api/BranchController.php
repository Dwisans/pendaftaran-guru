<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        // Mengambil semua cabang untuk ditampilkan di fitur lokasi/map
        $branches = Branch::all();

        return response()->json([
            'success' => true,
            'message' => 'List semua cabang English Cafe',
            'data'    => $branches
        ], 200);
    }
}