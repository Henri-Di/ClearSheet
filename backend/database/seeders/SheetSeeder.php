<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Modules\Financial\Sheets\Models\Sheet;

class SheetSeeder extends Seeder
{
    public function run(): void
    {
        // Usuário padrão
        $user = User::first() ?? User::factory()->create([
            'name'     => 'Admin',
            'email'    => 'admin@clearsheet.com',
            'password' => bcrypt('123456'),
        ]);

        // 5 planilhas para o usuário
        Sheet::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);
    }
}
