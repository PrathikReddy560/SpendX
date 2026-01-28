from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.ai_engine import parse_expense, scan_receipt
import shutil
import os

app = FastAPI()

# 🔥 CRITICAL: Allow your phone to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExpenseText(BaseModel):
    text: str

@app.get("/")
def home():
    return {"status": "Online 🟢", "message": "SpendX Backend is Running"}

@app.post("/parse-text")
def api_parse_text(data: ExpenseText):
    print(f"📩 Received Text: {data.text}")
    return parse_expense(data.text)

@app.post("/scan-bill")
async def api_scan_bill(file: UploadFile = File(...)):
    print(f"📸 Received Image: {file.filename}")
    temp_filename = f"temp_{file.filename}"
    
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = scan_receipt(temp_filename)
        return result
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)