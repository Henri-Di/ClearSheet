<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Modules\Financial\Banks\Models\Bank;

class BanksSeeder extends Seeder
{
    public function run()
    {
        DB::table('banks')->insert([
            ['name' => 'Banco do Brasil', 'code' => '001'],
            ['name' => 'Bradesco', 'code' => '237'],
            ['name' => 'Caixa', 'code' => '104'],
            ['name' => 'Itaú', 'code' => '341'],
            ['name' => 'Santander', 'code' => '033'],
            ['name' => 'Nubank', 'code' => '260'],
            ['name' => 'Inter', 'code' => '077'],
            ['name' => 'BTG Pactual', 'code' => '208'],
            ['name' => 'C6 Bank', 'code' => '336'],
        ]);
    }
}
