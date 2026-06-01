<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Penting untuk REST API

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Atribut yang dapat diisi secara massal (Mass Assignment).
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_id',
    ];

    /**
     * Atribut yang harus disembunyikan saat serialisasi (JSON).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Konversi tipe data otomatis.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- RELATIONSHIPS ---

    /**
     * Relasi ke data profil pelamar.
     * Hanya akan terisi jika role adalah 'PELAMAR'.
     */
    public function applicant()
    {
        return $this->hasOne(Applicant::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // --- HELPER FUNCTIONS ---

    /**
     * Cek apakah user adalah Admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'ADMIN';
    }

    /**
     * Cek apakah user adalah HRD.
     */
    public function isHrd(): bool
    {
        return $this->role === 'HRD';
    }

    /**
     * Cek apakah user adalah Pelamar.
     */
    public function isApplicant(): bool
    {
        return $this->role === 'PELAMAR';
    }
}
