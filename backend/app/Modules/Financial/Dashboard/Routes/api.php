<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Financial\Dashboard\Controllers\DashboardController;

Route::middleware('auth:sanctum')->group(function () {

    // Estatísticas (totais de sheets, categorias, transações, usuários)
    Route::get('/dashboard/counts', [DashboardController::class, 'counts']);

    // Entradas/Saídas por mês
    Route::get('/dashboard/monthly', [DashboardController::class, 'monthly']);

    // Saldo acumulado mensal
    Route::get('/dashboard/balance', [DashboardController::class, 'balance']);

    // Distribuição por categorias
    Route::get('/dashboard/categories', [DashboardController::class, 'categories']);
});
