<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TupadsPaper;

class TupadsPaperController extends Controller
{

    public function index()
    {
        return response()->json(TupadsPaper::with('tupad')->get());
    }
    


    public function store(Request $request)
{
    \Log::info('Received Data:', $request->all()); // Log the incoming data

    $request->validate([
        'tupad_id' => 'required|exists:tupads,id',
        'budget' => 'nullable|date',
        'received_from_budget' => 'nullable|date',
        'tssd_sir_jv' => 'nullable|date',
        'received_from_tssd_sir_jv' => 'nullable|date',
        'rd' => 'nullable|date',
        'received_from_rd' => 'nullable|date',
    ]);

    $paper = TupadsPaper::create($request->all());

    return response()->json([
        'message' => 'Paper status added successfully',
        'data' => $paper
    ], 201);
}


public function show($id)
{
    $paper = TupadsPaper::with('tupad')->find($id);

    if (!$paper) {
        return response()->json(['message' => 'Record not found'], 404);
    }

    return response()->json($paper);
}



    public function update(Request $request, $id)
    {
        $paper = TupadsPaper::find($id);
        if (!$paper) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $request->validate([
            'tupad_id' => 'required|exists:tupads,id',
            'budget' => 'nullable|date',
            'received_from_budget' => 'nullable|date',
            'tssd_sir_jv' => 'nullable|date',
            'received_from_tssd_sir_jv' => 'nullable|date',
            'rd' => 'nullable|date',
            'received_from_rd' => 'nullable|date',
        ]);

        $paper->update($request->all());
        return response()->json(['message' => 'Paper status updated successfully', 'data' => $paper]);
    }

    public function destroy($id)
    {
        $paper = TupadsPaper::find($id);
        if (!$paper) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $paper->delete();
        return response()->json(['message' => 'Paper status deleted successfully']);
    }
}
