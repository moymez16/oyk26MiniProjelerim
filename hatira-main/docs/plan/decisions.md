# Karar Kaydı

Numaralı, kalıcı teknik ve ürün kararları. Yeni karar alındığında sona eklenir.
**Eski kayıt silinmez.** Geçersiz kalan karar `Durum: Değiştirildi (bkz. D-YYY)` olarak işaretlenir.

Durum değerleri: `Kabul edildi` · `Değiştirildi` · `Geri alındı`

---

## D-001 — Arayüz dili yalnızca Türkçe

**Tarih:** 2026-08-29 · **Faz:** 1 · **Durum:** Kabul edildi

Uygulama tek dilli çalışır: Türkçe. i18n kütüphanesi kurulmaz, dil seçici yapılmaz.
Starter kit'ten gelen İngilizce arayüz metinleri de Türkçeye çevrilir.

**Uygulama biçimi:**

- PHP tarafı: `lang/tr/*.php` (framework mesajları) + `lang/tr.json` (uygulama cümleleri, `__()` ile).
- React tarafı: metinler doğrudan TSX içine Türkçe yazılır. Frontend çeviri katmanı yok.
- `APP_LOCALE=tr`, `APP_FAKER_LOCALE=tr_TR`, Carbon locale `tr`.

**Gerekçe:** Hedef kitle tek dilli ve PRD'nin ürün dili Türkçe. i18n katmanı, tek dil için
her metni iki yerde tutma maliyeti getirir ve karşılığı yok.

**Sonucu:** İleride ikinci dil gerekirse tüm TSX metinlerinin çıkarılması gerekir. Bu bilinçli bir borç.

---

## D-002 — PDF çıktısı tarayıcı yazdırma ile

**Tarih:** 2026-08-29 · **Faz:** 7 · **Durum:** Kabul edildi

Yıllık PDF'i sunucuda üretilmez. Yazdırma odaklı CSS (`@media print`) ile hazırlanan yıllık
sayfası kullanıcı tarafından tarayıcıdan PDF olarak kaydedilir.

**Gerekçe:** Yeni bağımlılık yok. Browsershot/Puppeteer yolu Chromium kurulumu, kuyruk altyapısı
ve dağıtım karmaşıklığı getiriyor; dompdf ise Tailwind v4 çıktısını düzgün render etmiyor.

**Sonucu:** Sunucu tarafında "PDF'i bana e-postala" gibi bir akış mümkün değil. Gerekirse ayrı
bir karar ile Browsershot'a geçilir; yıllık HTML'i zaten hazır olacağından geçiş maliyeti düşük.

---

## D-003 — Etkinlik profili alanları `participants` tablosunda

**Tarih:** 2026-08-29 · **Faz:** 1 · **Durum:** Kabul edildi

`Participant` kaydı hem etkinlik üyeliğini hem etkinlik profilini taşır. Ayrı bir
`participant_profiles` tablosu açılmaz. `photo_path`, `bio`, `links` doğrudan `participants` üzerindedir.

**Gerekçe:** PRD 4.5'e göre etkinlik profili "kullanıcının o etkinlik içindeki görünümü", yani
üyelik kaydıyla bire bir. Ayrı tablo her sorguya bir join ekler, karşılığında hiçbir şey vermez.

---

## D-004 — Impression kayıtları geçmişi korur

**Tarih:** 2026-08-29 · **Faz:** 4 · **Durum:** Kabul edildi

Bir impression yayınlandıktan sonra normal akışta düzenlenmez. Kullanıcı yeni düşüncesini
**yeni bir kayıt** olarak ekler. Yazım hatası gibi durumlar için kısa bir düzenleme penceresi
tanınır; kaldırma her zaman mümkündür.

**Gerekçe:** PRD 3.2 ve 17. Ürünün değeri düşüncenin zaman içindeki yolculuğunda; üzerine yazma
bu değeri yok eder.

**Sonucu:** Arayüz "düzenle" yerine "yeni bir şey ekle" eylemini öne çıkarır.

---

## D-005 — Görseller polymorphic `attachments` tablosunda, local public disk

**Tarih:** 2026-08-29 · **Faz:** 3 · **Durum:** Kabul edildi

Tek bir `attachments` tablosu; `attachable_type` / `attachable_id` ile impression, memory ve
etkinliğe bağlanır. Depolama `public` diski (`storage:link`). Spatie Media Library gibi bir
paket kurulmaz.

**Gerekçe:** PRD 29 görselleri bağlamına bağlı tutmayı istiyor, bağımsız galeri istemiyor.
İhtiyaç (yükle, göster, sil, sırala) Media Library'nin sunduğunun çok altında.

**Sonucu:** Etkinlikler gizli olduğu için (PRD 45) doğrudan public URL, tahmin edilemez dosya
adlarıyla korunur. Sıkı erişim denetimi gerekirse görseller controller üzerinden servis edilir.
Faz 3'te yeniden değerlendirildi: **D-013**.

---

## D-006 — Terminoloji sözlüğü

**Tarih:** 2026-08-29 · **Faz:** 1 · **Durum:** Kabul edildi

Kullanıcıya gösterilen metinlerde:

| Kavram                 | Kullanılacak  | Kullanılmayacak            |
| ---------------------- | ------------- | -------------------------- |
| password               | **parola**    | şifre                      |
| yazar adı gizli içerik | **isimsiz**   | anonim                     |
| Event                  | **etkinlik**  | organizasyon, olay         |
| Impression             | **izlenim**   | yorum, değerlendirme, puan |
| Memory                 | **anı**       | gönderi, post              |
| Participant            | **katılımcı** | üye, kullanıcı             |
| Yearbook               | **yıllık**    | albüm, arşiv               |

**Gerekçe:** PRD 18 "anonim" yerine "isimsiz" diyor, çünkü sistem içeriğin sahibini biliyor.
"Yorum" ve "değerlendirme" ürünün kaçındığı puanlama/anket hissini veriyor (PRD 2, 3.1).

Kod tarafında sınıf ve tablo adları İngilizce kalır (`Event`, `Participant`, `Impression`, `Memory`).

---

## D-007 — Route key olarak ULID

**Tarih:** 2026-08-29 · **Faz:** 1 · **Durum:** Kabul edildi

`Event` ve `Participant` modelleri URL'de `id` yerine `ulid` kolonunu kullanır
(`getRouteKeyName()`). Birincil anahtar yine `id` (auto-increment bigint).

**Gerekçe:** Etkinlikler varsayılan olarak kapalı (PRD 45). Sıralı id, URL'de etkinlik sayısını
ve varlığını sızdırır, davetsiz denemeyi kolaylaştırır. ULID sıralanabilir olduğu için
index davranışı UUID v4'ten iyi.

---

## D-008 — Yetkilendirme `Event` üzerinden, `EventPolicy` ile

**Tarih:** 2026-08-29 · **Faz:** 1 · **Durum:** Kabul edildi

Etkinlik kapsamlı erişim, ayrı bir middleware yerine `EventPolicy` ile yapılır.
Controller'lar `Gate` üzerinden yetki sorar; `Event::participantFor(User $user)` ilgili
`Participant` kaydını çözer.

**Gerekçe:** Yetki kuralları tek yerde ve doğrudan test edilebilir olur. Middleware ek bir
dolaylılık katmanı ekler ve policy'yi yine de gerektirir.

**Sonucu:** Etkinlik alt kaynakları (katılımcı, izlenim, anı) `scopeBindings()` ile
üst etkinliğe bağlanır; bu bağlama yetki denetiminin yerini almaz.

---

## D-009 — Her faz kendi branch'inde, kapanışta main'e birleşir

**Tarih:** 2026-08-29 · **Faz:** süreç · **Durum:** Kabul edildi

Her yol haritası fazı `main`'den açılan ayrı bir branch'te yapılır (`phase-NN-slug`).
Fazın bittiği düşünülünce `composer ci:check` ve Bugbot döngüsü temiz kalana kadar sürer;
ancak ondan sonra branch `main`'e birleştirilir. Sonraki faz, kullanıcı söylemeden başlatılmaz.

**Gerekçe:** Faz 1 `main` üzerinde kapandı. Bundan sonrası reviewable, geri alınabilir dilimler
olsun; bir fazın yarım işi `main`'i kirletmesin.

**Uygulama biçimi:** Ayrıntı [`README.md`](README.md) içindeki Git iş akışı ve faz kapanış
adımlarındadır.

---

## D-010 — Davet token'ı veritabanında tutulur

**Tarih:** 2026-08-29 · **Faz:** 2 · **Durum:** Kabul edildi

Davet bağlantısı `participants.invitation_token` (64 karakter, unique) ile çözülür.
İmzalı URL kullanılmaz. İptal token'ı `null` yapar; yeniden gönderim yeni token üretir.

**Gerekçe:** İptal ve yeniden gönderim imzalı URL ile yapılamaz. Token tahmin edilemez
olduğu için URL'nin kendisi sırdır.

---

## D-011 — Davet e-postası ile hesap e-postası eşleşmeli

**Tarih:** 2026-08-29 · **Faz:** 2 · **Durum:** Kabul edildi

Katılımcı kaydında e-posta varsa, daveti kabul eden kullanıcının e-postası (büyük/küçük
harf duyarsız) aynı olmalıdır. Farklıysa kabul reddedilir; sahibe sorulmaz.

E-postasız (yalnızca isim) katılımcıya davet gönderilmez.

**Gerekçe:** Davet kişiye özeldir. Yanlış hesaba bağlamak yıllığın tarihsel bütünlüğünü
bozar. Sahibe sormak Faz 2 için gereksiz bir akış ekler.

---

## D-012 — Davet 14 gün sonra dolar

**Tarih:** 2026-08-29 · **Faz:** 2 · **Durum:** Kabul edildi

Davet `invited_at + 14 gün` sonra kabul edilemez. Süresi dolmuş token 404 döner
(etkinliğin varlığını sızdırmaz). Yeniden gönderim süreyi sıfırlar.

**Gerekçe:** Açık uçlu davet bağlantıları kaybolmuş e-postalarda sonsuza kadar geçerli
kalmamalı. 14 gün kamp/etkinlik hazırlığı için yeterli; yeniden gönderim ucuz.

---

## D-013 — Görseller public diskte, tahmin edilemez adla

**Tarih:** 2026-08-29 · **Faz:** 3 · **Durum:** Kabul edildi

Kapak, profil ve ilerideki izlenim/anı görselleri `public` diske yazılır. Dosya adı Laravel'in
`store()` ürettiği rastgele addır. Controller üzerinden yetkili servis yoktur.

Yeniden boyutlandırma / thumbnail için yeni paket kurulmaz; orijinal dosya saklanır.
Doğrulama: jpg/png/webp, en fazla 4 MB.

**Gerekçe:** Etkinlikler davete kapalı (PRD 45). Rastgele ad, URL tahminini pratikte
anlamsız kılar. Ayrı bir görsel proxy, imzalı URL ve Intervention/Glide bağımlılığı
MVP için karşılığını vermez.

---

## D-014 — İzlenim düzenleme penceresi 15 dakika

**Tarih:** 2026-08-29 · **Faz:** 4 · **Durum:** Kabul edildi

Yazar, izlenimi oluşturduktan sonra 15 dakika içinde gövdeyi ve isim görünürlüğünü
düzeltebilir. Süre dolunca güncelleme 403 olur; kaldırma her zaman mümkündür.

**Gerekçe:** D-004 yazım hatası için kısa bir pencere ister. 15 dakika, cümlenin
yerleşmesine yetecek kadar kısa, yazım düzeltmesine yetecek kadar uzundur.

**Sonucu:** `Impression::EDIT_WINDOW_MINUTES` tek kaynak. Pencere dışında "Düzelt"
düğmesi gösterilmez.

---

## D-015 — Anının `occurred_on` tarihi etkinlik aralığı dışında olabilir

**Tarih:** 2026-08-29 · **Faz:** 5 · **Durum:** Kabul edildi

`occurred_on` isteğe bağlıdır. Verilmezse gösterimde `created_at` kullanılır.
Verilirse herhangi bir gün olabilir; etkinlik başlangıcından önce de yazılabilir.

**Gerekçe:** PRD 27 gerçek olay gününü ister. Kamp öncesi tanışma veya yolculuk
anılarını kesmek ürünü küçültür.

---

## D-016 — Bildirimler veritabanı + e-posta, tercih ile kapanır

**Tarih:** 2026-08-29 · **Faz:** 5 · **Durum:** Kabul edildi

Hakkında izlenim, yeni anı ve yeni katılımcı bildirimleri hem `database` hem
`mail` kanalına gider. Kullanıcı `users.notification_preferences` ile her türü
kapatabilir; kapalı tür hiç gönderilmez.

Davet e-postası bu tercihten bağımsızdır (katılımın tek yolu).

**Gerekçe:** PRD 31 rahatsız etmeyen bildirim ister. Ayrı bir bildirim paketi yok.

---

## D-017 — Yıllıkta isimsiz yazar asla görünmez; ayrılanlar sayfada kalır

**Tarih:** 2026-08-29 · **Faz:** 7 · **Durum:** Kabul edildi

Etkinlik ve kişisel yıllık izlenimleri `ImpressionPresenter::forYearbook()` ile
serileştirilir. `shows_author_name` false ise `author_name` yazarın kendisi görse
bile eklenmez; çıktı paylaşılır ve yazdırılır.

Yıllık katılımcı listesi `joined_at` dolu herkesi alır (`left_at` süzülmez).
Ayrılan kişinin sayfası ve görünür içerikleri tarihsel bütünlük için durur.

**Gerekçe:** Profil görünümünde yazar kendi isimsiz cümlesini tanır; yıllık ortak
bir belgedir. PRD 47 içeriklerin ayrılınca da kalmasını ister.
