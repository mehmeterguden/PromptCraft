import os
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from models.schemas import PromptRequest, EvaluationResponse
from services.evaluator import evaluate_prompt

load_dotenv()

router = APIRouter()

# Set up Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_prompt_endpoint(request: PromptRequest):
    try:
        evaluation = await evaluate_prompt(request.prompt, request.task_id)
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hello")
async def say_hello():
    return {"message": "Hello from FastAPI!"}

@router.get("/question")
async def get_question():
    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content("Generate a new quiz question for a coding challenge.")
        return {"question": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hint")
async def get_hint():
    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content("Give a helpful hint for a coding challenge.")
        return {"hint": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/next")
async def next_question():
    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content("Generate the next quiz question for a coding challenge.")
        return {"next_question": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 