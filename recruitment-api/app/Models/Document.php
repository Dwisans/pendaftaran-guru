<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    // Pastikan fillable sesuai dengan kolom di migration Anda
    protected $fillable = ['applicant_id', 'document_type', 'file_path'];

    /**
     * Relasi balik ke Applicant
     */
    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }
}