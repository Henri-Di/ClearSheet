<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sheet_items', function (Blueprint $table) {
            $table->id();

            // Planilha dona
            $table->foreignId('sheet_id')
                  ->constrained('sheets')
                  ->cascadeOnDelete();

            // Tipo padrão da aplicação
            $table->enum('type', ['income', 'expense']);

            // Valor sempre positivo
            $table->decimal('value', 12, 2);

            // Categoria — agora FOREIGN KEY
            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();

            // Descrição
            $table->string('description', 500)->nullable();

            // Data
            $table->date('date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sheet_items');
    }
};
