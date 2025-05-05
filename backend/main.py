from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
import json
import re

# API anahtarını ayarla
genai.configure(api_key="AIzaSyCwhmfiKKdGoEnB9O5LiJrXBy_XEQhbuQY")

# Gemini 2.0 modelini başlat
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

# CORS ayarlarını ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL'si
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptEvaluation(BaseModel):
    question: str
    prompt: str
    userInput: str
    questionNumber: int

def extract_json_from_text(text: str) -> str:
    """Metinden JSON kısmını çıkarır."""
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        return json_match.group(0)
    return text

def analyze_prompt(question: str, prompt: str, user_input: str, question_number: int) -> dict:
    # Zorluk seviyesi hesaplama (1-30 arası)
    difficulty_level = question_number / 30.0  # 0.033 (en kolay) ile 1.0 (en zor) arası

    evaluation_prompt = f"""Sen adil ve yapıcı değerlendirme yapan bir prompt mühendisisin. Kullanıcının verdiği yanıtı, verilen soru ve prompt doğrultusunda detaylı şekilde analiz et. 
    Bu {question_number}. soru, yani {int(difficulty_level * 100)}% zorluk seviyesinde. Kolay sorularda (1-10) daha toleranslı, orta zorluktaki sorularda (11-20) dengeli ve zor sorularda (21-30) daha detaylı değerlendirme yap.
    
    SORU: {question}
    SORU NUMARASI: {question_number} (Zorluk: {int(difficulty_level * 100)}%)
    PROMPT: {prompt}
    KULLANICI YANITI: {user_input}
    
    Kesinlikle sadece aşağıdaki formatta bir JSON yanıtı ver. Başka hiçbir açıklama veya metin ekleme.

    {{
        "skor": <0-100 arası sayı>,
        "feedback": "<max 250 karakterlik detaylı türkçe geri bildirim>",
        "suggestions": [
            "<max 100 karakterlik öneri 1>",
            "<max 100 karakterlik öneri 2>",
            "<max 100 karakterlik öneri 3 (opsiyonel)>"
        ]
    }}

    ZORLUK SEVİYESİNE GÖRE DEĞERLENDİRME:
    1. Kolay Sorular (1-10):
       - Başlangıç puanı: 70 puan
       - Temel yanıt yeterliliği: +20 puan
       - Ekstra detay/yaratıcılık: +10 puan
       - Minimum geçer puan: 60
       
    2. Orta Zorlukta Sorular (11-20):
       - Başlangıç puanı: 60 puan
       - İyi yapılandırılmış yanıt: +20 puan
       - Detaylı açıklama: +10 puan
       - Yaratıcı yaklaşım: +10 puan
       - Minimum geçer puan: 70
       
    3. Zor Sorular (21-30):
       - Başlangıç puanı: 50 puan
       - Kapsamlı yanıt: +20 puan
       - Detaylı açıklama: +15 puan
       - Yaratıcı ve özgün yaklaşım: +15 puan
       - Minimum geçer puan: 80

    DETAYLI DEĞERLENDİRME KRİTERLERİ:
    1. Skor Değerlendirmesi (Zorluk seviyesine göre ayarlanır):
       
       İçerik Kalitesi (40 puan):
       - Yanıtın detay seviyesi (15p * zorluk katsayısı)
       - Dil ve anlatım kalitesi (15p * zorluk katsayısı)
       - Özgünlük ve yaratıcılık (10p * zorluk katsayısı)
       
       Soruya Uygunluk (30 puan):
       - Doğru cevap oranı (20p * zorluk katsayısı)
       - Konu bütünlüğü (10p * zorluk katsayısı)
       
       Prompt Yönergelerine Uyum (30 puan):
       - Yönergeleri takip etme (20p * zorluk katsayısı)
       - Format ve yapı (10p * zorluk katsayısı)

    2. Feedback Yazımı (Zorluk Seviyesine Göre):
       Kolay Sorular (1-10):
       - 80-100: "Harika! Soruyu çok iyi anlamış ve yanıtlamışsınız."
       - 60-79: "İyi bir yanıt. Temel beklentiler karşılanmış."
       - 0-59: "Biraz daha detay ekleyerek geliştirebilirsiniz."

       Orta Zorlukta Sorular (11-20):
       - 85-100: "Mükemmel! Detaylı ve iyi düşünülmüş bir yanıt olmuş."
       - 70-84: "İyi bir çalışma. Birkaç noktada geliştirilebilir."
       - 0-69: "Daha kapsamlı bir yanıt gerekiyor."

       Zor Sorular (21-30):
       - 90-100: "Olağanüstü! Hem teknik hem de yaratıcı açıdan üst düzey."
       - 80-89: "Çok iyi! Birkaç ince detayla mükemmelleştirilebilir."
       - 0-79: "Daha detaylı ve kapsamlı bir yanıt bekleniyor."
       
       Geri bildirimde:
       - Zorluk seviyesine uygun beklentileri belirt
       - Olumlu yönleri vurgula
       - Geliştirme önerilerini nazikçe belirt
       - Motive edici bir dil kullan
       - Max 250 karakter kullan
    
    3. Öneriler:
       - Zorluk seviyesine uygun öneriler ver
       - En az 2, en fazla 3 yapıcı öneri sun
       - Her öneri uygulanabilir ve net olmalı
       - Her öneri max 100 karakter olmalı
       - Geliştirici ve motive edici öneriler sun
    
    NOT:
    - Tüm değerlendirmeler ve öneriler Türkçe olmalı
    - Yanıt kesinlikle geçerli JSON formatında olmalı
    - Karakter limitlerini aşma
    - Zorluk seviyesine göre beklentileri ayarla
    - Kolay sorularda daha toleranslı ol
    - Zor sorularda daha detaylı değerlendirme yap
    """
    
    try:
        response = model.generate_content(evaluation_prompt)
        response_text = response.text.strip()
        
        # Yanıttan JSON kısmını çıkar
        json_str = extract_json_from_text(response_text)
        
        # JSON'ı parse et
        result = json.loads(json_str)
        
        # Zorunlu alanları kontrol et
        required_fields = ["skor", "feedback", "suggestions"]
        if not all(field in result for field in required_fields):
            raise ValueError("Eksik alanlar var")
            
        # Skor kontrolü
        if not isinstance(result["skor"], (int, float)) or not 0 <= result["skor"] <= 100:
            raise ValueError("Skor 0-100 arasında olmalı")
            
        # Feedback karakter kontrolü
        if len(result["feedback"]) > 250:
            result["feedback"] = result["feedback"][:247] + "..."
            
        # Öneriler kontrolü
        if not isinstance(result["suggestions"], list) or len(result["suggestions"]) < 2:
            raise ValueError("En az 2 öneri olmalı")
        
        # En fazla 3 öneri olsun
        if len(result["suggestions"]) > 3:
            result["suggestions"] = result["suggestions"][:3]
            
        # Önerilerin karakter kontrolü
        result["suggestions"] = [
            (s[:97] + "...") if len(s) > 100 else s
            for s in result["suggestions"]
        ]
            
        return result
        
    except Exception as e:
        return {
            "skor": 0,
            "feedback": f"Değerlendirme sırasında bir hata oluştu: {str(e)}",
            "suggestions": [
                "Sistem hatası nedeniyle öneriler üretilemedi",
                "Lütfen tekrar deneyiniz"
            ]
        }

@app.post("/evaluate")
async def evaluate_prompt(evaluation: PromptEvaluation):
    try:
        result = analyze_prompt(
            evaluation.question,
            evaluation.prompt,
            evaluation.userInput,
            evaluation.questionNumber
        )
        return result
    except Exception as e:
        return {
            "error": str(e)
        } 