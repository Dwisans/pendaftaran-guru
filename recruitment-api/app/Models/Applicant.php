<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Applicant extends Model
{
    protected $fillable = ['user_id', 'phone', 'address', 'education', 'experience_years'];

    public function user()
    {
        return $this->belongsTo(User::class);
        // Menghubungkan applicants.user_id ke users.id
        return $this->belongsTo(User::class, 'user_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Relasi ke model Document
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
