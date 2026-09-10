# Product Requirements Document (PRD)

## Etkinlik Tabanlı Sosyal Hatıra ve İlk İzlenim Uygulaması

**Doküman durumu:** İlk ürün tanımı
**Doküman türü:** Product Requirements Document
**Odak:** Business logic, kullanıcı deneyimi ve ürün davranışları
**Teknik kapsam:** Bu doküman teknoloji, altyapı, programlama dili veya implementasyon yöntemi tanımlamaz.

---

# 1. Ürün Özeti

Bu ürün, belirli bir etkinlik veya ortak deneyim kapsamında bir araya gelen insanların birbirleri hakkındaki ilk izlenimlerini, zaman içerisinde değişen düşüncelerini ve birlikte yaşadıkları anıları kaydedebilecekleri özel bir sosyal hatıra alanıdır.

Ürünün temel amacı analiz, performans değerlendirmesi, akademik araştırma veya katılımcıların puanlanması değildir.

Amaç; etkinlik sırasında oluşan düşünceleri mümkün olduğunca doğal haliyle saklamak ve etkinlik bittikten aylar veya yıllar sonra tekrar bakıldığında nostaljik, eğlenceli ve kişisel bir hatıra oluşturabilmektir.

Ürün, klasik bir okul yıllığının dijital ve zamana yayılan bir versiyonu gibi düşünülebilir.

Klasik yıllıklardan farklı olarak yalnızca:

> “Uğur hakkında düşündüklerim”

şeklinde tek bir final mesajı tutulmaz.

Aynı kişinin başka bir kişi hakkındaki düşünceleri zaman içerisinde birden fazla kayıt olarak tutulabilir:

> “İlk gördüğümde böyle düşünmüştüm.”

> “Sonra şu olay oldu ve fikrim değişti.”

> “Etkinliğin sonunda artık böyle düşünüyorum.”

Bu kayıtların zaman içerisinde üst üste gelmesi, ürünün temel değerlerinden biridir.

---

# 2. Ürün Vizyonu

Ürün kullanıcılarda şu hissi oluşturmalıdır:

> “Bu insanlarla tanıştığımız dönemin küçük bir zaman kapsülünü birlikte hazırladık.”

Etkinlik bittikten yıllar sonra kullanıcı tekrar sisteme veya dışarı aktardığı çıktıya baktığında:

- insanları ilk gördüğünde ne düşündüğünü,
- insanların kendisi hakkında ne düşündüğünü,
- bu düşüncelerin zamanla nasıl değiştiğini,
- grup içerisinde yaşanan küçük olayları,
- paylaşılan fotoğrafları,
- etkinlik döneminin genel atmosferini

hatırlayabilmelidir.

Ürün mümkün olduğunca hafif, sosyal ve eğlenceli hissettirmelidir.

Kullanıcıya anket dolduruyormuş, değerlendirme yapıyormuş veya başka insanları puanlıyormuş hissi verilmemelidir.

---

# 3. Ürün İlkeleri

## 3.1. Metin odaklılık

Ürünün esas içeriğini kullanıcıların kendi cümleleri oluşturur.

Sayısal değerlendirme, yıldız, puan, beğeni skoru, sıcaklık skoru veya benzeri değerlendirme sistemleri ürünün temel modelinde bulunmaz.

---

## 3.2. Zaman içerisindeki değişimi koruma

Bir kişinin başka biri hakkında birden fazla farklı zamanda düşünce bırakabilmesi ürünün temel özelliklerinden biridir.

Eski düşünceler yeni düşünceler tarafından ezilmemelidir.

Amaç yalnızca kişinin “şu anda ne düşündüğünü” kaydetmek değil, düşüncenin zaman içerisindeki yolculuğunu saklamaktır.

---

## 3.3. Katılım gönüllüdür

Bir kullanıcının etkinlikte bulunan herkes hakkında yorum yazması zorunlu değildir.

Kullanıcı:

- hiç tanışmadığı,
- yeterince etkileşim kurmadığı,
- hakkında bir şey yazmak istemediği

kişileri değerlendirmek zorunda değildir.

---

## 3.4. Sosyal güvenlik

“İsimsiz” içerik, sistem içerisinde gerçekten kaynağı bilinmeyen içerik anlamına gelmez.

Sistem içeriğin hangi kullanıcı tarafından oluşturulduğunu bilir.

“İsimsiz” seçeneği yalnızca diğer katılımcılara yazar adının gösterilmemesini ifade eder.

---

## 3.5. Kullanıcı verisini yanında götürebilmelidir

Bu hizmetin sonsuza kadar yaşayacağı varsayılmamalıdır.

Kullanıcıların oluşturdukları hatıraları sistem dışına çıkarıp uzun süre saklayabilmeleri ürünün temel değerlerinden biridir.

Bu nedenle dışarı aktarılabilir yıllık/PDF çıktıları ürünün yardımcı değil, temel özelliklerinden biri olarak değerlendirilmelidir.

---

# 4. Temel Kavramlar

## 4.1. Event / Etkinlik

Belirli bir grup insanın ortak deneyimini temsil eden ana alan.

Örnekler:

- Özgür Yazılım Yaz Kampı Laravel Sınıfı 2026
- Üniversite hazırlık kampı
- Yaz okulu
- Grup tatili
- Disneyland gezisi
- Şirket kampı
- Workshop
- Aile buluşması
- Uzun süreli eğitim programı

Her içerik en az bir etkinlikle ilişkilidir.

---

## 4.2. Participant / Katılımcı

Bir etkinliğe dahil olan kişi.

Bir kişinin sistemde kullanıcı hesabı bulunmadan önce de etkinliğin katılımcı listesinde yer alabilmesi gerekir.

Örneğin organizatör başlangıçta şu listeyi oluşturabilir:

- Ali Berk — [ali@example.com](mailto:ali@example.com)
- Ayşe Yılmaz — [ayse@example.com](mailto:ayse@example.com)
- Mehmet Demir — [mehmet@example.com](mailto:mehmet@example.com)

Kullanıcılar davetlerini kabul edip hesap oluşturduktan sonra ilgili katılımcı kayıtları kullanıcı hesaplarıyla ilişkilendirilir.

---

## 4.3. Impression / Kişi Hakkındaki İzlenim

Bir katılımcının aynı etkinlikte bulunan başka bir katılımcı hakkında bıraktığı zamana bağlı metin kaydıdır.

Bir impression:

- bir yazara,
- hakkında yazıldığı bir kişiye,
- bir etkinliğe,
- oluşturulma zamanına,
- görünürlük tercihine,
- isteğe bağlı görsellere

sahiptir.

Aynı kullanıcı aynı kişi hakkında zaman içerisinde birden fazla impression oluşturabilir.

---

## 4.4. Memory / Anı

Belirli bir kişiye değil, etkinliğin geneline bırakılan hatıra kaydıdır.

Memory içeriği:

- metin,
- bir veya birden fazla görsel

içerebilir.

Memory, etkinlik içerisinde bulunan herkesin ortak anılar alanında gösterilir.

---

## 4.5. Participant Profile / Etkinlik Profili

Bir kullanıcının belirli bir etkinlik içerisindeki görünümüdür.

Profil kullanıcının genel sosyal medya profili değildir.

Amaç yıllar sonra kişinin kolayca hatırlanabilmesidir.

Profil:

- isim,
- profil görseli,
- kısa kişisel açıklama,
- isteğe bağlı sınırlı iletişim/sosyal bağlantılar

içerebilir.

---

## 4.6. Yearbook / Yıllık

Etkinlik içerisinde oluşan içeriklerin kalıcı bir hatıraya dönüştürülmüş sunumudur.

Hem web üzerinde görüntülenebilir hem de dışarı aktarılabilir.

---

# 5. Kullanıcı Rolleri

## 5.1. Event Owner / Etkinlik Sahibi

Etkinliği ilk oluşturan kullanıcıdır.

Temel yetkileri:

- etkinliği oluşturmak,
- etkinlik bilgilerini düzenlemek,
- katılımcı eklemek,
- davet oluşturmak veya göndermek,
- katılımcı listesini yönetmek,
- etkinliğin temel görünürlük ve davranış ayarlarını belirlemek,
- gerektiğinde moderasyon işlemleri yapmak,
- etkinliği sonlandırmak veya arşivlemek.

---

## 5.2. Event Participant / Katılımcı

Daveti kabul ederek etkinliğe katılmış kullanıcıdır.

Temel yetkileri:

- etkinlikteki diğer katılımcıları görmek,
- kendi etkinlik profilini düzenlemek,
- diğer kişiler hakkında impression oluşturmak,
- daha önce oluşturduğu impression kayıtlarını görmek,
- kendisi hakkında görünür hale gelmiş impression kayıtlarını görmek,
- etkinlik anıları oluşturmak,
- etkinlik anılarını görüntülemek,
- etkinliğin izin verdiği yıllık çıktılarını oluşturmak veya indirmek.

---

## 5.3. Event Moderator

İlk sürümde ayrı bir rol olması zorunlu değildir.

İhtiyaç halinde Event Owner bazı moderasyon yetkilerini başka katılımcılara verebilir.

Bu özellik MVP sonrası değerlendirilebilir.

---

# 6. Event Oluşturma

Yeni etkinlik oluşturulurken en az aşağıdaki bilgiler alınmalıdır:

- etkinlik adı,
- başlangıç tarihi,
- bitiş tarihi veya yaklaşık bitiş tarihi,
- kısa etkinlik açıklaması.

İsteğe bağlı olarak:

- kapak görseli,
- etkinlik fotoğrafı,
- etkinlik konumu,
- uzun açıklama

eklenebilir.

Örnek:

**Etkinlik:** Özgür Yazılım Yaz Kampı 2026 — Laravel Sınıfı

**Tarih:** 15–23 Ağustos 2026

**Açıklama:** Dokuz gün boyunca aynı sınıfta eğitim alan Laravel sınıfının ortak hatıra alanı.

---

# 7. Katılımcıların Eklenmesi

Event Owner etkinliği oluşturduktan sonra katılımcı listesini oluşturabilir.

Her katılımcı için asgari olarak:

- isim

gereklidir.

Davetin e-posta üzerinden gerçekleştirileceği katılımcılar için:

- e-posta adresi

eklenebilir.

Katılımcılar tek tek veya toplu olarak eklenebilmelidir.

Bir katılımcının davet edilmeden önce sistem hesabı olması gerekmez.

---

# 8. Davet Sistemi

Bir katılımcının etkinliğe katılabilmesi için kendisine özel bir davet süreci bulunmalıdır.

Desteklenmesi gereken temel yöntemler:

### E-posta daveti

Katılımcının e-posta adresine etkinliğe özel davet gönderilir.

### Davet bağlantısı

Katılımcıya özel veya etkinliğin kurallarına uygun şekilde oluşturulmuş bir davet bağlantısı paylaşılabilir.

Kullanıcı bağlantıya geldiğinde:

1. etkinliği görür,
2. kim tarafından davet edildiğini görebilir,
3. mevcut hesabıyla giriş yapabilir veya hesap oluşturabilir,
4. daveti kabul eder,
5. sistem kendisini önceden oluşturulmuş Participant kaydıyla eşleştirir,
6. etkinliğe erişim kazanır.

---

# 9. Davet Durumları

Bir Participant kaydı aşağıdaki durumlardan birinde olabilir:

- davet edilmemiş,
- davet gönderilmiş,
- davet görüntülenmiş,
- davet kabul edilmiş,
- katılımcı aktif,
- katılımcı etkinlikten ayrılmış,
- davet iptal edilmiş.

Bu durumların tamamının kullanıcı arayüzünde gösterilmesi zorunlu değildir; ancak ürün davranışının belirlenebilmesi için sistem tarafından ayırt edilebilir olmalıdır.

---

# 10. Event Ana Sayfası

Etkinliğe girildiğinde kullanıcıya öncelikle etkinliğin sosyal içeriği gösterilmelidir.

Ana ekran aşağıdaki öğeleri içerebilir:

- etkinliğin adı,
- tarihleri,
- kapak görseli,
- kısa açıklama,
- katılımcı görselleri,
- son eklenen anılar,
- son eklenen veya kullanıcıya ilgili impression hareketleri,
- henüz hakkında bir şey yazılmamış kişiler için hafif yönlendirmeler.

Ana ekran bir dashboard gibi analitik görünmemelidir.

Amaç kullanıcıyı içerik üretmeye ve mevcut hatıraları incelemeye yönlendirmektir.

---

# 11. Katılımcılar Alanı

Etkinlik içerisindeki tüm katılımcılar görsel bir liste/grid şeklinde görüntülenebilmelidir.

Her kartta tercihen:

- profil fotoğrafı,
- isim

bulunur.

Kullanıcı bir kişiye bastığında Participant Profile sayfasına gider.

Katılımcıların listelenmesi alfabetik olmak zorunda değildir.

İleride farklı sıralama seçenekleri eklenebilir.

---

# 12. Katılımcı Profili

Bir katılımcının etkinlik içindeki kişisel sayfasıdır.

Sayfada:

- profil fotoğrafı,
- isim,
- etkinliğe özel kısa açıklama,
- kullanıcının paylaşmayı tercih ettiği bağlantılar,
- kullanıcı hakkında yazılmış ve görüntülenmesine izin verilen impression kayıtları

yer alabilir.

Kullanıcı kendi profilindeyse ayrıca profilini düzenleyebilir.

Başka bir kullanıcının profilindeyse:

**“Bu kişi hakkında bir şey yaz”**

eylemi görünür olmalıdır.

---

# 13. Profil Açıklaması

Katılımcıdan uzun ve kapsamlı bir biyografi beklenmemelidir.

Amaç kişinin etkinlik bağlamındaki küçük bir tanıtımını oluşturmaktır.

Örneğin:

> “Laravel öğrenmek için geldim. Kamp sonunda galiba en çok gece yapılan sohbetleri hatırlayacağım.”

Bu alan isteğe bağlıdır.

---

# 14. Impression Oluşturma

Bir kullanıcı aynı etkinlikte bulunan başka bir kullanıcı hakkında impression oluşturabilir.

Kullanıcı kendisi hakkında impression oluşturamaz.

Yeni impression ekranı en az:

- serbest metin alanı,
- görsel ekleme alanı,
- isim görünürlüğü tercihi

içermelidir.

---

# 15. Impression İçin Yazım Yönlendirmeleri

Kullanıcıya her zaman yalnızca:

> “Yorum yaz”

demek yerine bağlama uygun hafif yönlendirmeler gösterilebilir.

İlk kayıt sırasında örneğin:

> “Bu kişiyle ilk tanıştığınızda ne düşündünüz?”

> “İlk izleniminiz nasıldı?”

Daha önce kayıt varsa:

> “Onu tanıdıkça fikriniz değişti mi?”

> “Sonradan fark ettiğiniz bir şey oldu mu?”

> “Yeni bir şey eklemek ister misiniz?”

Bu metinler kullanıcıya yardımcı olur ancak herhangi bir formata zorlamaz.

Kullanıcı dilediği metni yazabilir.

---

# 16. Birden Fazla Impression

Aynı yazar aynı kişi hakkında sınırsız veya ürün tarafından belirlenecek makul sayıda impression oluşturabilir.

Örnek:

**1. kayıt — 15 Ağustos**

> “İlk gün biraz mesafeli biri olduğunu düşündüm.”

**2. kayıt — 18 Ağustos**

> “Meğer mesafeli değilmiş. Muhabbet etmeye başlayınca sınıfın en komik insanlarından biri çıktı.”

**3. kayıt — 23 Ağustos**

> “Kamp sonrasında da kesin görüşmek istediğim insanlardan biri.”

Bu kayıtlar birbirinin yerine geçmez.

Birlikte kişinin zaman içerisindeki düşünce akışını oluşturur.

---

# 17. Impression Kayıtlarının Değişmezliği

Ürünün nostaljik değerinin korunması için daha önce yazılmış kayıtların sonradan değiştirilmesi konusunda kontrollü davranılmalıdır.

Tercih edilen ürün davranışı:

- bir impression gönderildikten sonra geçmişteki düşünce kaydı olarak korunur,
- kullanıcı yeni düşüncesini eski kaydı değiştirmek yerine yeni impression oluşturarak ekler.

Yanlış yazım veya kişisel veri gibi zorunlu durumlar nedeniyle düzenleme ihtiyacı için sınırlı bir düzenleme süresi veya ayrı bir kaldırma mekanizması değerlendirilebilir.

Ancak normal kullanıcı akışı eski düşünceyi sürekli yeniden yazmaya teşvik etmemelidir.

---

# 18. Impression Görünürlük Tercihi

Her impression oluşturulurken kullanıcı şu iki seçenekten birini seçebilmelidir:

### İsmimle göster

İçeriğin yanında yazan kişinin adı görüntülenir.

Örneğin:

> “İlk gün çok ciddi biri sanmıştım.”

— Uğur

### İsimsiz göster

İçerik diğer katılımcılara gösterilir ancak yazar adı kullanıcı arayüzünde gösterilmez.

Örneğin:

> “İlk gün çok ciddi biri sanmıştım.”

— İsimsiz

Ürün bu içerikleri “anonim” olarak tanımlamamalıdır.

Doğru kavram “isimsiz” olmalıdır.

---

# 19. İsimsiz İçeriklerin Sistem Davranışı

Bir impression “isimsiz” olarak yayınlansa bile sistem içerisinde:

- hangi kullanıcı tarafından oluşturulduğu,
- hangi etkinliğe ait olduğu,
- kimin hakkında yazıldığı

bilinir.

Bu bilgi normal katılımcılara gösterilmez.

Moderasyon veya kötüye kullanım durumlarında yetkili kişiler tarafından gerekli süreç kapsamında değerlendirilebilir.

---

# 20. Impression Görselleri

Kullanıcı impression metnine bir veya birden fazla görsel ekleyebilir.

Örnek:

> “İlk gece bütün sınıf yurda dönerken çektiğimiz fotoğraf. Sanırım ilk kez burada gerçekten konuşmaya başladık.”

📷 Fotoğraf

Görsel, impression metninin bağlamının bir parçasıdır.

Impression silinir veya gizlenirse ona bağlı görseller de aynı görünürlük davranışını takip eder.

---

# 21. Kullanıcının Kendi Yazdıklarını Görmesi

Kullanıcı etkinlik içerisinde oluşturduğu tüm impression kayıtlarını görebilmelidir.

Bunlar:

- kişi bazında,
- kronolojik olarak

görüntülenebilir.

Kullanıcı yıllar sonra:

> “Ben bu insanlar hakkında ne düşünmüşüm?”

sorusunun cevabına ulaşabilmelidir.

---

# 22. Kullanıcının Kendisi Hakkında Yazılanları Görmesi

Bir kullanıcının Participant Profile sayfasında kendisi hakkında yazılmış ve görünür durumda olan impression kayıtları gösterilebilir.

Her kayıt:

- metni,
- görselleri,
- tarihini,
- yazarın görünürlük tercihine bağlı olarak adını veya “İsimsiz” ifadesini

içerir.

---

# 23. Başkaları Hakkındaki Impression'ları Görme

Etkinliğin sosyal yıllık mantığı gereği katılımcılar, diğer katılımcıların profillerinde onlara bırakılmış görünür impression kayıtlarını da görebilir.

Örneğin Ayşe, Ali'nin profiline girdiğinde Ali hakkında yazılmış impression'ları görebilir.

İsimsiz bırakılmış kayıtların yazar adı burada da gösterilmez.

Bu sayede her Participant Profile bir çeşit ortak yıllık sayfasına dönüşür.

---

# 24. Impression Yayın Zamanı

Ürün en az iki davranışı destekleyebilecek şekilde kurgulanmalıdır.

### Anında görünür

Impression oluşturulduğunda izin verilen kullanıcılar tarafından hemen görülebilir.

### Etkinlik sonunda görünür

Impression etkinlik boyunca kaydedilir ancak diğer kullanıcılara belirlenen açılış tarihine kadar gösterilmez.

Etkinlik sonunda bütün içerikler birlikte açılır.

Bu özellik “zaman kapsülü / yıllık açılışı” deneyimi yaratabilir.

Etkinlik sahibi Event oluştururken uygun davranışı seçebilir.

MVP kapsamında yalnızca bir davranış uygulanacaksa ürünün ilk kullanım senaryosu için anında görünürlük tercih edilebilir; ancak veri modeli ileride gecikmeli açılışa izin verecek şekilde düşünülmelidir.

---

# 25. Memories / Anılar

Impression'lardan bağımsız olarak etkinliğin ortak bir “Anılar” alanı bulunmalıdır.

Buradaki içerikler belirli bir kişi hakkında olmak zorunda değildir.

Örneğin:

> “Bugün yurda dönerken sekiz kişi markete girdik. Herkes ayrı ödeme yapınca arkamızda inanılmaz sıra oluştu. Kasiyerin yüzünü unutmayacağım.”

Memory oluştururken kullanıcı:

- metin yazabilir,
- görsel/görseller ekleyebilir.

---

# 26. Memory Görünürlüğü

Memory kayıtları varsayılan olarak etkinliğin bütün aktif katılımcıları tarafından görülebilir.

Memory için impression'daki gibi isimsiz paylaşım zorunlu değildir.

Varsayılan davranış, memory sahibinin adının görünmesidir.

İleride ihtiyaç görülürse isimsiz memory desteği ayrıca değerlendirilebilir.

---

# 27. Memory Zaman Bilgisi

Her memory oluşturulduğu tarihle ilişkilendirilir.

Kullanıcı isterse memory'nin gerçekleştiği günü ayrıca belirtebilir.

Böylece birkaç gün sonra yazılan bir anı gerçek olay tarihine bağlanabilir.

Örneğin:

**18 Ağustos**

> “Elektriklerin kesildiği gece…”

---

# 28. Memory Görselleri

Her memory bir veya birden fazla görsel içerebilir.

Görseller:

- memory detayında,
- etkinliğin ortak galerisi varsa orada,
- yıllık çıktısında

kullanılabilir.

Bir görselin aynı anda birden fazla memory veya impression içerisinde kullanılması zorunlu değildir.

---

# 29. Etkinlik Fotoğraf Alanı

Ürün başlangıçta bağımsız bir fotoğraf galerisi sunmak zorunda değildir.

Fotoğrafların öncelikli kullanım biçimi:

- profile bağlı görsel,
- impression'a bağlı görsel,
- memory'ye bağlı görsel

olmalıdır.

Bu sayede fotoğraflar bağlamsız bir dosya yığını haline gelmez.

İleride etkinlikteki tüm görselleri topluca gösteren bir galeri eklenebilir.

---

# 30. İçerik Akışı

Etkinlik içerisinde kronolojik veya sosyal bir içerik akışı bulunabilir.

Burada örneğin:

- yeni memory'ler,
- görünür hale gelmiş impression'lar,
- etkinliğe yeni katılan kişiler

gösterilebilir.

Akış sosyal medya benzeri engagement odaklı olmamalıdır.

Like, reaction, takipçi veya popülerlik mekanikleri ürünün temel kapsamına dahil değildir.

---

# 31. Bildirimler

Bildirimler kullanıcıyı ürüne geri getirmek için kullanılabilir ancak rahatsız edici olmamalıdır.

Örnek bildirimler:

- etkinliğe davet edildiniz,
- etkinliğe yeni bir katılımcı katıldı,
- hakkınızda yeni bir impression görünür hale geldi,
- etkinliğe yeni bir memory eklendi,
- yıllığınız hazır,
- etkinlik kapanmak üzere.

İsimsiz impression için bildirim yazar kimliğini açığa çıkarmamalıdır.

---

# 32. Etkinlik Yaşam Döngüsü

Bir Event genel olarak aşağıdaki aşamalardan geçer.

## Aşama 1 — Oluşturma

Event Owner etkinliği oluşturur.

## Aşama 2 — Katılımcı hazırlığı

Katılımcılar isim/e-posta ile eklenir.

## Aşama 3 — Davet

Katılımcılara davet gönderilir.

## Aşama 4 — Aktif etkinlik

Katılımcılar:

- profillerini doldurur,
- birbirleri hakkında impression yazar,
- anılar paylaşır.

## Aşama 5 — Etkinlik sonu

Etkinlik tamamlanır.

Gerekirse gecikmeli impression kayıtları görünür hale gelir.

## Aşama 6 — Yıllık

Etkinlik içeriği kalıcı bir yıllık görünümüne dönüşür.

## Aşama 7 — Arşiv

Etkinlik artık yoğun şekilde değişen bir sosyal alan olmaktan çıkar ve ağırlıklı olarak geçmişe dönük okunur.

---

# 33. Event Kapanışı

Etkinlik sahibi etkinliği “tamamlandı” durumuna alabilir.

Tamamlanmış etkinlik:

- görüntülenmeye devam eder,
- yıllık çıktıları oluşturabilir,
- eski impression ve memory'leri korur.

Yeni içerik eklenip eklenemeyeceği Event ayarı olarak belirlenebilir.

Örneğin:

### Yıllık kilitlendi

Yeni içerik eklenemez.

### Hatıralar açık

Etkinlik bitse bile katılımcılar yeni memory veya final notu ekleyebilir.

---

# 34. Yearbook Web Görünümü

Etkinlik tamamlandıktan sonra içerikler özel bir “yıllık” görünümünde sunulabilir.

Önerilen yapı:

## Kapak

- etkinlik adı,
- tarih,
- kapak fotoğrafı.

## Etkinlik hakkında

Kısa açıklama.

## Katılımcılar

Katılımcı fotoğraflarından oluşan alan.

## Anılar

Kronolojik veya seçilmiş memory kayıtları.

## Katılımcı sayfaları

Her katılımcı için:

- fotoğraf,
- isim,
- kısa açıklama,
- kendisi hakkında bırakılmış impression kayıtları,
- ilgili görseller.

---

# 35. PDF / Kalıcı Dışa Aktarım

Ürün en az bir kalıcı dışa aktarım formatı sağlamalıdır.

Ana hedef PDF benzeri uzun ömürlü, kullanıcı tarafından saklanabilir bir çıktı oluşturmaktır.

PDF çıktısı görsel bir yıllık mantığında hazırlanmalıdır.

Sadece ham veri tablosu olmamalıdır.

---

# 36. Event Yearbook Export

Etkinliğin ortak yıllığıdır.

İçeriği aşağıdakileri kapsayabilir:

1. Kapak
2. Etkinlik adı
3. Tarih
4. Etkinlik açıklaması
5. Katılımcı listesi
6. Katılımcı görselleri
7. Ortak anılar
8. Anılara bağlı fotoğraflar
9. Her katılımcı için ayrı bölüm
10. Katılımcı hakkında görünür impression kayıtları
11. Impression'lara bağlı görseller

İsimsiz impression'larda PDF içerisinde de yazar adı gösterilmez.

---

# 37. My Yearbook Export

Her kullanıcının kendisine özel kişisel çıktı oluşturabilmesi hedeflenmelidir.

Bu çıktı örneğin:

1. Etkinlik kapağı
2. Kullanıcının kendi profili
3. Kullanıcı hakkında yazılmış impression'lar
4. Kullanıcının başkaları hakkında yazdığı impression'lar
5. Kullanıcının oluşturduğu memory'ler
6. Etkinliğin ortak anılarından seçilmiş içerikler
7. Katılımcı listesi

içerebilir.

Bu çıktı kişisel bir hatıra dosyası olarak saklanabilir.

---

# 38. PDF Mahremiyet Kuralları

Bir içerik web üzerinde hangi görünürlük kurallarına sahipse dışa aktarım da aynı kurallara uymalıdır.

Örneğin:

- isimsiz impression PDF'de isimli hale gelmemelidir,
- gizlenmiş içerik PDF'e dahil edilmemelidir,
- kullanıcının erişim hakkı olmayan içerikler kişisel export'a dahil edilmemelidir.

---

# 39. İçerik Sahipliği ve Silme

Bir kullanıcı kendi oluşturduğu içerik üzerinde belirli kontrol sahibi olmalıdır.

Ancak ürünün geçmişi koruma niteliği nedeniyle “edit” ile “delete” aynı şekilde değerlendirilmemelidir.

Önerilen yaklaşım:

- yeni düşünce → yeni kayıt,
- geçmiş kaydı değiştirme → sınırlı,
- içeriği tamamen kaldırma → mümkün,
- gerektiğinde moderasyon nedeniyle kaldırma → mümkün.

Kaldırılan bir içeriğin daha önce oluşturulmuş PDF dosyalarından geri alınamayabileceği kullanıcıya gerektiğinde açıkça belirtilmelidir.

---

# 40. Kendi Hakkındaki İçeriği Gizleme

Bir kullanıcı kendisi hakkında yazılmış bir impression'ın görünür olmasını istemeyebilir.

Bu durumda en azından:

- içeriği bildir,
- içeriği kendi profilimden gizleme talebi oluştur

gibi seçenekler bulunmalıdır.

Ürün küçük ve kapalı gruplara yönelik olsa bile “başkası benim hakkımda yazdı, dolayısıyla sonsuza kadar görünmek zorunda” yaklaşımı kullanılmamalıdır.

---

# 41. Moderasyon

Bu ürün halka açık anonim yorum platformu değildir.

Buna rağmen kötüye kullanım ihtimali vardır.

Event Owner veya yetkilendirilmiş moderatör:

- uygunsuz içeriği gizleyebilmeli,
- içeriği kaldırabilmeli,
- bildirilen içeriği inceleyebilmeli,
- gerektiğinde katılımcının etkinlik erişimini sonlandırabilmelidir.

İsimsiz içerik moderasyon açısından gerçek kimliksiz içerik değildir.

---

# 42. İçerik Kuralları

Etkinliğe katılan kullanıcıların ilk katılım sırasında temel davranış kurallarını kabul etmesi istenebilir.

Basit ürün diliyle:

> Buradaki şeyler birlikte geçirdiğiniz dönemin hatırası olarak kalacak. İnsanlar hakkında eğlenceli ve samimi şeyler yazabilirsiniz; ancak hakaret, aşağılama, taciz, özel bilgi paylaşımı veya insanları rahatsız etmek için bu alanı kullanmayın.

Uzun ve hukuk dili ağırlıklı bir metin yerine kullanıcıya anlaşılır kısa bir özet sunulmalıdır.

Gerekli hukuki metinler ayrıca bulunabilir.

---

# 43. Consent / Rıza

Bir kullanıcı etkinliğe katılırken açık şekilde şunları anlamalıdır:

- etkinlikteki diğer kişilerin kendisi hakkında yazı yazabileceğini,
- bu içeriklerin etkinlikteki diğer kişiler tarafından görülebileceğini,
- bazı içeriklerin yazar adı gösterilmeden paylaşılabileceğini,
- kendi yazdığı içeriklerin yıllık çıktılarında yer alabileceğini,
- etkinliğe görsel yüklenebileceğini.

---

# 44. Görsellerde Rıza

Bir kullanıcının başkasının yer aldığı fotoğrafı yükleyebilmesi nedeniyle görsel içeriklerde de bildirim ve kaldırma mekanizması bulunmalıdır.

Fotoğrafta yer alan bir kullanıcı rahatsız olduğu bir görseli bildirebilmelidir.

---

# 45. Etkinlik Gizliliği

Event varsayılan olarak kapalı olmalıdır.

Etkinlik içeriği:

- arama motorları,
- etkinliğe katılmamış kullanıcılar,
- davetsiz ziyaretçiler

tarafından erişilebilir olmamalıdır.

Event sahibi ayrıca açıkça public paylaşım seçmediği sürece yıllık özel kalmalıdır.

Public etkinlik/yıllık özelliği MVP dışında tutulabilir.

---

# 46. Kullanıcı Hesabı ve Event Membership Ayrımı

Bir User birden fazla Event'e katılabilir.

Her Event'teki kimliği ve içeriği birbirinden ayrıdır.

Örneğin aynı kullanıcı:

- Özgür Yazılım Yaz Kampı 2026,
- şirket gezisi,
- başka bir workshop

içerisinde farklı Participant Profile kayıtlarına sahip olabilir.

Bir Event'teki içerikler otomatik olarak diğer Event'lere taşınmaz.

---

# 47. Katılımcının Etkinlikten Ayrılması

Bir katılımcı etkinlikten ayrılırsa:

- daha önce oluşturduğu içeriklerin ne olacağı açık bir ürün kuralına bağlı olmalıdır.

Önerilen varsayılan:

Kullanıcı etkinlikten ayrılsa bile geçmişte oluşturduğu ve yayınladığı içerikler yıllığın tarihsel bütünlüğünü korumak amacıyla kalabilir.

Ancak kullanıcı kendi hesabını veya kişisel verisini silmek isterse ilgili mahremiyet ve veri silme süreci ayrıca uygulanmalıdır.

---

# 48. Event Owner'ın Ayrılması

Event Owner hesabını kapatırsa etkinliğin tamamen erişilemez hale gelmemesi gerekir.

Ürün ileride Event sahipliğinin başka bir katılımcıya devredilmesini desteklemelidir.

MVP'de en azından Event Owner'ın Event'i başka bir aktif katılımcıya devredebileceği bir süreç bulunması önerilir.

---

# 49. Katılımcı Sayısı

Ürün küçük ve orta büyüklükte sosyal grupları doğal şekilde desteklemelidir.

Temel senaryo:

- yaklaşık 10–30 kişi,
- birkaç gün ile birkaç hafta arasında ortak deneyim.

Kullanıcı herkese impression yazmaya zorlanmadığı için daha büyük etkinliklerde de ürün mantığı bozulmaz.

---

# 50. “Henüz Tanımıyorum” Durumu

Ürünün temel yapısında zorunlu bir “henüz tanışmadım” form alanı bulunmasına gerek yoktur.

Bir kullanıcı hakkında impression bulunmaması doğal bir durumdur.

Sistem eksik impression'ları hata veya tamamlanmamış görev olarak değerlendirmemelidir.

---

# 51. Gamification

MVP'de aşağıdaki mekanikler önerilmez:

- puan,
- seviye,
- streak,
- liderlik tablosu,
- “16 kişiden 14'ünü değerlendirdiniz” baskısı,
- en çok yorum alan kişi,
- en popüler kişi,
- reaction sayısı üzerinden sıralama.

Ürünün motivasyonu rekabet değil, hatıra oluşturmaktır.

---

# 52. Reactions ve Yorumlar

İlk sürümde impression veya memory altına sosyal medya tarzı yorum dizileri zorunlu değildir.

Özellikle impression altındaki tartışmalar ürünün doğasını değiştirebilir.

MVP'de:

- impression,
- memory

tek başına içerik nesneleri olarak değerlendirilebilir.

İleride memory'lere hafif reaction veya yorum desteği ayrıca değerlendirilebilir.

---

# 53. Arama ve Filtreleme

MVP'de gelişmiş arama gerekmeyebilir.

Temel ihtiyaçlar:

- katılımcı adına göre kişiyi bulabilme,
- kendi yazdıklarını görebilme,
- kendisi hakkında yazılanları görebilme,
- memories alanında kronolojik gezebilme.

İçerik büyüdükçe gelişmiş arama eklenebilir.

---

# 54. Tarih Gösterimi

Zaman ürünün önemli bir parçasıdır.

Impression ve memory kayıtlarının ne zaman yazıldığı kullanıcıya anlaşılır şekilde gösterilmelidir.

Örneğin:

**15 Ağustos — İlk gün**

**18 Ağustos — 4. gün**

gibi event bağlamını destekleyen sunumlar kullanılabilir.

Bu bir zorunlu business rule değil, ürün deneyimi önerisidir.

---

# 55. Event'e Özel Terminoloji

Etkinlik sahibi isterse Event içerisindeki bazı kavramların kullanıcıya gösterilen adlarını kişiselleştirebilir.

Örneğin:

- Impression → “İlk izlenimler”
- Memory → “Kamp anıları”
- Participant → “Sınıf”
- Yearbook → “Kamp yıllığı”

Bu özellik MVP dışında bırakılabilir.

---

# 56. Boş Durumlar

Ürün boş ekran göstermemelidir.

Örneğin bir kişinin henüz impression'ı yoksa:

> “Ali hakkında henüz kimse bir şey bırakmamış.”

Kendi sayfasındaysa:

> “Henüz sana bırakılmış bir not yok. Biraz daha birbirinizi tanıyın. :)”

Memories boşsa:

> “İlk anıyı sen bırakabilirsin.”

gibi sıcak ve ürünün karakterine uygun metinler kullanılmalıdır.

---

# 57. Temel Kullanıcı Senaryosu

Uğur bir etkinlik oluşturur:

**Özgür Yazılım Yaz Kampı 2026 — Laravel**

Etkinliğe 16 kişiyi isim ve e-posta adresleriyle ekler.

Katılımcılara davet gönderilir.

Ali davet bağlantısına gelir ve hesap oluşturur.

Sistem Ali'nin hesabını önceden oluşturulmuş Ali Participant kaydıyla ilişkilendirir.

Ali kendi profil fotoğrafını ve kısa açıklamasını ekler.

Ali katılımcılar ekranından Ayşe'nin profiline girer.

“Bu kişi hakkında bir şey yaz” seçeneğine basar.

Şunu yazar:

> “İlk gün fazla sessiz olduğunu düşünmüştüm.”

İsimsiz göster seçeneğini seçer.

Bir fotoğraf ekler.

Üç gün sonra Ayşe hakkında tekrar şunu yazar:

> “Meğer sessiz değilmiş, sadece ilk gün kimseyi tanımıyormuş. Akşamki sohbetten sonra fikrim tamamen değişti.”

Bu kez ismiyle gösterir.

Etkinlik sırasında bir başka katılımcı Memories alanına:

> “Elektriklerin kesildiği gece herkes bahçeye çıktı. Kampın en güzel akşamı galiba buydu.”

yazıp fotoğraf ekler.

Etkinlik sonunda bütün katılımcılar bu içerikler arasında gezebilir.

Ali kendi profilinde kendisi hakkında bırakılmış yorumları görür.

Uğur Event Yearbook PDF oluşturur.

Ali ayrıca kendi My Yearbook çıktısını indirir.

Yıllar sonra sistem artık mevcut olmasa bile bu dosya etkinliğin kalıcı hatırası olarak saklanabilir.

---

# 58. MVP Kapsamı

İlk kullanılabilir sürüm için aşağıdaki özellikler yeterlidir:

- kullanıcı hesabı,
- Event oluşturma,
- Event bilgileri,
- Participant oluşturma,
- isim + e-posta ile katılımcı ekleme,
- davet gönderme veya davet bağlantısı,
- daveti kabul ederek Event'e bağlanma,
- Participant listesi,
- Participant Profile,
- profil fotoğrafı,
- kısa profil açıklaması,
- başka kullanıcı hakkında impression oluşturma,
- aynı kişi hakkında birden fazla impression,
- impression'da metin,
- impression'da görsel,
- “ismimle göster / isimsiz göster” tercihi,
- kişinin kendisi hakkında yazılanları görüntüleme,
- diğer kişiler hakkındaki görünür impression'ları görüntüleme,
- kendi yazdığı impression'ları görüntüleme,
- Memories alanı,
- memory metni,
- memory görselleri,
- temel Event kapanışı,
- Event Yearbook görünümü,
- PDF dışa aktarımı,
- temel içerik bildirme/gizleme,
- Event Owner moderasyonu.

---

# 59. MVP Dışı / Sonraki Aşamalar

İlk sürüm için zorunlu olmayan özellikler:

- reactions,
- yorum dizileri,
- kullanıcılar arası özel mesajlaşma,
- arkadaşlık sistemi,
- takip sistemi,
- puanlama,
- gelişmiş analytics,
- kişilik testleri,
- sosyal network grafikleri,
- popülerlik sıralamaları,
- gelişmiş profil sistemi,
- public Event'ler,
- herkese açık yıllık bağlantıları,
- video yükleme,
- gelişmiş galeri,
- otomatik yüz tanıma,
- AI tarafından kişiler hakkında özet veya değerlendirme üretme,
- Event içeriğinden otomatik sosyal medya postları,
- akademik veya istatistiksel raporlama.

---

# 60. Başarı Kriterleri

Ürün başarısı insanların ne kadar fazla kişiyi değerlendirdiğiyle ölçülmemelidir.

Ana başarı göstergeleri davranışsal olarak şunlar olabilir:

- davet edilen kişilerin etkinliğe katılması,
- katılımcıların kendi profillerini oluşturması,
- etkinlik içerisinde doğal şekilde impression oluşturulması,
- aynı kişi hakkında zaman içinde birden fazla kayıt oluşması,
- memory paylaşılması,
- etkinlik sonunda katılımcıların eski içerikleri tekrar görüntülemesi,
- kullanıcıların yıllık çıktısını oluşturması veya indirmesi,
- etkinlik bittikten sonra insanların tekrar sisteme dönmesi.

Ürünün en güçlü başarı sinyali şudur:

> Kullanıcı etkinlik bittikten uzun süre sonra sisteme veya yıllığına tekrar bakmak ister.

---

# 61. Ürünün Kısa Tanımı

Ürün dışarıdan tek cümleyle şöyle anlatılabilir:

> **Birlikte tanıştığınız insanlara dair ilk izlenimlerinizi, zamanla değişen düşüncelerinizi ve ortak anılarınızı saklayan dijital bir zaman kapsülü.**

Alternatif:

> **Birlikte yaşadığınız dönemin dijital yıllığı: ilk izlenimler, sonradan değişen fikirler ve ortak anılar.**

---

# 62. Ürün İçin Temel Business Rules Özeti

1. Her içerik bir Event'e aittir.
2. Event'lere yalnızca yetkili/davetli kullanıcılar erişir.
3. Event oluşturulduğunda Participant kayıtları kullanıcı hesabı bulunmadan hazırlanabilir.
4. Davet kabul edildiğinde User ile Participant eşleştirilir.
5. Bir Participant başka bir Participant hakkında impression yazabilir.
6. Kullanıcı kendisi hakkında impression yazamaz.
7. Aynı kişi hakkında birden fazla impression oluşturulabilir.
8. Yeni impression eskisini değiştirmez; zaman içerisinde yeni bir kayıt oluşturur.
9. Impression metin ve görsel içerebilir.
10. Her impression için yazar adı görünür veya isimsiz seçilebilir.
11. İsimsiz içerik sistem açısından kimliksiz değildir.
12. Kullanıcı hakkında yazılmış impression'lar Event görünürlük kurallarına göre diğer katılımcılar tarafından görüntülenebilir.
13. Impression oluşturmak zorunlu değildir.
14. Kullanıcı herkesi değerlendirmek zorunda değildir.
15. Memory belirli bir kişiye değil Event'e bağlıdır.
16. Memory metin ve görsel içerebilir.
17. Event içeriği varsayılan olarak Event dışındaki kişilerden gizlidir.
18. Kullanıcı uygunsuz içeriği bildirebilir.
19. Event Owner gerekli içerikleri gizleyebilir veya kaldırabilir.
20. Kullanıcıların kalıcı bir yıllık çıktısı oluşturabilmesi temel ürün gereksinimidir.
21. Dışa aktarımlar web üzerindeki görünürlük kurallarını ihlal edemez.
22. Üründe puanlama, sıralama veya insanları skorlayan bir mekanizma bulunmaz.
23. Ürünün temel amacı performans veya davranış analizi değil, sosyal hatıra oluşturmaktır.
24. Etkinlik sona erdiğinde içerikler kaybolmaz; Event bir arşiv/yıllık haline gelir.
25. Ürünün uzun vadeli değeri, etkinlik sırasında yazılan içeriklerin gelecekte tekrar okunabilmesidir.

---

# 63. Sonuç

Bu ürünün temel değeri herhangi bir sosyal ağ oluşturmak değildir.

Ürün insanların:

**“Birbirimizi tanımadan önce ne düşünüyorduk, sonra ne oldu ve birlikte neler yaşadık?”**

sorusunun cevabını saklamaktadır.

Bu nedenle bütün ürün kararlarında öncelik:

- doğal içerik üretimi,
- zaman içerisinde değişimin korunması,
- mahremiyet,
- küçük gruplarda güven,
- hatıraların kalıcılığı,
- yıllar sonra tekrar bakıldığında anlaşılır ve duygusal bir bütün oluşturması

olmalıdır.

Ürün mümkün olduğunca az mekanikle, insanların kendi yazdıkları metin ve görselleri merkeze almalıdır.

En sonunda ortaya çıkan şey bir veri tabanı, anket sonucu veya sosyal medya profili değil;

**belirli bir dönemde belirli insanların birlikte oluşturduğu dijital bir yıllık ve zaman kapsülü olmalıdır.**
