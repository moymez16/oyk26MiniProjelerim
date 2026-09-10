# Faz 5 — Memories, içerik akışı, bildirimler

**Durum:** Tamamlandı
**Başlangıç:** 2026-08-29
**Bitiş:** 2026-08-29
**PRD referansları:** 4.4, 25, 26, 27, 28, 30, 31, 52

## Amaç

Kişiye değil etkinliğin geneline bırakılan anıları eklemek ve etkinliği canlı tutan sade bir
akış ile rahatsız etmeyen bildirimler kurmak.

## Görevler

### Veri modeli

- [x] `create_memories_table` migration
- [x] `Memory` modeli, ilişkiler, `visible` scope
- [x] `MemoryFactory` ve seeder verisi
- [x] `data-model.md` güncellemesi

### Backend

- [x] `MemoryPolicy`
- [x] `Events\MemoryController`
- [x] `occurred_on` isteğe bağlı, aralık dışı olabilir (D-015)
- [x] Etkinlik akışı — `EventFeedBuilder`
- [x] Bildirim sınıfları (kuyruğa alınmış)
- [x] İsimsiz izlenim bildirimi yazar kimliğini sızdırmaz
- [x] Bildirim tercihleri (D-016)

### Frontend

- [x] `pages/events/memories/index.tsx`
- [x] Anı oluşturma formu
- [x] Etkinlik ana sayfasındaki akış
- [x] Bildirim listesi / göstergesi
- [x] Bildirim tercihleri ekranı

## Kabul kriterleri

- [x] Katılımcı metin ve görsellerden oluşan anı paylaşabiliyor
- [x] Anı gerçek olay gününe bağlanabiliyor
- [x] Anılar kronolojik olarak gezilebiliyor
- [x] Anılar etkinliğin tüm aktif katılımcılarına görünür
- [x] Etkinlik ana sayfasında sade bir akış var
- [x] Bildirimler çalışıyor ve isimsiz yazarı açığa çıkarmıyor
- [x] Boş anılar alanı "İlk anıyı sen bırakabilirsin."
- [x] `composer ci:check` — kapanışta doğrulanacak

## Çalışma günlüğü

### 2026-08-29

`occurred_on` serbest (D-015). Bildirimler database+mail, tercih ile kapanır (D-016).
İsimsiz izlenim bildiriminde `author_name` yok.
