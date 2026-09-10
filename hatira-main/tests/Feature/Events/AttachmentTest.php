<?php

use App\Models\Attachment;
use App\Models\Event;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('deleting an attachment also deletes the stored file', function () {
    Storage::fake('public');

    $event = Event::factory()->create();
    $path = UploadedFile::fake()->image('shot.jpg')->store('attachments', 'public');
    $attachment = Attachment::factory()->create([
        'attachable_type' => Event::class,
        'attachable_id' => $event->id,
        'path' => $path,
        'uploaded_by_participant_id' => $event->participantFor($event->owner)?->id,
    ]);

    $attachment->delete();

    Storage::disk('public')->assertMissing($path);
    expect(Attachment::query()->find($attachment->id))->toBeNull();
});
