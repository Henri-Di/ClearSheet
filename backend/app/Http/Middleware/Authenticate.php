<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;

class Authenticate extends Middleware
{
    /**
     * Retorna erro JSON ao invés de tentar redirecionar.
     */
    protected function unauthenticated($request, array $guards)
    {
        throw new HttpResponseException(
            response()->json(['message' => 'Unauthenticated'], 401)
        );
    }

    /**
     * Laravel WEB chama este método para redirecionar,
     * mas como é API, apenas retornamos null.
     */
    protected function redirectTo($request)
    {
        return null;
    }
}
