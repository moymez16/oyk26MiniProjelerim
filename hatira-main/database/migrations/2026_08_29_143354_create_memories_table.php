<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memories', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('participant_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->date('occurred_on')->nullable();
            $table->timestamp('hidden_at')->nullable();
            $table->foreignId('hidden_by_participant_id')->nullable()->constrained('participants')->nullOnDelete();
            $table->timestamps();

            $table->index(['event_id', 'occurred_on', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memories');
    }
};
