<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Financial\Dashboard\Controllers\DashboardController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/counts', [DashboardController::class, 'counts']);
    Route::get('/dashboard/monthly', [DashboardController::class, 'monthly']);
    Route::get('/dashboard/balance', [DashboardController::class, 'balance']);
    Route::get('/dashboard/categories', [DashboardController::class, 'categories']);
});
