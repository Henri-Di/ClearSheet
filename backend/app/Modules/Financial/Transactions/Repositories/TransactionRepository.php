<?php

namespace App\Modules\Financial\Transactions\Repositories;

use App\Modules\Financial\Transactions\Models\Transaction;

class TransactionRepository
{
    public function allForUser(int $userId, ?int $sheetId = null)
    {
        return Transaction::with('category')
            ->where('user_id', $userId)
            ->when($sheetId, fn ($q) => $q->where('sheet_id', $sheetId))
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    public function findForUser(int $id, int $userId): ?Transaction
    {
        return Transaction::where('id', $id)
            ->where('user_id', $userId)
            ->first();
    }

    public function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);
        return $transaction;
    }

    public function delete(Transaction $transaction): void
    {
        $transaction->delete();
    }
}
