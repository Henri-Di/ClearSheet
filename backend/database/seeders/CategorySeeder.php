<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Modules\Financial\Categories\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        Category::factory()->count(6)->create([
            'user_id' => $user->id,
        ]);
    }
}
