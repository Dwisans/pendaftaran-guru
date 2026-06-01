<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['applicant_id', 'job_opening_id', 'status', 'hrd_notes'];

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
        // Menghubungkan applications.applicant_id ke applicants.id
        return $this->belongsTo(Applicant::class, 'applicant_id');
    }

    public function jobOpening()
    {
        return $this->belongsTo(JobOpening::class);
    }
}
