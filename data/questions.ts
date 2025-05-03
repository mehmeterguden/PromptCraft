import { TestQuestion, LevelQuestion } from '../types/questions';

export const testQuestions: TestQuestion[] = [
  {
    difficulty: 'Kolay',
    question: 'Bir e-ticaret sitesi için ürün açıklaması yazan bir prompt oluşturun.',
    task: 'Müşteriler ürün açıklamalarının detaylı, ikna edici ve SEO dostu olmasını istiyor. Açıklamalar hem bilgilendirici hem de satış odaklı olmalı.',
    hints: [
      'Ürünün özelliklerini ve faydalarını vurgulayın',
      'Hedef kitleyi belirtin',
      'Ton ve üslup tercihlerini ekleyin',
      'Kelime sayısı sınırı belirtin'
    ]
  },
  {
    difficulty: 'Orta',
    question: 'Bir blog yazısı için araştırma yapan bir AI asistanı yönlendiren prompt yazın.',
    task: 'Blog yazısının kapsamlı, güncel ve doğru bilgiler içermesi gerekiyor. Asistan güvenilir kaynaklardan araştırma yapmalı ve bilgileri sentezlemeli.',
    hints: [
      'Araştırılacak konuyu net belirtin',
      'Kullanılacak kaynakları spesifik olarak belirtin',
      'Çıktı formatını tanımlayın',
      'Kaynak doğrulama kriterlerini ekleyin'
    ]
  },
  {
    difficulty: 'Zor',
    question: 'Bir veri analizi projesinde anomali tespiti yapan bir prompt oluşturun.',
    task: 'Büyük veri setlerinde anormal değerleri tespit edip raporlayan bir sistem gerekiyor. Sistem hem istatistiksel hem de bağlamsal anomalileri bulabilmeli.',
    hints: [
      'Anomali tiplerini tanımlayın',
      'Analiz parametrelerini belirtin',
      'Raporlama formatını detaylandırın',
      'Yanlış pozitifleri minimize etmek için kriterler ekleyin'
    ]
  }
];

export const levelQuestions: LevelQuestion[] = [
  // Kolay Seviye Soruları (1-10)
  {
    level: 1,
    question: "Basit bir to-do list uygulaması için prompt yazın.",
    task: "Kullanıcıların görevleri ekleyip, silebileceği ve tamamlandı olarak işaretleyebileceği bir uygulama için AI'ya talimatlar verin.",
    hints: [
      "Temel özellikleri listeleyin",
      "Kullanıcı etkileşimlerini tanımlayın",
      "Arayüz tasarımını belirtin"
    ]
  },
  {
    level: 2,
    question: "Hava durumu bildirimleri için prompt yazın.",
    task: "Kullanıcıya günlük hava durumunu anlaşılır ve doğal bir dille anlatan bir sistem için prompt oluşturun.",
    hints: [
      "Hangi hava durumu verilerinin kullanılacağını belirtin",
      "Bildirim formatını tanımlayın",
      "Kullanılacak dil ve üslubu belirtin"
    ]
  },
  {
    level: 3,
    question: "Basit bir hesap makinesi için prompt yazın.",
    task: "Temel matematik işlemlerini yapabilen bir hesap makinesi için AI'ya talimatlar verin.",
    hints: [
      "Desteklenecek işlemleri listeleyin",
      "Hata kontrollerini belirtin",
      "Çıktı formatını tanımlayın"
    ]
  },
  // ... Diğer kolay seviye soruları

  // Orta Seviye Soruları (11-20)
  {
    level: 11,
    question: "Bir sosyal medya analiz aracı için prompt yazın.",
    task: "Sosyal medya verilerini analiz edip, kullanıcı etkileşimlerini raporlayan bir sistem için prompt oluşturun.",
    hints: [
      "Analiz edilecek metrikleri belirtin",
      "Rapor formatını tanımlayın",
      "Görselleştirme tercihlerini ekleyin"
    ]
  },
  {
    level: 12,
    question: "Otomatik e-posta yanıtlayıcı için prompt yazın.",
    task: "Gelen e-postaları analiz edip uygun yanıtlar oluşturan bir sistem için prompt yazın.",
    hints: [
      "E-posta kategorilerini belirtin",
      "Yanıt tonunu tanımlayın",
      "Özelleştirme parametrelerini ekleyin"
    ]
  },
  // ... Diğer orta seviye soruları

  // Zor Seviye Soruları (21-30)
  {
    level: 21,
    question: "Doğal dil işleme modeli için prompt yazın.",
    task: "Metin sınıflandırma, duygu analizi ve özetleme yapabilen bir NLP sistemi için prompt oluşturun.",
    hints: [
      "Model parametrelerini belirtin",
      "Veri ön işleme adımlarını tanımlayın",
      "Çıktı formatlarını detaylandırın"
    ]
  },
  {
    level: 22,
    question: "Otomatik kod düzeltici için prompt yazın.",
    task: "Verilen kodu analiz edip hataları bulan ve düzelten bir sistem için prompt oluşturun.",
    hints: [
      "Desteklenen programlama dillerini belirtin",
      "Hata türlerini tanımlayın",
      "Düzeltme önerilerinin formatını belirtin"
    ]
  },
  // ... Diğer zor seviye soruları
]; 