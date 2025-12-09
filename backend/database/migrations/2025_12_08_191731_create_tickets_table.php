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
        Schema::create('tickets', function (Blueprint $table) {
         $table->id();
         $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
         $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
         $table->string('subject');
         $table->text('description')->nullable();
         $table->enum('status', ['open', 'in_progress', 'closed'])->default('open');
         $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
         $table->timestamps();
     });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
