<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Services\AuthService;
use App\Modules\Core\Responses\ApiResponse;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        if (!$result) {
            return ApiResponse::error('Invalid credentials', 401);
        }

        return ApiResponse::success($result, 'Authenticated successfully');
    }

    public function logout(Request $request)
    {
        $this->authService->logout();

        return ApiResponse::success([], 'Logged out successfully');
    }

    public function user(Request $request)
    {
        return ApiResponse::success([
            'user' => $request->user()
        ]);
    }
}
