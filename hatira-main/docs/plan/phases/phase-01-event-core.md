# Faz 1 — Türkçeleştirme temeli + Event/Participant çekirdeği

**Durum:** Tamamlandı
**Başlangıç:** 2026-08-29
**Bitiş:** 2026-08-29
**PRD referansları:** 4.1, 4.2, 5.1, 6, 7, 9, 45, 46, 62.1-62.4

## Amaç

Ürünün iskeletini kurmak: etkinlik ve katılımcı kayıtları, etkinlik kapsamlı yetkilendirme,
ve tüm arayüzün Türkçeye geçişi. Bu fazın sonunda bir kullanıcı etkinlik oluşturup katılımcı
listesini hazırlayabiliyor olacak.

## Kapsam

### İçinde

- Türkçe dil temeli: `lang/tr`, `APP_LOCALE`, Carbon locale, mevcut ekranların çevirisi
- `events` ve `participants` tabloları, dört enum, iki model, iki policy
- Etkinlik oluşturma, düzenleme, listeleme, silme
- Katılımcı ekleme (tek tek ve toplu), listeleme, kaldırma
- Etkinlik içeriğinin katılımcı olmayanlardan gizlenmesi

### Dışında

- **Davet gönderme ve kabul** → Faz 2. Bu fazda katılımcılar `not_invited` durumunda kalır.
- **Görsel yükleme** → Faz 3. `cover_image_path` ve `photo_path` kolonları açılır ama doldurulmaz.
- **Etkinlik ana sayfası ve katılımcılar grid'i** → Faz 3. Bu fazda yönetim odaklı sade listeler var.
- **Etkinlik durumu geçişleri arayüzü** → Faz 6. Kolon ve enum var, kapatma akışı yok.

## Bağımlılıklar

Yok. İlk faz.

## Görevler

### Türkçeleştirme temeli

- [x] `lang/tr/*.php` framework mesajları (validation, auth, passwords, pagination) ve Türkçe attribute adları
- [x] `lang/tr.json` uygulama cümleleri
- [x] `APP_LOCALE=tr`, `APP_FAKER_LOCALE=tr_TR`
- [x] Carbon locale `tr` (`AppServiceProvider`)
- [x] Auth sayfalarının Türkçeleştirilmesi (`resources/js/pages/auth/*`) — "parola" terimi
- [x] Settings sayfalarının Türkçeleştirilmesi (`resources/js/pages/settings/*` ve ilgili bileşenler)
- [x] `dashboard.tsx`, `welcome.tsx`, sidebar ve nav bileşenlerinin Türkçeleştirilmesi

### Veri modeli

- [x] `EventStatus`, `ParticipantRole`, `ParticipantStatus`, `ImpressionRevealMode` enum'ları
- [x] `create_events_table` migration
- [x] `create_participants_table` migration
- [x] `Event` ve `Participant` modelleri, ULID route key, ilişkiler ve cast'ler
- [x] `User` üzerine `ownedEvents()` ve `participations()` ilişkileri
- [x] `EventFactory` ve `ParticipantFactory`
- [x] `DatabaseSeeder` içine PRD 57 senaryosuna dayalı geliştirme verisi

### Yetkilendirme

- [x] `EventPolicy` (`view`, `update`, `delete`, `manageParticipants`)
- [x] `ParticipantPolicy` (`delete`)
- [x] `Event::participantFor()` yardımcısı

### Backend

- [x] `CreateEvent` action — etkinliği ve sahibin `Participant` kaydını birlikte oluşturur
- [x] `EventController` (index, create, store, show, edit, update, destroy)
- [x] `Events\ParticipantController` (store, destroy)
- [x] Toplu katılımcı ekleme (çok satırlı metin parse)
- [x] Form Request'ler ve paylaşılan doğrulama concern'leri
- [x] `routes/events.php`, `routes/web.php` içinden require edilir

### Frontend

- [x] `pages/events/index.tsx` — etkinlik listesi, boş durum metni
- [x] `pages/events/create.tsx` ve `pages/events/edit.tsx` — etkinlik formu
- [x] `pages/events/show.tsx` — etkinlik özeti
- [x] `pages/events/participants/index.tsx` — katılımcı listesi, tek/toplu ekleme, kaldırma
- [x] Sidebar'a "Etkinliklerim" öğesi
- [x] Etkinlik ve katılımcı TypeScript tipleri

### Testler

- [x] Etkinlik listeleme, oluşturma, güncelleme, silme ve yetki testleri
- [x] Katılımcı ekleme, kaldırma, yetki, tekrar eden e-posta testleri
- [x] Toplu ekleme testleri (çok satırlı parse, hatalı satır)
- [x] `EventPolicy` yetki matrisi testi
- [x] Türkçe doğrulama mesajı testi

## Kabul kriterleri

- [x] Giriş yapmış kullanıcı etkinlik oluşturabiliyor; sahip için `owner`/`active` `Participant` kaydı otomatik açılıyor
- [x] Kullanıcı hem sahibi olduğu hem katıldığı etkinlikleri tek listede görüyor
- [x] Etkinlik sahibi etkinlik bilgilerini düzenleyebiliyor; katılımcı düzenleyemiyor
- [x] Katılımcı olmayan kullanıcı etkinliği göremiyor
- [x] Katılımcı yalnızca isimle eklenebiliyor; sistem hesabı gerekmiyor
- [x] Toplu ekleme çok satırlı `İsim, e-posta` girdisini doğru parse ediyor
- [x] Aynı e-posta aynı etkinliğe iki kez eklenemiyor
- [x] Etkinlik sahibi kendi katılımcı kaydını silemiyor
- [x] Tüm arayüz ve doğrulama mesajları Türkçe
- [x] `composer test` (pint + phpstan + pest) yeşil

`composer ci:check` içindeki `npm run check` starter kit'in `.agents` / `.claude` / `.cursor` skill dosyalarında biçim hatası veriyor. Bu dosyalar Faz 1 kapsamında değiştirilmedi.

## Devredilen işler

| İş                                        | Hedef faz | Neden                            |
| ----------------------------------------- | --------- | -------------------------------- |
| Kapak görseli ve profil fotoğrafı yükleme | Faz 3     | Görsel altyapısı orada kuruluyor |
| Katılımcıya davet gönderme                | Faz 2     | Mail + token altyapısı gerekiyor |
| Etkinlik durumunu değiştirme arayüzü      | Faz 6     | Kapanış akışının bütünü orada    |

## Çalışma günlüğü

### 2026-08-29 — Faz başladı

`docs/plan` iskeleti kuruldu. Kararlar D-001…D-008 olarak kayda geçti.

### 2026-08-29 — Türkçeleştirme ve çekirdek

Arayüz Türkçeleştirildi. Event/Participant kaynakları, policy'ler, testler ve sayfalar eklendi.

Plandan sapmalar:

- **Katılımcı olmayan için 403 değil 404.** `EventPolicy` stranger isteklerinde `denyAsNotFound()` kullanıyor. 403, etkinliğin var olduğunu doğrular; PRD 45 kapalı etkinlik ilkesine 404 daha uygun.
- **`BulkParticipantController` ayrı controller.** Satır bazlı doğrulama tek ekleme ile aynı şekle sığmıyor.
- **`Participant` için de ULID.** Faz 3 profil URL'leri aynı sızıntı sorununa sahip olacağı için şimdiden eklendi (D-007).
