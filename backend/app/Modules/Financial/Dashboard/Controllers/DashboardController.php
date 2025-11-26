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

    public function counts(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getCounts($userId)
        );
    }

    public function monthly(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getMonthly($userId)
        );
    }

    public function balance(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getBalance($userId)
        );
    }

    public function categories(Request $request)
    {
        $userId = $request->user()->id;

        return ApiResponse::success(
            $this->service->getCategoryDistribution($userId)
        );
    }
}
