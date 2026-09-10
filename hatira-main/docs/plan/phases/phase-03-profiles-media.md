# Faz 3 — Görsel altyapısı, etkinlik profili, katılımcılar alanı

**Durum:** Tamamlandı
**Başlangıç:** 2026-08-29
**Bitiş:** 2026-08-29
**PRD referansları:** 4.5, 10, 11, 12, 13, 29

## Amaç

Sonraki tüm fazların dayandığı görsel altyapısını kurmak ve etkinliği sosyal bir alana
dönüştürmek: katılımcı profilleri, katılımcılar grid'i ve etkinlik ana sayfası.

## Görevler

### Görsel altyapısı

- [x] `create_attachments_table` migration
- [x] `Attachment` modeli ve `HasAttachments` trait'i
- [x] Yükleme servisi: mime/boyut doğrulama, rastgele ad, `public` disk
- [x] Silme davranışı: kayıt veya yol silinince dosya da silinir
- [x] D-005 yeniden değerlendirildi → D-013
- [x] Yeniden boyutlandırma yok; yeni bağımlılık yok
- [x] `data-model.md` güncellemesi

### Backend

- [x] Etkinlik kapak görseli yükleme ve kaldırma
- [x] `Events\ProfileController` — kendi etkinlik profili
- [x] Profil bağlantısı doğrulaması
- [x] `Events\ParticipantProfileController::show`
- [x] Etkinlik ana sayfası sosyal veri

### Frontend

- [x] Kapak ve profil dosya yükleme
- [x] Katılımcılar grid'i
- [x] Katılımcı profil sayfası
- [x] Kendi etkinlik profilini düzenleme
- [x] Etkinlik ana sayfası: kapak, tarih, açıklama, katılımcı görselleri

### Testler

- [x] Geçerli/geçersiz görsel
- [x] Dosya silinince diskten de siliniyor
- [x] Katılımcı yalnızca kendi profilini düzenliyor
- [x] Katılımcı olmayan profil göremiyor
- [x] Profil bağlantısı doğrulaması
- [x] Ana sayfa aktif katılımcıya render ediliyor

## Kabul kriterleri

- [x] Katılımcı fotoğraf, kısa açıklama ve bağlantı ekleyebiliyor
- [x] Sahip kapak görseli yükleyebiliyor
- [x] Katılımcılar alanı fotoğraf + isim kartları
- [x] Karta basınca profil sayfasına gidiliyor
- [x] Ana sayfa sosyal ve sıcak
- [x] Görseller tahmin edilemez public URL (D-013)
- [x] `composer ci:check` — kapanışta doğrulanacak

## Çalışma günlüğü

### 2026-08-29

Kapak ve profil tek dosya olarak mevcut kolonlarda duruyor. `attachments` tablosu
izlenim/anı çoklu görselleri için hazır. Thumbnail paketi kurulmadı.
