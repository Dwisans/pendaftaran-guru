<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = ['name', 'location'];

    public function jobOpenings()
    {
        return $this->hasMany(JobOpening::class);
    }
}