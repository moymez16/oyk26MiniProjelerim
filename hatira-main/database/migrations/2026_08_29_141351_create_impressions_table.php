<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('impressions', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_participant_id')->constrained('participants')->cascadeOnDelete();
            $table->foreignId('subject_participant_id')->constrained('participants')->cascadeOnDelete();
            $table->text('body');
            $table->boolean('shows_author_name')->default(true);
            $table->timestamp('visible_from')->nullable();
            $table->timestamp('hidden_at')->nullable();
            $table->foreignId('hidden_by_participant_id')->nullable()->constrained('participants')->nullOnDelete();
            $table->timestamps();

            $table->index(['event_id', 'subject_participant_id', 'created_at']);
            $table->index(['event_id', 'author_participant_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('impressions');
    }
};
