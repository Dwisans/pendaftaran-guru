<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Cek apakah user sudah login
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2. Cek apakah role user ada di dalam daftar role yang diizinkan
        // Kita gunakan strtoupper untuk keamanan jika input di database variasi casing-nya berbeda
        if (!in_array(strtoupper($request->user()->role), array_map('strtoupper', $roles))) {
            return response()->json([
                'message' => 'Forbidden: You do not have the required role.'
            ], 403);
        }

        return $next($request);
    }
}