<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();

        // Categoria pertence ao usuário
        $table->foreignId('user_id')
              ->constrained()
              ->onDelete('cascade');

        $table->string('name', 255);
        $table->enum('type', ['income', 'expense']);
        $table->string('color', 20)->default('#000000');  // HEX ou RGB
        $table->string('icon', 50)->nullable();           // Ex: "fa fa-car"
        $table->string('description', 500)->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
