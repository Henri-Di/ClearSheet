<?php

namespace App\Modules\Financial\Sheets\Services;

use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Sheets\Repositories\SheetRepository;

class SheetService
{
    public function __construct(
        private SheetRepository $repository
    ) {}

    public function listForUser(int $userId)
    {
        return $this->repository->allForUser($userId);
    }

    public function createForUser(int $userId, array $data): Sheet
    {
        $data['user_id'] = $userId;
        return $this->repository->create($data);
    }

    public function findForUser(int $sheetId, int $userId): ?Sheet
    {
        return $this->repository->findForUser($sheetId, $userId);
    }

    public function updateSheet(Sheet $sheet, array $data): Sheet
    {
        return $this->repository->update($sheet, $data);
    }

    public function deleteSheet(Sheet $sheet): void
    {
        $this->repository->delete($sheet);
    }
}
