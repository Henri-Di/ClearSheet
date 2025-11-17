<?php

namespace Database\Factories\Modules\Financial\Sheets\Models;

use Illuminate\Database\Eloquent\Factories\Factory;

class SheetItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sheet_id'   => 1,
            'type'       => $this->faker->randomElement(['entrada', 'saida']),
            'value'      => $this->faker->randomFloat(2, 10, 5000),
            'category'   => $this->faker->word(),
            'description'=> $this->faker->sentence(),
            'date'       => $this->faker->date(),
        ];
    }
}
