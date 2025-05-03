# PromptCraft

AI ile Oyunlaştırılmış Prompt Öğrenme Platformu

## 🚀 Proje Hakkında

PromptCraft, kullanıcılara yapay zeka ile etkili prompt yazmayı etkileşimli ve seviye tabanlı bir sistemle öğreten bir platformdur. Her seviyede AI tarafından verilen senaryolara göre kullanıcı prompt yazar, sistem bunu Gemini API ile değerlendirir, puanlar ve geribildirim sunar.

## 🛠️ Teknolojiler

- Backend: FastAPI, Python
- Frontend: Next.js, React, Tailwind CSS
- AI: Google Gemini API

## 📦 Kurulum

### Backend

1. Python 3.8+ yüklü olmalıdır
2. Gerekli paketleri yükleyin:
```bash
cd backend
pip install -r requirements.txt
```
3. `.env` dosyası oluşturun ve Gemini API anahtarınızı ekleyin:
```
GEMINI_API_KEY=your_api_key_here
```
4. Uygulamayı başlatın:
```bash
uvicorn app.main:app --reload
```

### Frontend

1. Node.js 16+ yüklü olmalıdır
2. Gerekli paketleri yükleyin:
```bash
cd frontend
npm install
```
3. Uygulamayı başlatın:
```bash
npm run dev
```

## 🎯 Özellikler

- Seviye tabanlı prompt öğrenme sistemi
- AI destekli değerlendirme ve geribildirim
- Detaylı puanlama sistemi
- Geliştirilmiş prompt önerileri
- Modern ve kullanıcı dostu arayüz

## 📝 Lisans

MIT 