<?php

namespace Database\Seeders;

use App\Actions\CreateEvent;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $owner = User::factory()->create([
            'name' => 'Uğur Arıcı',
            'email' => 'ugur@example.com',
        ]);

        $event = app(CreateEvent::class)->handle($owner, [
            'name' => 'Özgür Yazılım Yaz Kampı 2026 — Laravel',
            'description' => 'Dokuz gün boyunca aynı sınıfta eğitim alan Laravel sınıfının ortak hatıra alanı.',
            'location' => 'Bolu',
            'starts_on' => '2026-08-15',
            'ends_on' => '2026-08-23',
        ]);

        $this->addParticipants($event, [
            ['name' => 'Ali Berk', 'email' => 'ali@example.com'],
            ['name' => 'Ayşe Yılmaz', 'email' => 'ayse@example.com'],
            ['name' => 'Mehmet Demir', 'email' => 'mehmet@example.com'],
        ]);

        $ownerParticipant = $event->participantFor($owner);
        $ali = $event->participants()->where('email', 'ali@example.com')->firstOrFail();

        Impression::factory()->for($event)->create([
            'author_participant_id' => $ownerParticipant?->id,
            'subject_participant_id' => $ali->id,
            'body' => 'İlk gün biraz mesafeli biri olduğunu düşündüm.',
            'created_at' => '2026-08-15 12:00:00',
        ]);
        Impression::factory()->for($event)->create([
            'author_participant_id' => $ownerParticipant?->id,
            'subject_participant_id' => $ali->id,
            'body' => 'Meğer mesafeli değilmiş. Muhabbet etmeye başlayınca sınıfın en komik insanlarından biri çıktı.',
            'created_at' => '2026-08-18 20:00:00',
        ]);
        Impression::factory()->for($event)->unnamed()->create([
            'author_participant_id' => $ownerParticipant?->id,
            'subject_participant_id' => $ali->id,
            'body' => 'Kamp sonrasında da kesin görüşmek istediğim insanlardan biri.',
            'created_at' => '2026-08-23 10:00:00',
        ]);

        Memory::factory()->for($event)->create([
            'participant_id' => $ownerParticipant?->id,
            'body' => 'Bugün yurda dönerken sekiz kişi markete girdik. Herkes ayrı ödeme yapınca arkamızda inanılmaz sıra oluştu. Kasiyerin yüzünü unutmayacağım.',
            'occurred_on' => '2026-08-16',
        ]);
        Memory::factory()->for($event)->create([
            'participant_id' => $ali->id,
            'body' => 'Elektriklerin kesildiği gece pencereden dışarı bakıp hep birlikte bekledik.',
            'occurred_on' => '2026-08-18',
        ]);
    }

    /**
     * @param  list<array{name: string, email: string}>  $participants
     */
    private function addParticipants(Event $event, array $participants): void
    {
        foreach ($participants as $participant) {
            Participant::factory()
                ->for($event)
                ->create($participant);
        }
    }
}
