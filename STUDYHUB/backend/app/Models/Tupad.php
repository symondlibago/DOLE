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
        'project_title',
        'moi',
        'beneficiaries',
        'voucher_amount',
        'commited_date',
        'commited_date_received',
        'commited_status',
        'actual',
        'pfo',
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
