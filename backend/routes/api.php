<?php

use Illuminate\Support\Facades\Route;

// Rotas nativas da API (se quiser adicionar algo futuramente)
Route::get('/ping', fn() => ['status' => 'ok']);
