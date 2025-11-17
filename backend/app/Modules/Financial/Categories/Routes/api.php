<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Financial\Categories\Controllers\CategoryController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::get('/categories/{id}/sheets', [CategoryController::class, 'sheets']);
});

