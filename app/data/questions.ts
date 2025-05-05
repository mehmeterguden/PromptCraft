import { TestQuestion, LevelQuestion } from '../types/questions';

// Mevcut örnek Test Soruları (Bunlar giriş seviyesi prompt örnekleri sunmak için duruyor)
// Bunlar değişmedi, olduğu gibi kalıyor.
export const testQuestions: TestQuestion[] = [
    {
        difficulty: 'Kolay',
        question: 'Bir e-ticaret sitesi için ürün açıklaması yazan bir AI promptu oluşturun.',
        task: 'Hayali bir e-ticaret sitesi için satılacak bir ürünün (örn: akıllı saat, kahve makinesi) detaylı, ikna edici ve SEO dostu bir açıklamasını üretecek bir AI promptu yazın. Açıklamalar hem bilgilendirici hem de satış odaklı olmalı.',
        hints: [
          'Promptunuzda AI\'dan ürünün temel özelliklerini ve müşteriye sağlayacağı faydaları vurgulamasını isteyin.',
          'Hedef kitleyi (örn: teknoloji meraklıları, ev hanımları) belirtmek, AI\'nın daha uygun bir dil kullanmasına yardımcı olur.',
          'AI\'nın kullanmasını istediğiniz ton ve üslup tercihlerini (örn: neşeli, profesyonel, samimi) promptunuza ekleyin.',
        ]
      },
      {
        difficulty: 'Orta',
        question: 'Bir blog yazısı için araştırma yapacak bir AI asistanını yönlendiren bir prompt yazın.',
        task: 'Belirli bir konu (örn: yapay zekanın geleceği, iklim değişikliğinin etkileri) hakkında kapsamlı, güncel ve güvenilir kaynaklara dayalı bilgi toplayacak ve bunu özetleyecek bir AI asistanını yönlendiren bir prompt yazın.',
        hints: [
          'Promptunuzda araştırılacak konuyu mümkün olduğunca net ve spesifik olarak tanımlayın.',
          'AI\'dan hangi tür kaynakları (örn: akademik makaleler, resmi raporlar, güvenilir haber siteleri) tercih etmesini istediğinizi belirtin.',
          'Araştırma sonucunun hangi formatta (örn: madde işaretli özet, kısa paragraflar, anahtar çıkarımlar) sunulmasını istediğinizi açıklayın.',
        ]
      },
      {
        difficulty: 'Zor',
        question: 'Büyük bir veri setinde anomali tespiti yapacak bir AI sistemini yönlendiren bir prompt oluşturun.',
        task: 'Büyük bir veri setindeki (örn: müşteri işlem verileri, sensör okumaları) anormal (beklenmedik veya sıra dışı) değerleri tespit edip, bu anomalileri raporlayacak bir AI sistemini yönlendiren detaylı bir prompt yazın. Sistem hem istatistiksel hem de bağlamsal anomalileri bulabilmeli.',
        hints: [
          'Promptunuzda AI\'dan hangi tür anomalileri (örn: çok yüksek/düşük değerler, beklenmedik desenler, aykırı değerler) tespit etmesini beklediğinizi tanımlayın.',
          'Analiz için kullanılacak veri setinin yapısını (örn: hangi sütunlar önemli, veri tipleri neler) ve potansiyel analiz parametrelerini (örn: hangi istatistiksel yöntemler kullanılabilir) belirtin.',
          'Anomali raporunun hangi bilgileri içermesini ve hangi formatta (örn: anomali listesi, anomali skoru, olası neden açıklaması) sunulmasını istediğinizi detaylandırın.',
        ]
      }
];

// Seviyeye göre ilerleyen Prompt Mühendisliği Görevleri (1-30) - Yeniden Düzenlenmiş
export const levelQuestions: LevelQuestion[] = [
  // --- Kolay Seviye Görevleri (1-10) ---
  // Temel talimatlar, basit formatlama, hafif yaratıcılık
  {
    level: 1,
    question: "Beş Farklı Meyve Listesi Oluşturma",
    task: "Bir yapay zekadan (AI), birbirinden farklı beş adet meyve ismini içeren basit bir liste oluşturmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda AI'dan ne tür öğeler (meyve isimleri) listelemesini istediğinizi belirtin.",
      "Kaç tane öğe (beş tane) istediğinizi net bir şekilde ifade edin.",
      "Listenin basit bir formatta (örn: virgülle ayrılmış veya alt alta) olmasını beklediğinizi belirtin."
    ]
  },
  {
    level: 2,
    question: "Cümleyi Resmi Bir Tonda Yeniden Yazma",
    task: "Bir AI'dan, 'Bence bu fikir harika!' cümlesini daha resmi bir dille (örn: 'Bu fikrin oldukça değerli olduğunu düşünüyorum.') yeniden ifade etmesini istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda yeniden yazılacak orijinal cümleyi belirtin.",
      "İstenen yeni tonu (resmi, profesyonel vb.) açıkça ifade edin.",
      "AI'nın cümlenin ana anlamını koruyarak sadece üslubunu değiştirmesi gerektiğini vurgulayın."
    ]
  },
  {
    level: 3,
    question: "Metinden E-posta Adresi Çıkarma",
    task: "Bir AI'dan, 'Detaylı bilgi için ahmet.yilmaz@ornek.com adresine yazabilirsiniz.' gibi bir metin içerisinden sadece e-posta adresini ('ahmet.yilmaz@ornek.com') çekip çıkarmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda AI'nın içinden bilgi çıkaracağı metni belirtin.",
      "Ne tür bir bilgiyi (e-posta adresi) aradığını netleştirin.",
      "Çıktının sadece bulunan e-posta adresi olmasını beklediğinizi belirtin."
    ]
  },
  {
    level: 4,
    question: "Yeni Bir Kafe İçin Slogan Önerileri",
    task: "Bir AI'dan, yeni açılacak bir kahve dükkanı için akılda kalıcı üç farklı slogan (tagline) önermesini istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda ne için slogan istediğinizi (yeni kahve dükkanı) belirtin.",
      "Sloganların sahip olması gereken özellikleri (akılda kalıcı, kısa vb.) tanımlayın.",
      "Kaç tane slogan önerisi (üç tane) istediğinizi net bir şekilde ifade edin."
    ]
  },
  {
    level: 5,
    question: "Basit Bir Kavramı Açıklama (CPU)",
    task: "Bir AI'dan, 'CPU' (Merkezi İşlem Birimi) kavramının ne işe yaradığını, teknolojiyle arası iyi olmayan bir yetişkine yönelik, tek ve basit bir cümleyle açıklamasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda açıklanacak kavramı (CPU) belirtin.",
      "Hedef kitleyi (teknolojiyle arası iyi olmayan yetişkin) ve açıklamanın formatını (tek, basit cümle) tanımlayın.",
      "AI'dan karmaşık teknik terimlerden kaçınmasını ve bir benzetme kullanabileceğini (isteğe bağlı) belirtin."
    ]
  },
  {
    level: 6,
    question: "Kısa Metnin Duygusunu Belirleme",
    task: "Bir AI'dan, 'Bugün hava ne çok sıcak ne de çok soğuk.' cümlesinin genel duygusunu (örn: nötr, tarafsız) tek kelimeyle sınıflandırmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda analiz edilecek cümleyi belirtin.",
      "AI'dan yapmasını istediğiniz analizi (duygu sınıflandırması) ve çıktının formatını (tek kelime) netleştirin.",
      "AI'nın temel duygu kategorilerini (olumlu/negatif/nötr) bildiğini varsayarak basit bir sonuç isteyin."
    ]
  },
  {
    level: 7,
    question: "Basit Bir İşlem İçin Adım Listesi",
    task: "Bir AI'dan, online bir alışveriş sitesinden bir ürünü sepete eklemenin temel adımlarını (örn: ürünü bul, sepete ekle butonuna tıkla) madde işaretli kısa bir liste halinde yazmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda hangi işlem için (ürünü sepete ekleme) adımlar istediğinizi belirtin.",
      "Adımların temel ve anlaşılır olmasını istediğinizi vurgulayın.",
      "Çıktının formatını (madde işaretli liste) tanımlayın."
    ]
  },
  {
    level: 8,
    question: "Kısa Ürün Tanıtımı Yazma",
    task: "Bir AI'dan, 'kendi kendini temizleyen akıllı kupa' gibi hayali bir ürün için, ürünün ana faydasını vurgulayan iki cümlelik kısa bir tanıtım metni yazmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda tanıtılacak ürünü (akıllı kupa) ve temel özelliğini (kendi kendini temizleme) belirtin.",
      "Tanıtımın uzunluk kısıtlamasını (iki cümle) ve amacını (ana faydayı vurgulama) netleştirin.",
      "AI'dan ikna edici ve ilgi çekici bir dil kullanmasını isteyin."
    ]
  },
  {
    level: 9,
    question: "Basit Rol Yapma: Seyahat Danışmanı",
    task: "Bir AI'dan, bir seyahat danışmanı rolünü üstlenerek, İtalya'nın Roma şehrini ziyaret eden bir turiste mutlaka görmesi gereken tarihi bir yer önermesini istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda AI'dan üstlenmesini istediğiniz rolü (seyahat danışmanı) belirtin.",
      "Danışmanlık yapılacak konuyu (Roma ziyareti) ve istenen öneri türünü (tarihi bir yer) tanımlayın.",
      "AI'dan sadece bir yer önermesini ve nedenini kısaca belirtmesini (isteğe bağlı) isteyin."
    ]
  },
  {
    level: 10,
    question: "Basit Kod Fonksiyon Tanımı (Python)",
    task: "Bir AI'dan, Python dilinde iki sayıyı toplayıp sonucu döndürecek basit bir fonksiyonun sadece tanım satırını (`def fonksiyon_adi(parametreler):`) ve ne iş yaptığını açıklayan kısa bir docstring'ini (`\"\"\"Bu fonksiyon...\"\"\"`) oluşturmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda hangi programlama dilini (Python) ve fonksiyonun amacını (iki sayıyı toplama) belirtin.",
      "AI'dan sadece fonksiyonun imzasını (tanım satırı) ve kısa bir açıklama metnini (docstring) istediğinizi netleştirin.",
      "Fonksiyonun içine kod yazmasını değil, sadece tanım ve açıklama kısmını oluşturmasını isteyin."
    ]
  },

  // --- Orta Seviye Görevleri (11-20) ---
  // Daha detaylı talimatlar, yapılandırılmış çıktılar, karşılaştırma, fikir üretme
  {
    level: 11,
    question: "Verilen Anahtar Kelimelerle Kısa Hikaye Yazma",
    task: "Bir AI'dan 'robot', 'orman', 'yıldız' anahtar kelimelerini kullanarak, yaklaşık 3-4 cümlelik kısa bir bilim kurgu hikayesi oluşturmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda kullanılacak anahtar kelimeleri ('robot', 'orman', 'yıldız') belirtin.",
      "Hikayenin türünü (bilim kurgu) ve yaklaşık uzunluğunu (3-4 cümle) tanımlayın.",
      "AI'dan kelimeleri anlamlı bir şekilde hikayeye entegre etmesini isteyin."
    ]
  },
  {
    level: 12,
    question: "Paragrafı İki Ana Fikre Özetleme",
    task: "Bir AI'dan, size verilen yaklaşık 100 kelimelik bir paragrafı okuyup, içindeki iki ana fikri madde işaretleri kullanarak özetlemesini istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda özetlenecek paragrafı (veya kaynağını) belirtin.",
      "Özetin kaç ana fikirden (iki tane) oluşması gerektiğini ve formatını (madde işaretli) tanımlayın.",
      "AI'dan paragrafın en önemli noktalarını yakalamasını isteyin."
    ]
  },
  {
    level: 13,
    question: "Profesyonel E-posta Taslağı (Proje Güncellemesi)",
    task: "Bir AI'dan, bir iş arkadaşınızdan sorumlu olduğu projenin son durumu hakkında bilgi isteyen, kısa ve profesyonel bir dille yazılmış bir e-posta taslağı oluşturmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda e-postanın amacını (proje güncellemesi isteme) ve tonunu (profesyonel, nazik) belirtin.",
      "E-postanın içermesi gereken temel unsurları (selamlama, isteğin belirtilmesi, teşekkür, kapanış) tanımlayın.",
      "AI'dan taslağı genel ve farklı durumlara uyarlanabilir şekilde yazmasını isteyin."
    ]
  },
  {
    level: 14,
    question: "İki Kavramı Karşılaştırma (Laptop vs Tablet)",
    task: "Bir AI'dan, 'laptop' (dizüstü bilgisayar) ve 'tablet' cihazlarını, özellikle 'taşınabilirlik' ve 'işlem gücü' açısından karşılaştıran kısa bir paragraf yazmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda karşılaştırılacak iki kavramı (laptop, tablet) belirtin.",
      "Karşılaştırmanın odaklanması gereken kriterleri (taşınabilirlik, işlem gücü) netleştirin.",
      "AI'dan her iki cihazın bu kriterlere göre avantaj ve dezavantajlarını dengeli bir şekilde sunmasını isteyin."
    ]
  },
  {
    level: 15,
    question: "Basit JSON Verisi Oluşturma (Kullanıcı Bilgisi)",
    task: "Bir AI'dan, bir kullanıcıyı temsil eden; 'ad', 'soyad' ve 'sehir' anahtarlarına sahip, değerleri örnek verilerle doldurulmuş (örn: 'Ayşe', 'Kaya', 'İstanbul') basit bir JSON nesnesi oluşturmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda oluşturulacak veri yapısının formatını (JSON nesnesi) belirtin.",
      "JSON nesnesinde bulunması gereken anahtarları ('ad', 'soyad', 'sehir') listeleyin.",
      "AI'dan bu anahtarlara uygun örnek değerler atamasını isteyin."
    ]
  },
  {
    level: 16,
    question: "Belirli Bir Konuda Fikir Üretme (Blog Yazısı)",
    task: "Bir AI'dan, 'şehirde sürdürülebilir yaşam' konulu bir blog için yazılabilecek beş farklı ve ilgi çekici yazı başlığı fikri üretmesini istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda fikir üretilecek ana konuyu ('şehirde sürdürülebilir yaşam') belirtin.",
      "Ne tür fikirler (blog yazısı başlıkları) ve kaç tane (beş tane) istediğinizi netleştirin.",
      "AI'dan hem bilgilendirici hem de okuyucunun ilgisini çekecek başlıklar önermesini teşvik edin."
    ]
  },
  {
    level: 17,
    question: "Teknik Bir Terimi Basitleştirme (Phishing)",
    task: "Bir AI'dan, 'phishing' (oltalama) saldırısının ne olduğunu, interneti yeni kullanmaya başlayan birine anlatır gibi, basit terimlerle ve kısa bir uyarı ekleyerek açıklamasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda açıklanacak teknik terimi ('phishing') ve hedef kitleyi (internette yeni kullanıcı) belirtin.",
      "Açıklamanın basit, anlaşılır olmasını ve bir örnek/benzetme içermesini (isteğe bağlı) isteyin.",
      "AI'dan açıklamanın sonuna kısa ve net bir korunma uyarısı eklemesini talep edin."
    ]
  },
  {
    level: 18,
    question: "Bir Konunun Artılarını ve Eksilerini Listeleme",
    task: "Bir AI'dan, 'evden çalışmanın' hem avantajlarından (artılarından) iki tane hem de dezavantajlarından (eksilerinden) iki tane belirleyip bunları ayrı listeler halinde sunmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda artı ve eksileri listelenecek konuyu ('evden çalışma') belirtin.",
      "Hem artılardan hem de eksilerden kaçar tane (ikişer tane) istediğinizi netleştirin.",
      "Çıktının 'Artıları:' ve 'Eksileri:' gibi başlıklarla net bir şekilde ayrılmasını istediğinizi tanımlayın."
    ]
  },
  {
    level: 19,
    question: "Sosyal Medya İçin Duyuru Metni Yazma",
    task: "Bir AI'dan, hayali bir mobil uygulama için geliştirilen 'karanlık mod' özelliğini duyuran, kullanıcıları denemeye teşvik eden kısa (1-2 cümlelik) bir sosyal medya gönderisi metni yazmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda duyurulacak özelliği ('karanlık mod') ve platformu (sosyal medya) belirtin.",
      "Gönderinin amacını (duyuru yapma, kullanıcıyı teşvik etme) ve tonunu (heyecanlı, bilgilendirici vb.) tanımlayın.",
      "Metnin kısa ve dikkat çekici olmasını, bir eylem çağrısı (call to action) içermesini (isteğe bağlı) isteyin."
    ]
  },
  {
    level: 20,
    question: "Basit Bir Senaryoyu Simüle Etme (Müşteri Hizmetleri)",
    task: "Bir AI'dan, bir müşterinin şifresini unuttuğu için destek hattına yazdığı ve temsilcinin ona ilk adımları sorduğu çok kısa (2-3 konuşma sırası) bir müşteri hizmetleri diyaloğunu canlandırmasını (simüle etmesini) istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda canlandırılacak senaryoyu (şifre unutma destek diyaloğu) ve rolleri (müşteri, temsilci) belirtin.",
      "Diyaloğun ne kadar sürmesi gerektiğini (çok kısa, 2-3 konuşma sırası) tanımlayın.",
      "AI'dan her konuşmacının sözünü ayrı ayrı belirtmesini (örn: Müşteri: ..., Temsilci: ...) isteyin."
    ]
  },

  // --- Zor Seviye Görevleri (21-30) ---
  // Kompleks talimatlar, kodlama, ileri kavramlar, strateji, detaylı yaratıcılık
  {
    level: 21,
    question: "Hata Kontrollü Kod Yazdırma (Python Ortalama)",
    task: "Bir AI'dan, Python dilinde, kendisine verilen sayı listesinin aritmetik ortalamasını hesaplayan bir fonksiyon yazmasını isteyin. Fonksiyonun, boş liste verilmesi durumunda hata vermemesini (örn: 0 döndürmesini veya özel bir mesaj vermesini) sağlayacak şekilde nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda istenen fonksiyonun amacını (liste ortalaması hesaplama) ve programlama dilini (Python) belirtin.",
      "Fonksiyonun girdi olarak ne alacağını (sayı listesi) ve ne döndüreceğini (ortalama) tanımlayın.",
      "Özellikle ele alınması gereken hata durumunu (boş liste) ve bu durumda beklenen davranışı (hata vermemek, belirli bir değer döndürmek) netleştirin."
    ]
  },
  {
    level: 22,
    question: "İleri ML Kavramlarını Benzetmeyle Açıklama",
    task: "Bir AI'dan, makine öğrenmesindeki 'Gözetimli Öğrenme' (Supervised Learning) ve 'Gözetimsiz Öğrenme' (Unsupervised Learning) arasındaki temel farkı, her biri için akılda kalıcı bir benzetme (analogy) kullanarak açıklamasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda açıklanması istenen iki kavramı (Gözetimli ve Gözetimsiz Öğrenme) belirtin.",
      "AI'dan aralarındaki temel farka (etiketli veri vs etiketsiz veri) odaklanmasını isteyin.",
      "Her bir kavram için ayrı ve açıklayıcı bir benzetme (analogy) kullanmasını özellikle talep edin."
    ]
  },
  {
    level: 23,
    question: "Detaylı Pazarlama Planı Taslağı Oluşturma",
    task: "Bir AI'dan, piyasaya yeni çıkacak çevre dostu bir temizlik ürünü için kapsamlı bir pazarlama planının ana başlıklarını (örn: Hedef Kitle Analizi, Rakip Analizi, Fiyatlandırma Stratejisi, Tanıtım Kanalları, Bütçe Tahmini, Başarı Metrikleri) içeren detaylı bir taslak oluşturmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda pazarlama planının konusu olan ürünü (çevre dostu temizlik ürünü) belirtin.",
      "Planın kapsamlı olması gerektiğini ve içermesi beklenen ana bölümleri (Hedef Kitle, Rakipler, Fiyatlandırma vb.) listeleyin.",
      "AI'dan her başlık altına kısaca nelerin dahil edilebileceğine dair alt maddeler veya sorular eklemesini (isteğe bağlı) isteyin."
    ]
  },
  {
    level: 24,
    question: "Müşteri Geri Bildirimini Çok Yönlü Analiz Etme",
    task: "Bir AI'dan, kısa bir müşteri yorumunu ('Uygulamanız çok yavaş çalışıyor ve arayüzü karışık.') analiz ederek; 1) Genel duygunun ne olduğunu (örn: olumsuz), 2) Bahsedilen ana sorunları (yavaşlık, karışık arayüz), 3) Bu yoruma verilebilecek yanıt türünü (örn: teknik destek, özür) belirlemesini istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda analiz edilecek müşteri yorumunu belirtin.",
      "AI'dan yapmasını istediğiniz analiz adımlarını (duygu tespiti, sorun çıkarımı, yanıt kategorizasyonu) net bir şekilde numaralandırarak veya listeleyerek belirtin.",
      "Her adım için beklenen çıktının formatını (örn: Duygu: Olumsuz, Sorunlar: [liste], Yanıt Kategorisi: Teknik Destek) tanımlayın."
    ]
  },
  {
    level: 25,
    question: "Detaylı Senaryo Sahnesi Yazdırma",
    task: "Bir AI'dan, bir senaryo için; karakterlerden birinin çok sakin diğerinin ise çok telaşlı olduğu, kayıp bir hazine haritası üzerine tartıştıkları kısa bir sahne (diyalog ağırlıklı) yazmasını istemek için nasıl bir prompt yazardın? Sahnenin bir kütüphanede geçtiğini belirtin.",
    hints: [
      "Promptunuzda sahnenin geçtiği mekanı (kütüphane) ve ana konusunu (kayıp harita üzerine tartışma) belirtin.",
      "Karakterlerin temel kişilik özelliklerini (biri sakin, diğeri telaşlı) tanımlayın.",
      "Sahnenin formatını (senaryo formatında, diyalog ağırlıklı) ve AI'dan karakterlerin kişiliklerine uygun diyaloglar yazmasını isteyin."
    ]
  },
  {
    level: 26,
    question: "Teknik Bir Yöntemi Uygulamalı Açıklama (A/B Testi)",
    task: "Bir AI'dan, 'A/B Testi' yönteminin ne olduğunu kısaca açıkladıktan sonra, bir e-ticaret sitesinin ürün sayfasındaki 'Satın Al' butonunun rengini test etmek için bu yöntemin nasıl uygulanabileceğini adımlar halinde anlatmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda açıklanacak yöntemi (A/B Testi) belirtin.",
      "AI'dan önce yöntemin genel bir tanımını yapmasını, sonra da belirli bir uygulama örneği (buton rengi testi) üzerinden adımlarını anlatmasını isteyin.",
      "Uygulama adımlarının net ve anlaşılır olmasını (örn: hipotez kurma, varyasyonları oluşturma, trafik yönlendirme, sonuçları analiz etme) talep edin."
    ]
  },
  {
    level: 27,
    question: "Belirli Bir Rol İçin Mülakat Soruları Hazırlama",
    task: "Bir AI'dan, bir şirketin 'Yapay Zeka Etik Uzmanı' pozisyonu için işe alım sürecinde adaya sorulabilecek, hem teknik bilgi hem de eleştirel düşünme becerisini ölçen 5 adet mülakat sorusu hazırlamasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda mülakat yapılacak pozisyonu ('Yapay Zeka Etik Uzmanı') net bir şekilde belirtin.",
      "Soruların amacını (teknik bilgi ve eleştirel düşünmeyi ölçme) tanımlayın.",
      "Kaç tane soru (5 adet) istediğinizi ve soruların pozisyona uygun derinlikte ve düşündürücü olmasını beklediğinizi belirtin."
    ]
  },
  {
    level: 28,
    question: "Karşıt Görüş Simülasyonu (Tartışma)",
    task: "Bir AI'dan, bir tartışma ortamında 'genetiği değiştirilmiş organizmaların (GDO) yasaklanması gerektiği' fikrine karşı çıkan bir rolü üstlenmesini ve bu karşıt görüşü destekleyen üç farklı argüman sunmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda AI'dan üstlenmesini istediğiniz rolü (GDO'ların yasaklanmasına karşı çıkan tartışmacı) belirtin.",
      "Savunulacak ana fikri (GDO karşıtlığına karşı çıkma) netleştirin.",
      "AI'dan bu fikri destekleyen belirli sayıda (üç tane) farklı ve mantıklı argüman sunmasını isteyin."
    ]
  },
  {
    level: 29,
    question: "Veri Analizi Süreci Taslağı Oluşturma",
    task: "Bir AI'dan, bir online film platformunun kullanıcı verilerini (izleme geçmişi, puanlamalar, demografik bilgiler - varsayımsal olarak) analiz ederek 'hangi tür filmlerin hangi kullanıcı segmentleri tarafından daha çok tercih edildiğini' anlama amacıyla izlenmesi gereken temel veri analizi adımlarını (veri toplama, temizleme, keşifsel analiz, segmentasyon, görselleştirme vb.) listelemesini istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda analizin amacını (film tercihleri ve kullanıcı segmentleri arasındaki ilişkiyi bulma) ve kullanılacak (varsayımsal) veri türlerini belirtin.",
      "AI'dan bu amaca ulaşmak için izlenmesi gereken mantıksal analiz adımlarını (veri toplama, temizleme, analiz, görselleştirme vb.) sıralamasını isteyin.",
      "Adımların genel bir süreci yansıtmasını ve her adımın amacını kısaca belirtmesini (isteğe bağlı) talep edin."
    ]
  },
  {
    level: 30,
    question: "Belirli Bir Yazarın Üslubunda Felsefi Hikaye Yazma",
    task: "Bir AI'dan, insanların anılarını dijital olarak yedekleyebildiği bir gelecekte geçen, bu teknolojinin kimlik ve özgünlük üzerindeki etkilerini sorgulayan, yaklaşık 300 kelimelik kısa bir felsefi hikayeyi, ünlü bilim kurgu yazarı Ursula K. Le Guin'in düşünsel derinliği ve sorgulayıcı üslubunu yansıtacak şekilde yazmasını istemek için nasıl bir prompt yazardın?",
    hints: [
      "Promptunuzda hikayenin ana temasını (dijital anı yedekleme ve kimlik sorunu), geçtiği zamanı (gelecek) ve yaklaşık uzunluğunu (300 kelime) belirtin.",
      "Taklit edilmesi istenen yazarın üslubunu (Ursula K. Le Guin - düşünsel derinlik, sorgulayıcı dil) net bir şekilde tanımlayın.",
      "AI'dan sadece olay anlatmak yerine, temanın felsefi boyutlarını ve karakterlerin içsel sorgulamalarını ön plana çıkarmasını isteyin."
    ]
  }
];