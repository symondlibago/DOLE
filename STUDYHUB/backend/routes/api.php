<?php

use App\Http\Controllers\TupadController;
use App\Http\Controllers\TupadsPaperController;



Route::get('/tupadspapers', [TupadsPaperController::class, 'index']);
Route::post('/tupadspapers', [TupadsPaperController::class, 'store']);
Route::get('/tupads-papers/{id}', [TupadsPaperController::class, 'show']);
Route::put('/tupadspapers/{id}', [TupadsPaperController::class, 'update']);
Route::delete('/tupadspapers/{id}', [TupadsPaperController::class, 'destroy']);


Route::post('/tupads', [TupadController::class, 'store']);
Route::get('/tupads', [TupadController::class, 'getAll']);
Route::get('/tupads/latest-series/{pfo}', [TupadController::class, 'getLatestSeriesNo']);
