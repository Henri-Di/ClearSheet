<?php

namespace App\Modules\Financial\Categories\Repositories;

use App\Modules\Financial\Categories\Models\Category;

class CategoryRepository
{
    public function allForUser(int $userId)
    {
        return Category::where('user_id', $userId)
                       ->orderBy('name')
                       ->get();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function findForUser(int $id, int $userId): ?Category
    {
        return Category::where('id', $id)
                       ->where('user_id', $userId)
                       ->first();
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        return $category;
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }
}
