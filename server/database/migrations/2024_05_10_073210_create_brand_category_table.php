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
        Schema::create('brand_category', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("brand_id")->foreign()->references("id")->on("brands");
            $table->bigInteger("category_id")->foreign()->references("id")->on("categories");
            $table->integer("order");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_category');
    }
};
