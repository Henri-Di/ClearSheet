<?php

namespace App\Modules\Financial\Categories\Services;

use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Categories\Repositories\CategoryRepository;

class CategoryService
{
    public function __construct(
        private CategoryRepository $repository
    ) {}

    /**
     * Lista categorias do usuário.
     */
    public function listForUser(int $userId)
    {
        return $this->repository->allForUser($userId);
    }

    /**
     * Cria categoria garantindo consistência dos campos opcionais.
     */
    public function createForUser(int $userId, array $data): Category
    {
        $data = $this->normalizeData($data);

        $data['user_id'] = $userId;

        return $this->repository->create($data);
    }

    /**
     * Localiza categoria do usuário.
     */
    public function findForUser(int $id, int $userId): ?Category
    {
        return $this->repository->findForUser($id, $userId);
    }

    /**
     * Atualiza categoria com segurança.
     */
    public function updateCategory(Category $category, array $data): Category
    {
        $data = $this->normalizeData($data);

        return $this->repository->update($category, $data);
    }

    /**
     * Exclui categoria.
     */
    public function deleteCategory(Category $category): void
    {
        $this->repository->delete($category);
    }

    /**
     * Normaliza campos opcionais removidos no front.
     * Mantém coerência nos updates e creates.
     */
    private function normalizeData(array $data): array
    {
        return [
            'name'        => $data['name']        ?? null,
            'icon'        => $data['icon']        ?? null,
            'type'        => $data['type']        ?? null,   // opcional
            'color'       => $data['color']       ?? null,   // opcional
            'description' => $data['description'] ?? null,   // opcional
        ];
    }
}
