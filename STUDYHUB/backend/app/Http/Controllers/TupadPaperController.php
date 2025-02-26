<?php

namespace App\Http\Controllers;

use App\Models\TupadPaper;
use Illuminate\Http\Request;

class TupadPaperController extends Controller
{
    // Get all Tupad Papers
    public function index()
    {
        return response()->json(TupadPaper::all(), 200);
    }

    // Store a new Tupad Paper
    public function store(Request $request)
    {
        $request->validate([
            'tupad_id' => 'required|exists:tupads,id',
            'budget' => 'nullable|date',
            'received_from_budget' => 'nullable|date',
            'tssd_sir_jv' => 'nullable|date',
            'received_from_tssd_sir_jv' => 'nullable|date',
            'rd' => 'nullable|date',
            'received_from_rd' => 'nullable|date',
        ]);
    
        // Check if a record already exists for this tupad_id
        $paper = TupadPaper::where('tupad_id', $request->tupad_id)->first();
    
        if ($paper) {
            // Update existing record
            $paper->update($request->all());
            return response()->json(['message' => 'Updated successfully', 'data' => $paper], 200);
        } else {
            // Create a new record
            $newPaper = TupadPaper::create($request->all());
            return response()->json(['message' => 'Created successfully', 'data' => $newPaper], 201);
        }
    }
    

    public function show($id)
{
    $paper = TupadPaper::find($id);

    if ($paper && $paper->tupad_id) {
        $correctPaper = TupadPaper::where('tupad_id', $paper->tupad_id)->first();

        if ($correctPaper) {
            return response()->json($correctPaper, 200);
        }
    }

    return response()->json(['message' => 'Paper not found for the selected row'], 404);
}

public function showByTupadId($tupad_id)
{
    // Find by `tupad_id`
    $paper = TupadPaper::where('tupad_id', $tupad_id)->first();

    // If not found, return an error
    if (!$paper) {
        return response()->json(['message' => 'Paper not found for the given Tupad ID'], 404);
    }

    return response()->json($paper, 200);
}


    



    // Update a Tupad Paper
    public function update(Request $request, $id)
    {
        $paper = TupadPaper::find($id);

        if (!$paper) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|max:50',
            'date_received' => 'nullable|date',
        ]);

        $paper->update($request->all());

        return response()->json($paper, 200);
    }

    // Delete a Tupad Paper
    public function destroy($id)
    {
        $paper = TupadPaper::find($id);

        if (!$paper) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        $paper->delete();

        return response()->json(['message' => 'Paper deleted successfully'], 200);
    }


}
