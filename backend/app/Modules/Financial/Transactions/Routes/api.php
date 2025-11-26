<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Financial\Transactions\Controllers\TransactionController;
use App\Modules\Financial\Sheets\Controllers\SheetItemController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/items/all', [SheetItemController::class, 'all']);
    Route::get('/transactions/all', [TransactionController::class, 'indexGlobal']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
});
