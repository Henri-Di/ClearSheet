<?php

namespace App\Modules\Financial\Sheets\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Responses\ApiResponse;
use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Transactions\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class CountController extends Controller
{
    public function sheets(Request $request)
    {
        $count = Sheet::where('user_id', $request->user()->id)->count();
        return ApiResponse::success(['count' => $count]);
    }

    public function categories(Request $request)
    {
        $count = Category::where('user_id', $request->user()->id)->count();
        return ApiResponse::success(['count' => $count]);
    }

    public function transactions(Request $request)
    {
        $count = Transaction::where('user_id', $request->user()->id)->count();
        return ApiResponse::success(['count' => $count]);
    }

    public function users()
    {
        $count = User::count();
        return ApiResponse::success(['count' => $count]);
    }
}
