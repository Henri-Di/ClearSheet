<?php

use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {

    // Auth
    require base_path('app/Modules/Auth/Routes/api.php');

    // Dashboard
    require base_path('app/Modules/Financial/Dashboard/Routes/api.php');

    // Categories
    require base_path('app/Modules/Financial/Categories/Routes/api.php');

    // Sheets
    require base_path('app/Modules/Financial/Sheets/Routes/api.php');

    // Transactions
    require base_path('app/Modules/Financial/Transactions/Routes/api.php');

    // Users
    require base_path('app/Modules/Users/Routes/api.php');

    // Banks  
    require base_path('app/Modules/Financial/Banks/routes/api.php');
});
