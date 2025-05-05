import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# List models
models = genai.list_models()
print("Available models:")
for model in models:
    print(model)

model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
