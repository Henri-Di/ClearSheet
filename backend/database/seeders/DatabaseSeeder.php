<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Database\Seeders\BanksSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Usuário padrão (admin)
        $admin = User::firstOrCreate(
            ['email' => ''],
            [
                'name'     => 'Admin',
                'password' => bcrypt('123456'),
            ]
        );

        // Rodar seeders adicionais do projeto (como Sheets)
        $this->call([
            SheetSeeder::class,
            CategorySeeder::class,
            TransactionSeeder::class,
            BanksSeeder::class,  
        ]);
    }
}
