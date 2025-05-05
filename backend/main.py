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
       - Başlangıç puanı: 0 puan
       - Temel yanıt yeterliliği: +30 puan
       - Doğru içerik: +30 puan
       - Ekstra detay/yaratıcılık: +40 puan
       - Geçme notu: 70
       
    2. Orta Zorlukta Sorular (11-20):
       - Başlangıç puanı: 0 puan
       - Temel yanıt yeterliliği: +25 puan
       - Doğru içerik: +35 puan
       - Detaylı açıklama: +20 puan
       - Yaratıcı yaklaşım: +20 puan
       - Geçme notu: 70
       
    3. Zor Sorular (21-30):
       - Başlangıç puanı: 0 puan
       - Temel yanıt yeterliliği: +20 puan
       - Doğru içerik: +30 puan
       - Detaylı açıklama: +25 puan
       - Yaratıcı ve özgün yaklaşım: +25 puan
       - Geçme notu: 70

    DETAYLI DEĞERLENDİRME KRİTERLERİ:
    1. Skor Değerlendirmesi (Zorluk seviyesine göre ayarlanır):
       
       İçerik Kalitesi (40 puan):
       - Yanıtın detay seviyesi ve doğruluğu (20p)
       - Dil ve anlatım kalitesi (10p)
       - Özgünlük ve yaratıcılık (10p)
       
       Soruya Uygunluk (35 puan):
       - Doğru cevap oranı (25p)
       - Konu bütünlüğü (10p)
       
       Prompt Yönergelerine Uyum (25 puan):
       - Yönergeleri takip etme (15p)
       - Format ve yapı (10p)

       Boş veya anlamsız yanıtlar otomatik olarak 0 puan alır.

    2. Feedback Yazımı (Zorluk Seviyesine Göre):
       Kolay Sorular (1-10):
       - 85-100: "Mükemmel! Tüm beklentileri karşılayan eksiksiz bir yanıt."
       - 70-84: "İyi! Temel beklentiler karşılanmış ama geliştirilebilir."
       - 0-69: "Geçersiz. Daha fazla çaba ve detay gerekiyor."

       Orta Zorlukta Sorular (11-20):
       - 85-100: "Olağanüstü! Detaylı ve profesyonel bir yanıt."
       - 70-84: "Yeterli. Bazı eksikler var ama genel olarak iyi."
       - 0-69: "Geçersiz. Daha kapsamlı ve detaylı çalışma gerekiyor."

       Zor Sorular (21-30):
       - 85-100: "Kusursuz! Hem teknik hem yaratıcı açıdan üst düzey."
       - 70-84: "Başarılı. Birkaç eksiği var ama genel olarak iyi."
       - 0-69: "Geçersiz. Beklenen seviyenin altında, daha fazla çalışma gerekli."
       
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
    - Boş veya anlamsız yanıtlar 0 puan alır
    - Her zorluk seviyesi için geçme notu 70'tir
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