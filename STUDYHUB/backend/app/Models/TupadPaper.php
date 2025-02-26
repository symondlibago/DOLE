<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TupadPaper extends Model
{
    use HasFactory;

    protected $fillable = [
        'tupad_id',
        'budget',
        'received_from_budget',
        'tssd_sir_jv',
        'received_from_tssd_sir_jv',
        'rd',
        'received_from_rd',
    ];

    public function tupad()
    {
        return $this->belongsTo(Tupad::class, 'tupad_id');
    }
    

}