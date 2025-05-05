from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
print("Looking for .env at:", env_path)
print("Exists?", os.path.exists(env_path))
load_dotenv(env_path)
print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="PromptCraft API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API rotalarını ekle
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 