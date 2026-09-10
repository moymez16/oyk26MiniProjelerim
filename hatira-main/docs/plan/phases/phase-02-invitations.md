# Faz 2 — Davet ve katılıma bağlanma

**Durum:** Tamamlandı
**Başlangıç:** 2026-08-29
**Bitiş:** 2026-08-29
**PRD referansları:** 8, 9, 42, 43, 62.3, 62.4

## Amaç

Faz 1'de hazırlanan katılımcı listesini gerçek kullanıcılara bağlamak. Bir kişi davet
bağlantısına geldiğinde hesap oluşturup daveti kabul ediyor ve sistem onu önceden hazırlanmış
`Participant` kaydıyla eşleştiriyor.

## Kapsam

### İçinde

- Katılımcıya özel davet token'ı (`participants` tablosuna davet kolonları)
- E-posta daveti (Mailable, kuyruğa alınmış)
- Davet bağlantısı sayfası: etkinliği ve daveti göstereni gösterir, giriş/kayıt sunar
- Daveti kabul akışı: giriş veya kayıt sonrası `User` ↔ `Participant` eşleştirmesi
- Davet durum geçişleri (`ParticipantStatus`) ve sahip tarafında görünür durum etiketleri
- Davet iptali ve yeniden gönderme
- İçerik kuralları ve rıza onayı (PRD 42, 43) — ilk katılım sırasında

### Dışında

- **Public / açık davet bağlantısı** → Kapsam dışı. Yalnızca katılımcıya özel token.
- **Toplu davet gönderme zamanlaması** → Faz 6'da değerlendirilir, MVP'de manuel tetikleme.

## Bağımlılıklar

- Faz 1: `events`, `participants`, `EventPolicy`

## Görevler

### Veri modeli

- [x] `add_invitation_columns_to_participants_table` migration: `invitation_token` (unique, nullable), `invited_at`, `invitation_seen_at`, `joined_at`, `left_at`, `consent_accepted_at`
- [x] `data-model.md` güncellemesi

### Backend

- [x] Davet token üretimi ve doğrulaması (imzalı URL mı, DB token mı → karar `decisions.md`'ye)
- [x] `SendParticipantInvitation` action + `ParticipantInvitationMail` Mailable
- [x] `InvitationController::show` — token ile davet önizleme (auth gerektirmez)
- [x] `InvitationController::store` — daveti kabul et, `Participant` ile eşleştir
- [x] Kayıt akışına davet bağlamı taşınması (`CreateNewUser` sonrası eşleştirme)
- [x] E-posta eşleşmesi denetimi: davet e-postası ile giriş yapan kullanıcının e-postası farklıysa ne olur → karar gerekiyor
- [x] Davet iptali ve yeniden gönderme uç noktaları
- [x] Rıza onayı kaydı (`consent_accepted_at`)

### Frontend

- [x] `pages/invitations/show.tsx` — davet önizleme, etkinlik bilgisi, davet eden
- [x] Rıza ve içerik kuralları ekranı (PRD 42'nin kısa, insan dilindeki metni)
- [x] Katılımcı listesinde durum etiketleri ve davet eylemleri
- [x] Davet gönderildi / kabul edildi geri bildirimleri

### Testler

- [x] Geçersiz veya süresi geçmiş token reddediliyor
- [x] Davet önizleme auth gerektirmiyor, etkinlik içeriğini sızdırmıyor
- [x] Daveti kabul eden kullanıcı doğru `Participant` kaydına bağlanıyor
- [x] Aynı davet iki kez kabul edilemiyor
- [x] İptal edilmiş davet kabul edilemiyor
- [x] Davet e-postası gönderiliyor (`Mail::fake()`)
- [x] Rıza onaylanmadan etkinliğe erişilemiyor

## Kabul kriterleri

- [x] Etkinlik sahibi bir katılımcıya e-posta daveti gönderebiliyor
- [x] Davet bağlantısına gelen kişi etkinliği ve kendisini davet edeni görüyor
- [x] Hesabı olmayan kişi kayıt olup daveti kabul edebiliyor ve mevcut `Participant` kaydına bağlanıyor
- [x] Hesabı olan kişi giriş yapıp daveti kabul edebiliyor
- [x] Katılımcı durumu davet yaşam döngüsü boyunca doğru ilerliyor
- [x] Kullanıcı katılım sırasında içerik kurallarını ve rızayı görüyor ve onayı kaydediliyor
- [x] `composer ci:check` yeşil

## Açık sorular

- Davet token'ı DB'de mi tutulacak yoksa imzalı URL mi kullanılacak? İptal edilebilirlik DB token'ı gerektirir. → **D-010**
- Davet e-postasından farklı bir e-posta ile giriş yapılırsa: eşleştir, reddet, yoksa sahibe sor? → **D-011** (reddet)
- Davetin son kullanma süresi olacak mı? → **D-012** (14 gün)

## Çalışma günlüğü

### 2026-08-29 — Faz başladı

D-010, D-011, D-012 kayda geçti. Kayıt sonrası otomatik eşleştirme yok; kullanıcı davet
sayfasına dönüp rızayı işaretleyerek kabul eder. `url.intended` bu dönüşü sağlar.
