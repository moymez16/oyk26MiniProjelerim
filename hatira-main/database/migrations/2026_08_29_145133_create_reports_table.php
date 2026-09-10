<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->morphs('reportable');
            $table->foreignId('reporter_participant_id')->constrained('participants')->cascadeOnDelete();
            $table->string('reason');
            $table->text('note')->nullable();
            $table->string('status')->default('open');
            $table->foreignId('resolved_by_participant_id')->nullable()->constrained('participants')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->unique(['reportable_type', 'reportable_id', 'reporter_participant_id'], 'reports_unique_reporter');
            $table->index(['event_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
