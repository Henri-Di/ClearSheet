<?php

namespace App\Modules\Financial\Sheets\Repositories;

use App\Modules\Financial\Sheets\Models\Sheet;

class SheetRepository
{
    public function allForUser(int $userId)
    {
        return Sheet::where('user_id', $userId)
                    ->orderBy('year', 'desc')
                    ->orderBy('month', 'desc')
                    ->get();
    }

    public function create(array $data): Sheet
    {
        return Sheet::create($data);
    }

    public function findForUser(int $id, int $userId): ?Sheet
    {
        return Sheet::where('id', $id)
                    ->where('user_id', $userId)
                    ->first();
    }

    public function update(Sheet $sheet, array $data): Sheet
    {
        $sheet->update($data);
        return $sheet;
    }

    public function delete(Sheet $sheet): void
    {
        $sheet->delete();
    }
}
