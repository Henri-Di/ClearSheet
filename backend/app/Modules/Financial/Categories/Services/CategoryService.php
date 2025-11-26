<?php

namespace App\Modules\Financial\Categories\Services;

use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Categories\Repositories\CategoryRepository;

class CategoryService
{
    public function __construct(
        private CategoryRepository $repository
    ) {}

    public function listForUser(int $userId)
    {
        return $this->repository->allForUser($userId);
    }

    public function createForUser(int $userId, array $data): Category
    {
        $data = $this->normalizeData($data);
        $data['user_id'] = $userId;

        return $this->repository->create($data);
    }

    public function findForUser(int $id, int $userId): ?Category
    {
        return $this->repository->findForUser($id, $userId);
    }

    public function updateCategory(Category $category, array $data): Category
    {
        $data = $this->normalizeData($data);

        return $this->repository->update($category, $data);
    }

    public function deleteCategory(Category $category): void
    {
        $this->repository->delete($category);
    }

    private function normalizeData(array $data): array
    {
        return [
            'name'        => $data['name']        ?? null,
            'icon'        => $data['icon']        ?? null,
            'type'        => $data['type']        ?? null,
            'color'       => $data['color']       ?? null,
            'description' => $data['description'] ?? null,
        ];
    }
}
