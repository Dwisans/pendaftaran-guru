<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobOpening extends Model
{
    protected $fillable = [
        'title', 
        'description', 
        'requirements', 
        'branch_id', 
        'status'
    ];

    /**
     * Relasi ke Cabang (Sudah ada sebelumnya)
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Relasi ke Tabel Applications (Pendaftaran)
     * Ini yang memungkinkan kita menggunakan withCount('applications')
     */
    public function applications(): HasMany
    {
        // Pastikan nama model pendaftaran Anda adalah 'Application'
        // Jika nama model Anda berbeda (misal: JobApplication), sesuaikan di bawah ini
        return $this->hasMany(Application::class, 'job_opening_id');
    }
}