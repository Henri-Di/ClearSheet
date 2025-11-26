<?php

namespace App\Modules\Financial\Transactions\Services;

use App\Modules\Financial\Transactions\Models\Transaction;
use App\Modules\Financial\Transactions\Repositories\TransactionRepository;
use Carbon\Carbon;

class TransactionService
{
    public function __construct(
        private TransactionRepository $repo
    ) {}

    public function listForUser(int $userId, ?int $sheetId = null)
    {
        return $this->repo->allForUser($userId, $sheetId);
    }

    public function listGlobalForUser(int $userId)
    {
        return $this->repo->allGlobal($userId);
    }

    public function createForUser(int $userId, array $data): Transaction
    {
        $payload = [
            'user_id'     => $userId,
            'sheet_id'    => $data['sheet_id'] ?? null,
            'type'        => $this->normalizeType($data['type']),
            'value'       => abs($data['value']),
            'category_id' => $data['category_id'] ?? null,
            'bank_id'     => $data['bank_id'] ?? null,
            'description' => $data['description'] ?? null,
            'date'        => $this->normalizeDate($data['date'] ?? now()->toDateString()),
            'paid_at'     => $this->normalizeDate($data['paid_at'] ?? null),
        ];

        return $this->repo->create($payload);
    }

    public function findForUser(int $id, int $userId): ?Transaction
    {
        return $this->repo->findForUser($id, $userId);
    }

    public function updateTransaction(Transaction $t, array $data): Transaction
    {
        if (isset($data['type'])) {
            $data['type'] = $this->normalizeType($data['type']);
        }

        if (array_key_exists('date', $data)) {
            $data['date'] = $this->normalizeDate($data['date']);
        }

        if (array_key_exists('paid_at', $data)) {
            $data['paid_at'] = $this->normalizeDate($data['paid_at']);
        }

        foreach (['category_id', 'bank_id', 'description'] as $f) {
            if (array_key_exists($f, $data)) {
                $data[$f] = $data[$f] ?: null;
            }
        }

        return $this->repo->update($t, $data);
    }

    public function deleteTransaction(Transaction $t): void
    {
        $this->repo->delete($t);
    }

    private function normalizeType(string $t): string
    {
        return match ($t) {
            'entrada' => 'income',
            'saida'   => 'expense',
            default   => $t,
        };
    }

    private function normalizeDate(?string $d): ?string
    {
        return $d
            ? Carbon::parse($d)->format('Y-m-d')
            : null;
    }
}
