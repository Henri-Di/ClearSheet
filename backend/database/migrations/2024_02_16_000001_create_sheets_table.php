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
        Schema::create('sheets', function (Blueprint $table) {
            $table->id();

            // Usuário dono da planilha
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Dados principais
            $table->string('name', 255);
            $table->string('description', 500)->nullable();

            // Período a que a planilha pertence
            $table->unsignedTinyInteger('month'); // 1–12
            $table->unsignedSmallInteger('year'); // 2000–2100

            // Saldo inicial configurado pelo usuário
            $table->decimal('initial_balance', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sheets');
    }
};
