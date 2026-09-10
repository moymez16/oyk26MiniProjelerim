<?php

use App\Enums\EventStatus;
use App\Enums\ImpressionRevealMode;
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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('owner_id')->constrained('users');
            $table->string('name');
            $table->text('description');
            $table->text('long_description')->nullable();
            $table->string('location')->nullable();
            $table->string('cover_image_path')->nullable();
            $table->date('starts_on');
            $table->date('ends_on')->nullable();
            $table->string('status')->default(EventStatus::Draft->value);
            $table->string('impression_reveal_mode')->default(ImpressionRevealMode::Immediate->value);
            $table->timestamp('reveal_at')->nullable();
            $table->boolean('allows_content_after_close')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
