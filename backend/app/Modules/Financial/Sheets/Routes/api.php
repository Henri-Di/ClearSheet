<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Financial\Sheets\Controllers\SheetController;
use App\Modules\Financial\Sheets\Controllers\CountController;
use App\Modules\Financial\Sheets\Controllers\SheetItemController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sheets', [SheetController::class, 'index']);
    Route::post('/sheets', [SheetController::class, 'store']);

    Route::get('/sheets/{id}', [SheetController::class, 'show']);
    Route::put('/sheets/{id}', [SheetController::class, 'update']);
    Route::delete('/sheets/{id}', [SheetController::class, 'destroy']);

    Route::get('/sheets/{id}/summary', [SheetController::class, 'summary']);

    Route::get('/sheets/count', [CountController::class, 'sheets']);
    Route::get('/categories/count', [CountController::class, 'categories']);
    Route::get('/transactions/count', [CountController::class, 'transactions']);
    Route::get('/users/count', [CountController::class, 'users']);

    Route::get('/sheet-items', [SheetItemController::class, 'all']);

    Route::get('/sheets/{sheet}/items', [SheetItemController::class, 'index']);
    Route::post('/sheets/{sheet}/items', [SheetItemController::class, 'store']);
    Route::put('/sheets/{sheet}/items/{item}', [SheetItemController::class, 'update']);
    Route::delete('/sheets/{sheet}/items/{item}', [SheetItemController::class, 'destroy']);
});
