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
        Schema::create('job_openings', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->text('requirements');
        $table->foreignId('branch_id')->constrained()->onDelete('cascade');
        $table->enum('status', ['open', 'closed'])->default('open');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_openings');
    }
};
