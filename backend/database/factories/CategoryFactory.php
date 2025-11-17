<?php

namespace Database\Factories;

use App\Modules\Financial\Categories\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'user_id'    => User::factory(),
            'name'       => $this->faker->word(),
            'type'       => $this->faker->randomElement(['income', 'expense']),
            'color'      => $this->faker->hexColor(),
            'icon'       => null,
            'description'=> $this->faker->sentence(),
        ];
    }
}
