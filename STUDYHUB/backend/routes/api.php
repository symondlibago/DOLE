<?php

use App\Http\Controllers\TupadController;

Route::post('/tupads', [TupadController::class, 'store']);
Route::get('/tupads', [TupadController::class, 'getAll']);
Route::get('/tupads/latest-series/{pfo}', [TupadController::class, 'getLatestSeriesNo']);
