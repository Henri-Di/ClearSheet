<?php

namespace App\Modules\Financial\Sheets\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Responses\ApiResponse;
use App\Modules\Financial\Sheets\Requests\CreateSheetRequest;
use App\Modules\Financial\Sheets\Requests\UpdateSheetRequest;
use App\Modules\Financial\Sheets\Services\SheetService;
use Illuminate\Http\Request;

class SheetController extends Controller
{
    public function __construct(
        private SheetService $service
    ) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $sheets = $this->service->listForUser($userId);

        return ApiResponse::success(
            $sheets,
            'Sheets loaded successfully'
        );
    }

    public function show(int $id, Request $request)
    {
        $userId = $request->user()->id;
        $sheet = $this->service->findForUser($id, $userId);

        if (!$sheet) {
            return ApiResponse::error('Sheet not found', 404);
        }

        $sheet->load('items');

        return ApiResponse::success(
            $sheet,
            'Sheet loaded successfully'
        );
    }

    public function store(CreateSheetRequest $request)
    {
        $userId = $request->user()->id;

        $sheet = $this->service->createForUser(
            $userId,
            $request->validated()
        );

        return ApiResponse::success(
            $sheet,
            'Sheet created successfully'
        );
    }

    public function update(int $id, UpdateSheetRequest $request)
    {
        $userId = $request->user()->id;
        $sheet = $this->service->findForUser($id, $userId);

        if (!$sheet) {
            return ApiResponse::error('Sheet not found', 404);
        }

        $updated = $this->service->updateSheet(
            $sheet,
            $request->validated()
        );

        return ApiResponse::success(
            $updated,
            'Sheet updated successfully'
        );
    }

    public function destroy(int $id, Request $request)
    {
        $userId = $request->user()->id;
        $sheet = $this->service->findForUser($id, $userId);

        if (!$sheet) {
            return ApiResponse::error('Sheet not found', 404);
        }

        $this->service->deleteSheet($sheet);

        return ApiResponse::success(
            [],
            'Sheet deleted successfully'
        );
    }

    public function summary(int $id, Request $request)
    {
        $userId = $request->user()->id;
        $sheet = $this->service->findForUser($id, $userId);

        if (!$sheet) {
            return ApiResponse::error('Sheet not found', 404);
        }

        $entradas = $sheet->items()
            ->where('type', 'income')
            ->sum('value');

        $saidas = $sheet->items()
            ->where('type', 'expense')
            ->sum('value');

        return ApiResponse::success(
            [
                'sheet_id'    => $sheet->id,
                'entradas'    => (float) $entradas,
                'saidas'      => (float) $saidas,
                'initial'     => (float) $sheet->initial_balance,
                'saldo_final' => (float) ($sheet->initial_balance + $entradas - $saidas),
            ],
            'Summary loaded successfully'
        );
    }
}
