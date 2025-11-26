<?php

namespace App\Modules\Financial\Categories\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Responses\ApiResponse;
use App\Modules\Financial\Categories\Requests\CreateCategoryRequest;
use App\Modules\Financial\Categories\Requests\UpdateCategoryRequest;
use App\Modules\Financial\Categories\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $service
    ) {}

    public function index(Request $request)
    {
        return ApiResponse::success(
            $this->service->listForUser($request->user()->id)
        );
    }

    public function store(CreateCategoryRequest $request)
    {
        return ApiResponse::success(
            $this->service->createForUser(
                $request->user()->id,
                $request->validated()
            ),
            'Category created successfully'
        );
    }

    public function update($id, UpdateCategoryRequest $request)
    {
        $category = $this->service->findForUser($id, $request->user()->id);

        if (!$category) {
            return ApiResponse::error('Category not found', 404);
        }

        $updated = $this->service->updateCategory($category, $request->validated());

        return ApiResponse::success($updated, 'Category updated successfully');
    }

    public function destroy($id, Request $request)
    {
        $category = $this->service->findForUser($id, $request->user()->id);

        if (!$category) {
            return ApiResponse::error('Category not found', 404);
        }

        $this->service->deleteCategory($category);

        return ApiResponse::success([], 'Category deleted successfully');
    }

    public function sheets($id)
    {
        $category = \App\Modules\Financial\Categories\Models\Category::findOrFail($id);

        $sheets = \App\Modules\Financial\Sheets\Models\Sheet::with([
            'items' => function($q) use ($id) {
                $q->where('category_id', $id);
            }
        ])
        ->whereHas('items', function($q) use ($id) {
            $q->where('category_id', $id);
        })
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->get();

        $response = $sheets->map(function($sheet) {
            $income = $sheet->items->where('type', 'income')->sum('value');
            $expense = $sheet->items->where('type', 'expense')->sum('value');

            return [
                'id' => $sheet->id,
                'name' => $sheet->name,
                'month' => $sheet->month,
                'year' => $sheet->year,
                'initial_balance' => (float) $sheet->initial_balance,
                'income' => (float) $income,
                'expense' => (float) $expense,
                'balance' => (float) ($sheet->initial_balance + $income - $expense),
            ];
        });

        return response()->json(['data' => $response]);
    }

}
