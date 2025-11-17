<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // Usuário
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Planilha (opcional)
            $table->foreignId('sheet_id')
                  ->nullable()
                  ->constrained('sheets')
                  ->cascadeOnDelete();

            // Tipo
            $table->enum('type', ['income', 'expense']);

            // Valor
            $table->decimal('value', 10, 2);

            // Categoria (opcional)
            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();

            // Descrição
            $table->string('description', 500)->nullable();

            // Data da transação
            $table->date('date')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};
