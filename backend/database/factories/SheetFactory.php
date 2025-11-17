<?php

namespace Database\Factories;

use App\Modules\Financial\Sheets\Models\Sheet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SheetFactory extends Factory
{
    protected $model = Sheet::class;

    public function definition(): array
    {
        $month = $this->faker->numberBetween(1, 12);
        $year  = $this->faker->numberBetween(2023, 2027);

        return [
            'user_id'         => User::factory(),
            'name'            => "Planilha {$month}/{$year}",
            'description'     => $this->faker->sentence(),
            'month'           => $month,
            'year'            => $year,
            'initial_balance' => $this->faker->randomFloat(2, 0, 5000),
        ];
    }
}
