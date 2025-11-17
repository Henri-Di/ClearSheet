<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPaidAtToSheetItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sheet_items', function (Blueprint $table) {
            // Usando DATE porque o controle de pagamento não precisa de horário
            $table->date('paid_at')->nullable()->after('date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sheet_items', function (Blueprint $table) {
            $table->dropColumn('paid_at');
        });
    }
}
