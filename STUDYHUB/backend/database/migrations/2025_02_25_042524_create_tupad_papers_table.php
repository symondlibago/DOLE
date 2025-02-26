<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tupad_papers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tupad_id')->constrained('tupads')->onDelete('cascade'); // Foreign key fix
            $table->date('budget')->nullable(); // Changed from dateTime to date
            $table->date('received_from_budget')->nullable();
            $table->date('tssd_sir_jv')->nullable();
            $table->date('received_from_tssd_sir_jv')->nullable();
            $table->date('rd')->nullable();
            $table->date('received_from_rd')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tupad_papers');
    }
};