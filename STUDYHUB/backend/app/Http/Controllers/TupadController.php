<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tupad;

class TupadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'series_no' => 'required|string|max:255',
            'adl_no' => 'required|string|max:255',
            'pfo' => 'required|string|max:255',
            'target' => 'required|integer',
            'initial' => 'required|numeric',
            'status' => 'required|string|max:255',
            'date_received' => 'required|date',
            'duration' => 'required|integer',
            'location' => 'required|string|max:255',
            'budget' => 'required|numeric|min:0',
        ]);

        $tupad = Tupad::create($request->all());

        return response()->json([
            'message' => 'Tupad record created successfully!',
            'data' => $tupad,
        ], 201);
    }

    public function getAll()
    {
        $tupadRecords = Tupad::all();

        return response()->json([
            'data' => $tupadRecords,
        ]);
    }

    public function getLatestSeriesNo($pfo)
{
    $latestSeries = Tupad::where('pfo', $pfo)->max('series_no'); // Get highest series_no
    $latestSeriesNumber = $latestSeries ? intval(substr($latestSeries, -3)) : 0; // Extract last 3 digits
    return response()->json(['latestSeriesNo' => $latestSeriesNumber]);
}

}
