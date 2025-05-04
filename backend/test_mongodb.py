from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
print(f"Trying to connect to: {MONGODB_URI}")

try:
    client = MongoClient(MONGODB_URI)
    db = client.get_database("promptlearn")
    print("Successfully connected to MongoDB!")
    print("Available databases:", client.list_database_names())
except Exception as e:
    print("Error connecting to MongoDB:", str(e)) 