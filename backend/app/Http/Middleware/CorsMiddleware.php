<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Lista de origens permitidas.
     * Adicione aqui seus front-ends permitidos.
     */
    protected array $allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:4000',
        'http://localhost:5173',
    ];

    /**
     * Manipula requISIÇão CORS.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');

        /**
         * 1) OPTIONS sempre retorna 204 e finaliza
         *    Não processa a request no Laravel.
         */
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 204)
                ->withHeaders($this->corsHeaders($origin));
        }

        /**
         * 2) Demais requisições seguem fluxo normal
         */
        $response = $next($request);

        /**
         * 3) Aplica headers CORS
         */
        $response->headers->add($this->corsHeaders($origin));

        return $response;
    }

    /**
     * Retorna headers CORS finais, sem risco de erro.
     */
    private function corsHeaders(?string $origin): array
    {
        // Se a origem veio do frontend e está permitida:
        if ($origin && in_array($origin, $this->allowedOrigins, true)) {
            $allowedOrigin = $origin;
        } else {
            // Fallback: a primeira origem válida
            $allowedOrigin = $this->allowedOrigins[0];
        }

        return [
            'Access-Control-Allow-Origin'      => $allowedOrigin,
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Allow-Methods'     => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers'     => 'Content-Type, Authorization, X-Requested-With',
        ];
    }
}
