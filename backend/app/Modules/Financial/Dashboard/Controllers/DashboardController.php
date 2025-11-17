<?php

namespace App\Modules\Financial\Dashboard\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Responses\ApiResponse;
use App\Modules\Financial\Dashboard\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $service
    ) {}

    /**
     * Contadores gerais (cards do topo):
     * - quantidade de planilhas
     * - quantidade de categorias
     * - quantidade de transações
     * - quantidade de usuários
     */
    public function counts(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getCounts($userId)
        );
    }

    /**
     * Dados mensais para gráfico de barras:
     * - soma de entradas por mês
     * - soma de saídas por mês
     */
    public function monthly(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getMonthly($userId)
        );
    }

    /**
     * Saldo acumulado mensal:
     * - saldo final de cada mês (entradas - saídas)
     */
    public function balance(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getBalance($userId)
        );
    }

    /**
     * Distribuição por categorias:
     * - soma de valores por categoria (entrada ou saída)
     */
    public function categories(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getCategoryDistribution($userId)
        );
    }
}
