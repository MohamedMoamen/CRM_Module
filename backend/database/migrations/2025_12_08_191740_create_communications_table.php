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
        Schema::create('communications', function (Blueprint $table) {
           $table->id();
           $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
           $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
           $table->enum('type', ['call', 'email', 'meeting'])->default('call');
           $table->text('notes')->nullable();
           $table->timestamps();
       });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communications');
    }
};
