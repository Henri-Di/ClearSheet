<?php

namespace App\Modules\Financial\Transactions\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Responses\ApiResponse;
use App\Modules\Financial\Transactions\Requests\CreateTransactionRequest;
use App\Modules\Financial\Transactions\Requests\UpdateTransactionRequest;
use App\Modules\Financial\Transactions\Services\TransactionService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        private TransactionService $service
    ) {}

    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    | Lista todas as transações do usuário.
    | Aceita filtro opcional por sheet_id.
    */

    public function index(Request $request)
    {
        $sheetId = $request->query('sheet_id');

        $transactions = $this->service->listForUser(
            $request->user()->id,
            $sheetId ? (int) $sheetId : null
        );

        return ApiResponse::success(
            $transactions,
            'Transações carregadas com sucesso.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(CreateTransactionRequest $request)
    {
        $transaction = $this->service->createForUser(
            $request->user()->id,
            $request->validated()
        );

        $transaction->load('category');

        return ApiResponse::success(
            $transaction,
            'Transação criada com sucesso.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    public function update($id, UpdateTransactionRequest $request)
    {
        $transaction = $this->service->findForUser(
            $id,
            $request->user()->id
        );

        if (!$transaction) {
            return ApiResponse::error('Transação não encontrada.', 404);
        }

        $updated = $this->service->updateTransaction(
            $transaction,
            $request->validated()
        );

        $updated->load('category');

        return ApiResponse::success(
            $updated,
            'Transação atualizada com sucesso.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    public function destroy($id, Request $request)
    {
        $transaction = $this->service->findForUser(
            $id,
            $request->user()->id
        );

        if (!$transaction) {
            return ApiResponse::error('Transação não encontrada.', 404);
        }

        $this->service->deleteTransaction($transaction);

        return ApiResponse::success(
            [],
            'Transação removida com sucesso.'
        );
    }
}
