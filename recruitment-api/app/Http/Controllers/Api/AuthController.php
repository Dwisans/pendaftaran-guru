<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Applicant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validasi input dari React
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // Harus ada password_confirmation
            'phone'    => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Gunakan Transaction agar jika salah satu gagal, data tidak tersimpan setengah-setengah
        DB::beginTransaction();

        try {
            // Simpan ke tabel Users
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'PELAMAR', // Default role untuk registrasi publik
            ]);

            // Simpan ke tabel Applicants (Data Profil Awal)
            Applicant::create([
                'user_id'          => $user->id,
                'phone'            => $request->phone,
                'address'          => '-', // Akan diupdate nanti di dashboard
                'education'        => '-',
                'experience_years' => 0,
            ]);

            DB::commit();

            // 3. Buat Token Akses (Kunci untuk React)
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message'      => 'Registrasi Berhasil!',
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan sistem.'], 500);
        }
    }

    public function login(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Cek User di Database
        $user = User::where('email', $request->email)->first();

        // 3. Verifikasi Password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        // 4. Buat Token Baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login Berhasil!',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role, // Penting untuk menentukan dashboard di React
            ]
        ]);
    }

    public function me(Request $request)
    {
        // Eager load 'applicant' untuk mendapatkan data profil lengkap
        // Eager load 'applicant.documents' jika ingin tahu jumlah dokumen di sidebar
        $user = $request->user()->load(['applicant']);

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    // Menghapus token (Logout)
    public function logout(Request $request)
    {
        // Menghapus token yang sedang digunakan saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function redirectToGoogle()
    {
        // Menggunakan driver() secara eksplisit sebelum stateless()
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            // Ambil user dengan driver google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Cari user berdasarkan email
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Jika user belum ada, buat baru
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => null,
                    'role' => 'PELAMAR'
                ]);
            } else {
                // Jika user sudah ada, update google_id-nya saja
                $user->update(['google_id' => $googleUser->getId()]);
            }

            // Cek profil Applicant
            if ($user->role === 'PELAMAR' && !$user->applicant) {
                $user->applicant()->create([
                    'phone' => '-',
                    'address' => '-',
                    'education' => '-',
                    'experience_years' => 0
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect()->to("http://localhost:5173/login?token=" . $token . "&user=" . json_encode($user));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal login dengan Google',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
