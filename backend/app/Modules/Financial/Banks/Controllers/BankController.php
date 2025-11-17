<?php

namespace App\Modules\Financial\Banks\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Financial\Banks\Models\Bank;
use App\Modules\Core\Responses\ApiResponse;

class BankController extends Controller
{
    public function index()
    {
        return ApiResponse::success(
            Bank::orderBy('name')->get()
        );
    }
}
