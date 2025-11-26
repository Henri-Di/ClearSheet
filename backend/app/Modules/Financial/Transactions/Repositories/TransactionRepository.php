<?php

namespace App\Modules\Financial\Transactions\Repositories;

use App\Modules\Financial\Transactions\Models\Transaction;

class TransactionRepository
{
    public function allForUser(int $userId, ?int $sheetId = null)
    {
        return Transaction::with(['category', 'bank'])
            ->where('user_id', $userId)
            ->when($sheetId, fn($q) => $q->where('sheet_id', $sheetId))
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn($t) => $t->toUnifiedArray());
    }

    public function allGlobal(int $userId)
    {
        return Transaction::with(['category', 'bank'])
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn($t) => $t->toUnifiedArray());
    }

    public function create(array $payload): Transaction
    {
        return Transaction::create($payload);
    }

    public function findForUser(int $id, int $userId): ?Transaction
    {
        return Transaction::where('id', $id)
            ->where('user_id', $userId)
            ->first();
    }

    public function update(Transaction $t, array $payload): Transaction
    {
        $t->update($payload);
        return $t;
    }

    public function delete(Transaction $t): void
    {
        $t->delete();
    }
}
