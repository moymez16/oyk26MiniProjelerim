# Faz 4 — Impressions

**Durum:** Tamamlandı
**Başlangıç:** 2026-08-29
**Bitiş:** 2026-08-29
**PRD referansları:** 4.3, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 50, 54, 56

## Amaç

Ürünün kalbi. Bir katılımcının başka bir katılımcı hakkında zaman içinde birden fazla izlenim
bırakabilmesi ve bu kayıtların üst üste gelerek düşüncenin yolculuğunu oluşturması.

## Kapsam

### İçinde

- `impressions` tablosu, aynı ikili için sınırsız kayıt
- İzlenim oluşturma: serbest metin, görsel(ler), isim görünürlüğü tercihi
- Bağlama duyarlı yazım yönlendirmeleri (ilk kayıt / sonraki kayıtlar — PRD 15)
- Üç görünüm: hakkımda yazılanlar, benim yazdıklarım, başkaları hakkında görünür olanlar
- İsimsiz içeriğin arayüzde yazar adını göstermemesi, sistemde bilinmesi (PRD 19)
- Sınırlı düzenleme penceresi ve kaldırma (D-004, D-014)
- Tarihlerin etkinlik bağlamıyla gösterimi ("18 Ağustos — 4. gün", PRD 54)
- Boş durum metinleri (PRD 56)

### Dışında

- **Gecikmeli açılış arayüzü** → Veri modeli destekler, MVP'de yalnızca anında görünürlük (PRD 24).
- **Reaction ve yorum dizileri** → Kapsam dışı (PRD 52).
- **Kendi hakkındaki içeriği gizleme talebi** → Faz 6.
- **Zorunlu "henüz tanımıyorum" alanı** → Kapsam dışı (PRD 50).

## Bağımlılıklar

- Faz 3: `attachments` altyapısı, katılımcı profil sayfası

## Görevler

### Veri modeli

- [x] `create_impressions_table` migration: `event_id`, `author_participant_id`, `subject_participant_id`, `body`, `shows_author_name`, `visible_from`, `hidden_at`, `hidden_by_participant_id`
- [x] Yazar ≠ hakkında yazılan kısıtı (uygulama katmanı)
- [x] `index(event_id, subject_participant_id, created_at)` — profil sayfası sorgusu
- [x] `Impression` modeli, ilişkiler, `visible` local scope
- [x] `ImpressionFactory` ve seeder verisi (PRD 16'daki üç kayıtlı örnek)
- [x] `data-model.md` güncellemesi

### Backend

- [x] `ImpressionPolicy` (`create`, `view`, `update` — düzenleme penceresi, `delete`)
- [x] `Events\ImpressionController::store` — görsellerle birlikte
- [x] `Events\ImpressionController::update` — yalnızca düzenleme penceresi içinde
- [x] `Events\ImpressionController::destroy`
- [x] Kendisi hakkında izlenim yazma engeli (PRD 62.6)
- [x] Görünürlük kuralı tek bir yerde: `visible` scope + policy. Serileştirmede isimsiz yazarın adı **hiç prop'a girmez**
- [x] `pages/events/impressions/index` verisi — benim yazdıklarım, kişi bazında ve kronolojik (PRD 21)

### Frontend

- [x] İzlenim oluşturma formu (metin, görsel, isim görünürlüğü seçimi)
- [x] Bağlama duyarlı yönlendirme metinleri (ilk kayıt / tekrar kayıt)
- [x] Katılımcı profilinde kronolojik izlenim akışı
- [x] `pages/events/impressions/index.tsx` — benim yazdıklarım
- [x] Kendi profilinde "hakkımda yazılanlar"
- [x] Boş durum metinleri (PRD 56'nın sıcak tonu)
- [x] Tarih gösterimi: etkinlik gününe göre etiketleme

## Kabul kriterleri

- [x] Katılımcı başka bir katılımcı hakkında izlenim yazabiliyor, kendisi hakkında yazamıyor
- [x] Aynı kişi hakkında birden fazla izlenim oluşabiliyor ve eskisi ezilmiyor
- [x] İzlenime bir veya birden fazla görsel eklenebiliyor
- [x] "İsmimle göster" seçilince yazar adı görünüyor, "isimsiz" seçilince görünmüyor
- [x] İsimsiz izlenimde yazar adı **hiçbir API cevabında** yer almıyor
- [x] Kullanıcı kendi yazdığı tüm izlenimleri kişi bazında ve kronolojik görebiliyor
- [x] Kullanıcı kendisi hakkında yazılan görünür izlenimleri görebiliyor
- [x] Katılımcılar başkalarının profilindeki görünür izlenimleri görebiliyor
- [x] Düzenleme penceresi dışında güncelleme reddediliyor
- [x] Hiçbir ekran boş görünmüyor
- [x] `composer ci:check` — kapanışta doğrulanacak

## Dikkat edilecek noktalar

**İsimsiz içerik en kritik mahremiyet sınırı.** Yazar kimliğinin Inertia prop'larına sızması
kullanıcı için ciddi bir ihlal olur. Bu yüzden:

- Serileştirme tek bir yerden geçer, model doğrudan prop'a verilmez.
- İsimsizlik testi hem "adı görünmüyor" hem "veri cevapta yok" olarak yazılır.
- İlgili kural Faz 4 sonunda `record-rule` ile `.ai/rules` altına kaydedilir.

## Çalışma günlüğü

### 2026-08-29

`ImpressionPresenter` tek serileştirme yolu. Düzenleme penceresi 15 dakika (D-014).
Gecikmeli açılış kolonları var, arayüz yok. Gizleme Faz 6.
