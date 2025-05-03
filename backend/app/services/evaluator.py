import google.generativeai as genai
import json
import os
from typing import Dict, Any
from app.models.schemas import EvaluationResponse

# Gemini API anahtarını .env dosyasından al
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Görev verilerini yükle
with open("app/prompt_tasks.json", "r", encoding="utf-8") as f:
    TASKS = json.load(f)

async def evaluate_prompt(prompt: str, task_id: int) -> EvaluationResponse:
    # Görev bilgilerini al
    task = TASKS[str(task_id)]
    
    # Gemini modelini başlat
    model = genai.GenerativeModel('gemini-pro')
    
    # Değerlendirme promptunu oluştur
    evaluation_prompt = f"""
    Görev: {task['description']}
    Beklenen Hedef: {task['expected_goal']}
    
    Kullanıcının yazdığı prompt: {prompt}
    
    Lütfen bu promptu şu kriterlere göre değerlendir:
    1. Netlik (0-10)
    2. Özgünlük (0-10)
    3. Hedef Uyumu (0-10)
    
    Ayrıca:
    - Geliştirme önerileri sun
    - Daha iyi bir prompt örneği ver
    - Toplam puanı hesapla (0-100)
    """
    
    # Değerlendirmeyi yap
    response = model.generate_content(evaluation_prompt)
    
    # Yanıtı işle ve EvaluationResponse nesnesine dönüştür
    # Not: Bu kısım Gemini API'nin yanıt formatına göre düzenlenmelidir
    evaluation = process_gemini_response(response.text)
    
    return evaluation

def process_gemini_response(response: str) -> EvaluationResponse:
    # Bu fonksiyon Gemini API'nin yanıtını işleyip EvaluationResponse nesnesine dönüştürür
    # Şimdilik örnek bir değerlendirme döndürüyoruz
    return EvaluationResponse(
        score=75.0,
        clarity=8.0,
        specificity=7.5,
        goal_alignment=8.0,
        feedback="İyi bir başlangıç, ancak daha spesifik olabilirsiniz.",
        improved_prompt="Daha detaylı ve spesifik bir prompt örneği",
        passed=True
    ) 