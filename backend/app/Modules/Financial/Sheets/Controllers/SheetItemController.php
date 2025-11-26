<?php

namespace App\Modules\Financial\Sheets\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Responses\ApiResponse;
use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Sheets\Models\SheetItem;
use App\Modules\Financial\Sheets\Requests\CreateSheetItemRequest;
use App\Modules\Financial\Sheets\Requests\UpdateSheetItemRequest;
use Illuminate\Http\Request;

class SheetItemController extends Controller
{
    public function index(Request $request, Sheet $sheet)
    {
        if ($sheet->user_id !== $request->user()->id) {
            return ApiResponse::error('Acesso negado a esta planilha.', 403);
        }

        $items = $sheet->items()
            ->with(['category', 'bank'])
            ->search($request->query('search'))
            ->betweenDates(
                $request->query('date_start'),
                $request->query('date_end')
            )
            ->valueRange(
                $request->query('min_value'),
                $request->query('max_value')
            )
            ->orderExcel(
                $request->query('order_by', 'date'),
                $request->query('direction', 'asc')
            )
            ->get();

        return ApiResponse::success(
            $items->map->toResourceArray()
        );
    }

    public function store(CreateSheetItemRequest $request, Sheet $sheet)
    {
        if ($sheet->user_id !== $request->user()->id) {
            return ApiResponse::error('Acesso negado a esta planilha.', 403);
        }

        $data = $request->validated();
        $data['value'] = abs($data['value']);
        $data['category_id'] = $data['category_id'] ?: null;
        $data['bank_id'] = $data['bank_id'] ?: null;
        $data['paid_at'] = $data['paid_at'] ?: null;
        $data['date'] = $data['date'] ?: null;

        $item = $sheet->items()->create($data);
        $item->load(['category', 'bank']);

        return ApiResponse::success(
            $item->toResourceArray(true),
            'Item criado com sucesso.'
        );
    }

    public function update(UpdateSheetItemRequest $request, Sheet $sheet, SheetItem $item)
    {
        if ($sheet->user_id !== $request->user()->id) {
            return ApiResponse::error('Acesso negado.', 403);
        }

        if ($item->sheet_id !== $sheet->id) {
            return ApiResponse::error('Item não pertence à planilha.', 400);
        }

        $data = $request->validated();

        if (isset($data['value'])) {
            $data['value'] = abs($data['value']);
        }

        foreach (['category_id', 'bank_id', 'date', 'paid_at'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $data[$field] ?: null;
            }
        }

        $item->update($data);
        $item->load(['category', 'bank']);

        return ApiResponse::success(
            $item->toResourceArray(true),
            'Item atualizado com sucesso.'
        );
    }

    public function destroy(Request $request, Sheet $sheet, SheetItem $item)
    {
        if ($sheet->user_id !== $request->user()->id) {
            return ApiResponse::error('Acesso negado.', 403);
        }

        if ($item->sheet_id !== $sheet->id) {
            return ApiResponse::error('Item não pertence à planilha.', 400);
        }

        $item->delete();

        return ApiResponse::success([], 'Item removido com sucesso.');
    }

    public function all()
    {
        return response()->json(
            SheetItem::with(['category', 'sheet'])
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }
}
