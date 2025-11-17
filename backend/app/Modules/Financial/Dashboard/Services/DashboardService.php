<?php

namespace App\Modules\Financial\Dashboard\Services;

use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Transactions\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Totais gerais
     */
    public function getCounts(int $userId): array
    {
        return [
            'sheets'       => Sheet::where('user_id', $userId)->count(),
            'categories'   => Category::where('user_id', $userId)->count(),
            'transactions' => Transaction::where('user_id', $userId)->count(),
            'users'        => User::count(),
        ];
    }

    /**
     * Entradas / Saídas por mês (últimos 12 meses)
     */
    public function getMonthly(int $userId): array
    {
        return Transaction::where('user_id', $userId)
            ->whereNotNull('date')
            ->where('date', '>=', now()->subMonths(11)->startOfMonth())
            ->selectRaw("
                TO_CHAR(date, 'YYYY-MM') as month,
                SUM(CASE WHEN type = 'income' THEN value ELSE 0 END) AS income,
                SUM(CASE WHEN type = 'expense' THEN value ELSE 0 END) AS expense
            ")
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month'   => $row->month,
                'income'  => (float) $row->income,
                'expense' => (float) $row->expense,
            ])
            ->toArray();
    }

    /**
     * Saldo acumulado mês a mês
     */
    public function getBalance(int $userId): array
    {
        $monthly = $this->getMonthly($userId);
        $balance = 0;

        return collect($monthly)->map(function ($row) use (&$balance) {
            $balance += $row['income'] - $row['expense'];

            return [
                'month'   => $row['month'],
                'balance' => (float) $balance,
            ];
        })->toArray();
    }

    /**
     * Distribuição de valores por categoria
     */
    public function getCategoryDistribution(int $userId): array
    {
        return Transaction::where('transactions.user_id', $userId)
            ->leftJoin('categories', 'categories.id', '=', 'transactions.category_id')
            ->selectRaw("
                COALESCE(categories.name, 'Sem categoria') AS name,
                SUM(transactions.value) AS total
            ")
            ->groupBy('name')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'name'  => $row->name,
                'total' => (float) $row->total,
            ])
            ->toArray();
    }
}
