<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Transactions\Models\Transaction;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->warn("Nenhum usuário encontrado. Pulando TransactionSeeder.");
            return;
        }

        $sheet = Sheet::firstOrCreate(
            ['user_id' => $user->id, 'name' => 'Default Sheet'],
            [
                'description' => 'Sheet generated automatically',
                'month' => now()->month,
                'year'  => now()->year,
                'initial_balance' => 0
            ]
        );

        $categories = Category::where('user_id', $user->id)->get();

        if ($categories->isEmpty()) {
            $this->command->warn("Nenhuma categoria encontrada. Gerando 3 categorias.");
            $categories = Category::factory()->count(3)->create(['user_id' => $user->id]);
        }

        foreach ($categories as $category) {
            Transaction::factory()->count(5)->create([
                'user_id'     => $user->id,
                'sheet_id'    => $sheet->id,
                'category_id' => $category->id,
            ]);
        }
    }
}
