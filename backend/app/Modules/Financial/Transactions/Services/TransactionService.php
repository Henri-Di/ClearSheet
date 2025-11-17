<?php

namespace App\Modules\Financial\Transactions\Services;

use App\Modules\Financial\Transactions\Models\Transaction;
use App\Modules\Financial\Transactions\Repositories\TransactionRepository;

class TransactionService
{
    public function __construct(
        private TransactionRepository $repo
    ) {}

    /*
    |--------------------------------------------------------------------------
    | Listagem
    |--------------------------------------------------------------------------
    */

    public function listForUser(int $userId, ?int $sheetId = null)
    {
        return $this->repo->allForUser($userId, $sheetId);
    }

    /*
    |--------------------------------------------------------------------------
    | Criação
    |--------------------------------------------------------------------------
    */

    public function createForUser(int $userId, array $data)
    {
        $payload = [
            'user_id'     => $userId,
            'sheet_id'    => $data['sheet_id'] ?? null,
            'type'        => $data['type'],
            'value'       => $data['value'],
            'category_id' => $data['category_id'] ?? null,
            'description' => $data['description'] ?? null,
            'date'        => $data['date'] ?? now()->toDateString(),
        ];

        return $this->repo->create($payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Busca
    |--------------------------------------------------------------------------
    */

    public function findForUser(int $id, int $userId): ?Transaction
    {
        return $this->repo->findForUser($id, $userId);
    }

    /*
    |--------------------------------------------------------------------------
    | Atualização
    |--------------------------------------------------------------------------
    */

    public function updateTransaction(Transaction $t, array $data)
    {
        if (isset($data['type'])) {
            $data['type'] = match ($data['type']) {
                'entrada' => 'income',
                'saida'   => 'expense',
                default   => $data['type'],
            };
        }

        return $this->repo->update($t, $data);
    }

    /*
    |--------------------------------------------------------------------------
    | Remoção
    |--------------------------------------------------------------------------
    */

    public function deleteTransaction(Transaction $t)
    {
        $this->repo->delete($t);
    }
}
