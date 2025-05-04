from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth

app = FastAPI(title="PromptLearn Auth API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend'in adresi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route'ları ekle
app.include_router(auth.router, prefix="/auth", tags=["authentication"])

@app.get("/")
async def root():
    return {"message": "PromptLearn Auth API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 