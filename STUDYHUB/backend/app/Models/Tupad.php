<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tupad extends Model
{
    use HasFactory;

    protected $fillable = [
        'series_no',
        'adl_no',
        'pfo',
        'target',
        'initial',
        'status',
        'date_received',
        'duration',
        'location',
        'budget',
    ];

    protected $casts = [
        'adl_no' => 'array', // Convert JSON to an array automatically
    ];

    public function history()
    {
        return $this->hasMany(TupadsPaper::class, 'tupad_id');
    }
}
