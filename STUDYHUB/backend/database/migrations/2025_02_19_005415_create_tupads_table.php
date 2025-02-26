<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTupadsTable extends Migration
{
    public function up()
    {
        Schema::create('tupads', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('series_no');
            $table->json('adl_no')->nullable(); // Change from string to JSON
            $table->string('pfo');
            $table->integer('target');
            $table->float('initial');
            $table->string('status');
            $table->date('date_received'); // Field for received date
            $table->integer('duration'); // Field for duration in days
            $table->string('location'); // Field for location
            $table->decimal('budget', 15, 2); // Numerical budget with precision
            $table->timestamps(); // Created_at and Updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('tupads');
    }
}
