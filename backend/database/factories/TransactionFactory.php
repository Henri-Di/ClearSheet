<?php

namespace Database\Factories;

use App\Modules\Financial\Transactions\Models\Transaction;
use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Categories\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        $user = User::factory()->create();
        $sheet = Sheet::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);

        return [
            'user_id'     => $user->id,
            'sheet_id'    => $sheet->id,
            'category_id' => $category->id,
            'type'        => $this->faker->randomElement(['income', 'expense']),
            'amount'      => $this->faker->randomFloat(2, 10, 1500),
            'date'        => $this->faker->date(),
            'description' => $this->faker->sentence(),
        ];
    }
}
