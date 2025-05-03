import { TestQuestion, LevelQuestion } from '../types/questions';

// Mevcut örnek Test Soruları (Bunlar giriş seviyesi prompt örnekleri sunmak için duruyor)
export const testQuestions: TestQuestion[] = [
  {
    difficulty: 'Kolay',
    question: 'Bir e-ticaret sitesi için ürün açıklaması yazan bir AI promptu oluşturun.',
    task: 'Hayali bir e-ticaret sitesi için satılacak bir ürünün (örn: akıllı saat, kahve makinesi) detaylı, ikna edici ve SEO dostu bir açıklamasını üretecek bir AI promptu yazın. Açıklamalar hem bilgilendirici hem de satış odaklı olmalı.',
    hints: [
      'Promptunuzda ürünün özelliklerini ve müşteriye sağlayacağı faydaları vurgulamasını isteyin.',
      'Hedef kitleyi belirtin (örn: teknoloji meraklıları, ev hanımları).',
      'AI\'nın kullanması gereken ton ve üslup tercihlerini ekleyin (örn: neşeli, profesyonel, samimi).',
      'İsteğe bağlı olarak açıklamanın kelime sayısı sınırını belirtin.'
    ]
  },
  {
    difficulty: 'Orta',
    question: 'Bir blog yazısı için araştırma yapacak bir AI asistanını yönlendiren bir prompt yazın.',
    task: 'Belirli bir konu (örn: yapay zekanın geleceği, iklim değişikliğinin etkileri) hakkında kapsamlı, güncel ve güvenilir kaynaklara dayalı bilgi toplayacak ve bunu özetleyecek bir AI asistanını yönlendiren bir prompt yazın.',
    hints: [
      'Promptunuzda araştırılacak konuyu çok net ve spesifik olarak belirtin.',
      'AI\'dan hangi tür kaynakları kullanmasını istediğinizi ekleyin (örn: akademik makaleler, resmi raporlar, haber siteleri).',
      'Araştırma sonucunun hangi formatta (örn: madde işaretli özet, paragraf) sunulmasını istediğinizi tanımlayın.',
      'İsteğe bağlı olarak AI\'dan kaynakların güvenilirliğini nasıl doğrulaması gerektiğine dair kriterler ekleyin.'
    ]
  },
  {
    difficulty: 'Zor',
    question: 'Büyük bir veri setinde anomali tespiti yapacak bir AI sistemini yönlendiren bir prompt oluşturun.',
    task: 'Büyük bir veri setindeki (örn: müşteri işlem verileri, sensör okumaları) anormal (beklenmedik veya sıra dışı) değerleri tespit edip, bu anomalileri raporlayacak bir AI sistemini yönlendiren detaylı bir prompt yazın. Sistem hem istatistiksel hem de bağlamsal anomalileri bulabilmeli.',
    hints: [
      'Promptunuzda AI\'dan hangi tür anomalileri (örn: çok yüksek/düşük değerler, beklenmedik desenler) tespit etmesini istediğinizi tanımlayın.',
      'Analiz parametrelerini belirtin (örn: hangi sütunlar incelenecek, hangi istatistiksel yöntemler kullanılabilir).',
      'Anomali raporunun hangi formatta (örn: anomali listesi, açıklama, olası nedenler) detaylandırılmasını istediğinizi belirtin.',
      'Yanlış pozitifleri (gerçekte anomali olmayanları) minimize etmek için AI\'nın dikkate alması gereken ek kriterler veya eşikler ekleyin.'
    ]
  }
];

// Seviyeye göre ilerleyen Prompt Mühendisliği Görevleri (1-30) - Kullanıcının prompt yazacağı görevler
export const levelQuestions: LevelQuestion[] = [
  // Kolay Seviye Görevleri (1-10) - Temel prompt yazma becerileri, basit çıktılar
  {
    level: 1,
    question: "Basit Bir Yapılacaklar Listesi Prompt'u",
    task: "AI'ya, kullanıcıların görevleri ekleyebileceği, silebileceği ve tamamlandı olarak işaretleyebileceği temel bir yapılacaklar listesi uygulamasının işlevselliğini tanımlayan bir prompt yazın.",
    hints: [
      "Promptunuzda uygulamanın temel özelliklerini (ekleme, silme, işaretleme) belirtin.",
      "Kullanıcı etkileşimlerinin nasıl olacağını tarif edin.",
      "İsteğe bağlı olarak arayüzün nasıl görünebileceğine dair ipuçları ekleyin."
    ]
  },
  {
    level: 2,
    question: "Hava Durumu Bildirimi Prompt'u",
    task: "Kullanıcıya günlük hava durumunu anlaşılır, doğal ve kısa bir dille anlatan bir sistem için AI'ya yönergeler veren bir prompt oluşturun.",
    hints: [
      "Promptunuzda hangi hava durumu verilerinin (sıcaklık, durum, rüzgar) kullanılacağını belirtin.",
      "Bildirimin hangi formatta (örn: 'Bugün hava [durum], sıcaklık [derece]') olacağını tanımlayın.",
      "Kullanılacak dilin tonunu (örn: samimi, bilgilendirici) belirtin."
    ]
  },
  {
    level: 3,
    question: "Basit Hesap Makinesi Prompt'u",
    task: "Temel matematik işlemlerini (toplama, çıkarma, çarpma, bölme) yapabilen bir hesap makinesi uygulamasının işlevselliğini AI'ya anlatan bir prompt yazın.",
    hints: [
      "Promptunuzda desteklenecek matematik işlemlerini listeleyin.",
      "AI'dan olası hataları (örn: sıfıra bölme) nasıl ele alması gerektiğini belirtmesini isteyin (isteğe bağlı).",
      "Sonucun hangi formatta gösterileceğini tanımlayın."
    ]
  },
  {
    level: 4,
    question: "Sayı Sıralama Prompt'u",
    task: "Verilen bir sayı listesini (örn: 5, 2, 8, 1) küçükten büyüğe (artan) sıraya göre sıralayan bir algoritma veya fonksiyonun çalışma mantığını AI'ya açıklayan bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan bir sayı listesini giriş olarak alacağını belirtin.",
      "Sıralama yöntemini (baloncuk sıralama, eklemeli sıralama vb. gibi spesifik bir algoritma veya genel bir açıklama) tarif edin.",
      "Çıktının sıralanmış liste formatında olacağını belirtin."
    ]
  },
  {
    level: 5,
    question: "Metin Ters Çevirme Prompt'u",
    task: "Kullanıcının girdiği herhangi bir metni (örn: 'merhaba dünya'), karakterleri tersten olacak şekilde (örn: 'aynüd abahrem') döndüren bir aracın işlevselliğini AI'ya anlatan bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan bir metin dizesini giriş olarak alacağını belirtin.",
      "Metni nasıl ters çevirmesi gerektiğini (karakter karakter sondan başa doğru okuma) açıklayın.",
      "Çıktının ters çevrilmiş metin formatında olacağını belirtin."
    ]
  },
  {
    level: 6,
    question: "Tek/Çift Sayı Kontrolü Prompt'u",
    task: "Verilen bir tam sayının tek mi yoksa çift mi olduğunu belirleyen basit bir kontrol mekanizmasını AI'ya anlatan bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan bir tam sayıyı giriş olarak alacağını belirtin.",
      "Kontrol mantığını (sayının 2'ye bölümünden kalanın 0 olup olmaması) açıklayın.",
      "Çıktının 'Tek' veya 'Çift' gibi bir metin formatında olacağını belirtin."
    ]
  },
  {
    level: 7,
    question: "Rastgele Sayı Üretici Prompt'u",
    task: "Belirlenen minimum ve maksimum değerler (örn: 1 ile 100 arası) dahil olmak üzere, bu aralıkta rastgele bir tam sayı üreten bir fonksiyonun tanımını AI'ya yapan bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan bir minimum ve bir maksimum değer alacağını belirtin.",
      "Üretilecek sayının tam sayı olacağını ve aralığın sınırlarını içereceğini vurgulayın.",
      "Çıktının tek bir rastgele sayı formatında olacağını belirtin."
    ]
  },
  {
    level: 8,
    question: "Listedeki En Büyük Sayıyı Bulma Prompt'u",
    task: "Sayılar içeren bir listeden (örn: [10, 4, 25, 7]) en büyük değeri bulan bir işlemin adımlarını AI'ya anlatan bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan bir sayı listesini giriş olarak alacağını belirtin.",
      "En büyük sayıyı bulma mantığını (listeyi dolaşarak en büyük değeri takip etme) açıklayın.",
      "Çıktının bulunan en büyük sayı formatında olacağını belirtin."
    ]
  },
  {
    level: 9,
    question: "Sıcaklık Dönüştürücü Prompt'u (Santigrat -> Fahrenhayt)",
    task: "Santigrat derece cinsinden verilen bir sıcaklık değerini Fahrenhayt dereceye çeviren bir hesaplama fonksiyonunu AI'ya tarif eden bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan Santigrat cinsinden bir sayı alacağını belirtin.",
      "Çevrim için kullanılacak formülü ekleyin (F = C * 9/5 + 32) veya AI'nın bu dönüşümü yapmasını isteyin.",
      "Çıktının Fahrenhayt cinsinden sayı formatında olacağını belirtin."
    ]
  },
  {
    level: 10,
    question: "Kişiselleştirilmiş Karşılama Prompt'u",
    task: "Kullanıcı adı bilgisini alarak (örn: 'Ahmet'), bu adı içeren kişiselleştirilmiş, basit bir karşılama mesajı (örn: 'Merhaba Ahmet, hoş geldiniz!') oluşturan bir metin üretim görevini AI'ya anlatan bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan bir kullanıcı adı alacağını belirtin.",
      "Mesajın temel yapısını (örn: 'Merhaba [Kullanıcı Adı], [ek mesaj]') tanımlayın.",
      "Çıktının tek bir metin dizesi formatında olacağını belirtin."
    ]
  },

  // Orta Seviye Görevleri (11-20) - Daha karmaşık mantık, temel veri işleme, otomasyon fikirleri
  {
    level: 11,
    question: "Sosyal Medya Etkileşim Analizi Prompt'u",
    task: "Belirli bir sosyal medya gönderisi veya konu hakkındaki temel etkileşim metriklerini (beğeni sayısı, yorum sayısı, paylaşım sayısı) analiz edip, bu verileri anlamlı bir şekilde özetleyen bir AI aracını tanımlayan bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan analiz edilecek sosyal medya gönderisi/konusu ve ilgili etkileşim verilerini alacağını belirtin.",
      "Hangi metriklerin (beğeni, yorum, paylaşım) dikkate alınacağını netleştirin.",
      "Analiz sonucunun hangi formatta (örn: toplamlar, oranlar, kısa bir yorum) sunulmasını istediğinizi tanımlayın."
    ]
  },
  {
    level: 12,
    question: "Otomatik E-posta Taslağı Yanıtlayıcı Prompt'u",
    task: "Gelen e-postaların konusunu veya içeriğini analiz ederek, buna uygun (örn: 'teşekkür', 'bilgi talebi', 'destek ihtiyacı') taslak bir e-posta yanıtı oluşturan bir AI sistemini yönlendiren bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan bir e-postanın konusunu ve içeriğini alacağını belirtin.",
      "AI'nın tespit etmesi gereken farklı e-posta kategorilerini veya amaçlarını (örn: sipariş, destek, genel soru) listeleyin.",
      "Her kategori için taslak yanıtın tonunu (örn: resmi, samimi) ve içermesi gereken temel bilgileri (örn: 'talebiniz alındı', 'size dönüş yapacağız') tanımlayın."
    ]
  },
  {
    level: 13,
    question: "Web Formu Giriş Doğrulama Prompt'u",
    task: "Bir web formundaki farklı giriş alanları (örn: e-posta adresi, telefon numarası, şifre, doğum tarihi) için temel doğrulama (validation) kurallarını açıklayan bir AI yönergesi promptu oluşturun.",
    hints: [
      "Promptunuzda AI'dan doğrulama yapılacak alan tiplerini (e-posta, telefon vb.) alacağını belirtin.",
      "Her alan tipi için uygulanacak geçerli format kurallarını (örn: e-posta için '@' ve '.' içermeli, şifre en az 8 karakter olmalı) açıklayın.",
      "Doğrulama başarısız olduğunda kullanıcıya gösterilecek hata mesajı örneklerini veya formatını belirtin."
    ]
  },
  {
    level: 14,
    question: "Zar Atma Simülasyonu Prompt'u",
    task: "Belirli sayıda altı yüzlü zarın atılmasını simüle eden ve her bir zarın sonucunu (veya toplamını) döndüren bir AI görevini tanımlayan bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan kaç adet zar atılacağını alacağını belirtin.",
      "Zarların altı yüzlü olduğunu varsaymasını isteyin (veya zar sayısını belirtin).",
      "Çıktının her zarın ayrı ayrı sonucu mu, yoksa zarların toplamı mı olacağını netleştirin."
    ]
  },
  {
    level: 15,
    question: "Toplantı Gündemi Taslağı Prompt'u",
    task: "Verilen bir konu listesini (örn: 'Proje A Güncellemesi', 'Yeni Fikirler', 'Bütçe Durumu') kullanarak, standart bir formatta madde madde bir toplantı gündemi taslağı oluşturan bir AI için talimatlar veren bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan bir konu listesini giriş olarak alacağını belirtin.",
      "Gündemin hangi standart bölümleri içermesi gerektiğini tanımlayın (örn: Giriş, Konular, Kararlar, Kapanış).",
      "İsteğe bağlı olarak her konu için tahmini bir süre eklemesini isteyin."
    ]
  },
  {
    level: 16,
    question: "Quiz Puanlama Mantığı Prompt'u",
    task: "Çoktan seçmeli bir quizde verilen cevaplara göre bir kullanıcının puanını hesaplama mantığını (örn: doğru cevap +10, yanlış cevap -5, boş 0) AI'ya açıklayan bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan kullanıcının cevap listesini ve doğru cevap anahtarını alacağını belirtin.",
      "Puanlama kuralını her bir cevap türü (doğru, yanlış, boş) için açıkça tanımlayın.",
      "Sonucun toplam puan formatında olacağını belirtin."
    ]
  },
  {
    level: 17,
    question: "CSV Verisi Ayrıştırma Prompt'u",
    task: "Virgülle ayrılmış değerler (CSV) formatında verilen tek bir metin satırındaki (örn: 'Elma,Kırmızı,Taze,3.50') alanları ayrı ayrı listeleyen (parse eden) bir AI görevini tanımlayan bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan virgülle ayrılmış bir metin satırı alacağını belirtin.",
      "Alanların hangi karakterle ayrıldığını (virgül) net olarak belirtin.",
      "Çıktının ayrıştırılmış alanların bir listesi veya dizi şeklinde olacağını tanımlayın."
    ]
  },
  {
    level: 18,
    question: "Basit Film Öneri Prompt'u",
    task: "Kullanıcının girdiği bir film türüne (örn: Bilim Kurgu, Romantik Komedi) göre basit bir film önerisinde bulunan bir AI görevini tanımlayan bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan hangi film türünde öneri istendiğini alacağını belirtin.",
      "AI'dan bu türe uygun bir veya birkaç film adı önermesini isteyin.",
      "Önerinin formatını (sadece film adı, belki kısa bir cümle açıklama) tanımlayın."
    ]
  },
  {
    level: 19,
    question: "Veritabanı Tablo Şeması Taslağı Prompt'u",
    task: "Basit bir varlık (örn: 'Müşteri') için temel veritabanı tablo şemasını (sütun adları ve veri tipleri) tanımlayan bir AI yönergesi promptu oluşturun.",
    hints: [
      "Promptunuzda AI'dan hangi varlık için şema oluşturulacağını belirtin.",
      "Tabloda olması gereken temel sütun adlarını (örn: 'musteri_id', 'ad', 'eposta') listelemesini isteyin.",
      "Her sütun için uygun olabilecek veri tipini (örn: INT, VARCHAR, TEXT, DATE) belirtmesini isteyin."
    ]
  },
  {
    level: 20,
    question: "Recursion (Özyineleme) Kavramı Açıklaması Prompt'u",
    task: "Bilgisayar bilimlerindeki özyineleme (recursion) kavramını, faktöriyel hesaplama gibi basit ve anlaşılır bir örnek kullanarak açıklayan bir AI metni üretecek bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan özyineleme kavramını tanımlamasını isteyin.",
      "Açıklama için kullanılacak somut bir örneği (faktöriyel hesaplama) belirtin.",
      "AI'dan örnek üzerinden özyinelemenin temel adımlarını (recursive case, base case) anlatmasını isteyin."
    ]
  },

  // Zor Seviye Görevleri (21-30) - İleri kavramlar, detaylı sistem tasarımları, çok adımlı süreçler
  {
    level: 21,
    question: "Çok Görevli NLP Sistemi Prompt'u",
    task: "Tek bir prompt ile, bir metin için hem duygu analizi yapacak, hem metni kategorize edecek (spor, politika vb.), hem de kısa bir özetini çıkaracak bir AI sistemini yönlendiren detaylı bir prompt yazın. Her bir çıktı formatını belirtin.",
    hints: [
      "Promptunuzda AI'dan hangi metin üzerinde çalışacağını belirtin.",
      "AI'dan yapmasını istediğiniz üç görevi (duygu analizi, sınıflandırma, özetleme) açıkça listeleyin.",
      "Her bir görev için beklenen çıktı formatını ayrı ayrı tanımlayın (örn: Duygu: Pozitif/Negatif/Nötr; Kategori: [Kategori Adı]; Özet: [Kısa Paragraf])."
    ]
  },
  {
    level: 22,
    question: "Otomatik Kod Düzeltici Prompt'u",
    task: "Belirli bir programlama dilinde (örn: Python) verilen bir kod parçasındaki yaygın sözdizimi (syntax) veya basit mantık hatalarını tespit edip, bu hataları düzelten veya düzeltme önerileri sunan bir AI sistemini yönlendiren bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan analiz edilecek kod parçasını ve hangi programlama dilinde olduğunu alacağını belirtin.",
      "AI'dan tespit etmesini istediğiniz hata türlerine dair örnekler verin (örn: eksik parantez, yanlış girinti, tanımlanmamış değişken).",
      "AI'dan hata bulunan satırı, hatanın açıklamasını ve önerilen düzeltmeyi belirtecek bir çıktı formatı isteyin."
    ]
  },
    {
    level: 23,
    question: "ML Model Sorunları Açıklama Prompt'u (Overfitting/Underfitting)",
    task: "Makine öğrenmesinde sık karşılaşılan Overfitting (aşırı uyum) ve Underfitting (eksik uyum) kavramlarını, neden ortaya çıktıklarını ve bu sorunlarla başa çıkmak için kullanılabilecek yöntemleri detaylıca açıklayan bir AI metni üretecek bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan Overfitting ve Underfitting kavramlarını net bir dille tanımlamasını isteyin.",
      "Her bir durumun (Overfitting/Underfitting) temel nedenlerini (örn: model karmaşıklığı, veri miktarı) açıklamasını beklediğinizi belirtin.",
      "Bu sorunları çözmek için kullanılabilecek yaygın yöntemleri (örn: regularization, daha fazla veri toplama, model seçimi) açıklamasını isteyin."
    ]
  },
  {
    level: 24,
    question: "Graf Geçiş Algoritması Açıklama Prompt'u (BFS veya DFS)",
    task: "Bilgisayar bilimlerindeki graf geçiş algoritmalarından Genişlik-Öncelikli Arama (BFS) veya Derinlik-Öncelikli Arama (DFS) algoritmalarından birinin çalışma prensibini, temel adımlarını ve hangi veri yapısını (kuyruk veya stack) kullandığını detaylıca anlatan bir AI metni üretecek bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan BFS veya DFS algoritmalarından birini seçmesini (veya hangisini istediğinizi belirtin) ve açıklamasını isteyin.",
      "Algoritmanın bir graf üzerinde nasıl ilerlediğini (komşuları önce mi, derinlemesine mi) adım adım anlatmasını talep edin.",
      "Algoritmanın kullandığı temel veri yapısını (BFS için kuyruk, DFS için stack) ve nedenini açıklamasını isteyin."
    ]
  },
  {
    level: 25,
    question: "Unit Test Senaryoları Üretme Prompt'u",
    task: "Belirli bir fonksiyon (örn: bir dizideki pozitif sayıların toplamını bulan) için farklı durumları (boş dizi, tümü pozitif, tümü negatif, karışık) kapsayan Unit Test senaryoları listesi oluşturan bir AI görevini tanımlayan bir prompt oluşturun. Her senaryo için girdiyi ve beklenen çıktıyı belirtmesini isteyin.",
    hints: [
      "Promptunuzda AI'dan test edilecek fonksiyonu (ve işlevini) tarif edin.",
      "AI'dan farklı test durumu türlerini (örn: geçerli girdiler, köşe durumlar, geçersiz girdiler - isteğe bağlı) düşünmesini isteyin.",
      "Her test senaryosu için hangi girdiyi kullanacağını ve bu girdi için fonksiyonun doğru çıktısının ne olması gerektiğini belirtmesini talep edin."
    ]
  },
  {
    level: 26,
    question: "RESTful API Prensip Açıklaması Prompt'u",
    task: "Web servis tasarımında yaygın olarak kullanılan RESTful API mimari tarzını, temel prensiplerini (örneğin, Kaynak Odaklılık, Durumsuzluk) ve neden popüler olduğunu açıklayan bilgilendirici bir AI metni üretecek bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan REST'in ne anlama geldiğini (Representational State Transfer) ve temel amacını açıklamasını isteyin.",
      "RESTful tasarımın temel prensiplerini (kaynaklar, durumsuzluk, istemci-sunucu vb.) madde madde açıklamasını talep edin.",
      "AI'dan RESTful API'lerin web servisleri için neden iyi bir yaklaşım olduğunu anlatan bir paragraf eklemesini isteyin."
    ]
  },
  {
    level: 27,
    question: "Web Uygulaması Hata Yönetimi Stratejisi Prompt'u",
    task: "Basit bir web uygulamasında ortaya çıkabilecek farklı hata türleri (örn: veritabanı hatası, kullanıcı girişi hatası, yetkilendirme hatası) için temel bir hata yönetimi (error handling) stratejisi taslağı (nasıl yakalanır, loglanır, kullanıcıya ne gösterilir) oluşturan bir AI yönergesi promptu yazın.",
    hints: [
      "Promptunuzda AI'dan web uygulamasında karşılaşılabilecek farklı hata tiplerini sınıflandırmasını isteyin.",
      "Her hata tipi için temel eylem adımlarını (örn: hata yakalama, detayları loglama, kullanıcıya genel/güvenli bir mesaj gösterme) açıklamasını talep edin.",
      "Güvenlik açısından hassas bilgilerin (örn: veritabanı şifreleri) hata mesajlarında gösterilmemesi gerektiğine dair bir not eklemesini isteyin (isteğe bağlı)."
    ]
  },
  {
    level: 28,
    question: "Belirli Bir Yazarın Stilinde Metin Üretme Prompt'u",
    task: "Belirli bir yazarın (örn: Orhan Pamuk, Jane Austen) veya edebi bir türün (örn: Gotik hikaye) belirgin üslubunu taklit ederek kısa, yaratıcı bir metin (bir paragraf veya sahne) üretecek bir AI görevini tanımlayan bir prompt oluşturun.",
    hints: [
      "Promptunuzda AI'dan taklit edilecek yazarın adını veya edebi türü açıkça belirtin.",
      "Üretilecek metnin konusunu veya içermesi gereken unsurları (bir karakter, bir olay, bir mekan) sağlayın.",
      "AI'dan o yazarın/türün karakteristik üslup özelliklerine (cümle yapısı, kelime seçimi, atmosfer, anlatım biçimi) dikkat etmesini isteyin."
    ]
  },
  {
    level: 29,
    question: "Dağıtık Sistemlerde CAP Teoremi Açıklaması Prompt'u",
    task: "Dağıtık sistemlerdeki Consistency (Tutarlılık), Availability (Erişilebilirlik) ve Partition Tolerance (Bölümleme Toleransı) kavramlarını ve CAP teoreminin bu üç özellikten herhangi ikisinin aynı anda tam olarak sağlanabileceğini anlatan bilgilendirici bir AI metni üretecek bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan Consistency, Availability ve Partition Tolerance kavramlarını ayrı ayrı tanımlamasını isteyin.",
      "AI'dan CAP teoreminin temel çıkarımını (en fazla iki özellik) net bir şekilde açıklamasını talep edin.",
      "Farklı senaryolarda (örn: ağ hatası olduğunda) hangi iki özelliğin korunabileceğine dair örnekler eklemesini isteyin (isteğe bağlı)."
    ]
  },
  {
    level: 30,
    question: "Reinforcement Learning (RL) Temelleri Prompt'u",
    task: "Basit bir oyun (örn: satranç, labirentten çıkma) oynayan bir yapay zeka agent'ı için Reinforcement Learning (Pekiştirmeli Öğrenme) yaklaşımının temel bileşenlerini (Ortam, Agent, State, Action, Reward) bu oyun bağlamında açıklayan bir AI metni üretecek bir prompt yazın.",
    hints: [
      "Promptunuzda AI'dan açıklama için kullanılacak basit oyunu (veya senaryoyu) belirtmesini isteyin.",
      "AI'dan RL'nin temel bileşenlerini (Agent, Ortam, State, Action, Reward) tanımlamasını talep edin.",
      "AI'dan her bir bileşenin seçilen oyun bağlamında ne anlama geldiğini örneklerle açıklamasını isteyin (örn: Satrançta 'State' oyun tahtasının güncel durumu, 'Action' bir taşın hamlesi, 'Reward' oyunu kazanma)."
    ]
  }
];