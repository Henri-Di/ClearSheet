<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Financial\Banks\Controllers\BankController;

Route::get('/banks', [BankController::class, 'index']);
