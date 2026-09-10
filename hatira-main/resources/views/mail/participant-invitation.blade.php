<x-mail::message>
# {{ $eventName }}

Merhaba {{ $inviteeName }},

{{ $inviterName }} seni **{{ $eventName }}** etkinliğinin hatıra alanına davet etti.

Daveti görüntülemek ve katılmak için bağlantıya tıkla. Bu bağlantı yalnızca sana özeldir.

<x-mail::button :url="$invitationUrl">
Daveti görüntüle
</x-mail::button>

Sevgiler,<br>
{{ config('app.name') }}
</x-mail::message>
