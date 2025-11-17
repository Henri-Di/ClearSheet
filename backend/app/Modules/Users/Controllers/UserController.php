<?php

namespace App\Modules\Users\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Responses\ApiResponse;
use App\Modules\Users\Requests\UpdateProfileRequest;
use App\Modules\Users\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private UserService $service
    ) {}

    public function me(Request $request)
    {
        return ApiResponse::success([
            'user' => $this->service->getProfile($request->user())
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $updated = $this->service->updateProfile(
            $request->user(),
            $request->validated()
        );

        return ApiResponse::success([
            'user' => $updated
        ], 'Profile updated successfully');
    }
}
