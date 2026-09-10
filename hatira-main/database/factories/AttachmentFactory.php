<?php

namespace Database\Factories;

use App\Models\Attachment;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attachment>
 */
class AttachmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attachable_type' => Event::class,
            'attachable_id' => Event::factory(),
            'disk' => 'public',
            'path' => 'attachments/'.fake()->uuid().'.jpg',
            'original_name' => fake()->word().'.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'position' => 0,
            'uploaded_by_participant_id' => Participant::factory(),
        ];
    }
}
