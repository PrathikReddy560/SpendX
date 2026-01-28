import google.generativeai as genai
import json
import os
import re
import PIL.Image
from dotenv import load_dotenv

# 1. Setup
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ ERROR: Key missing in .env file")
else:
    genai.configure(api_key=api_key)

# 2. Text Logic
def parse_expense(user_input):
    try:
        model = genai.GenerativeModel('gemini-3-flash-preview')
        prompt = f"""
        Extract expense data from: "{user_input}"
        Context: User is in Bangalore, India.
        Return ONLY JSON with keys: "amount" (number), "category" (String), "description" (String).
        """
        response = model.generate_content(prompt)
        clean_text = re.sub(r"```json|```", "", response.text).strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"AI Error: {e}")
        return {"amount": 0, "category": "Other", "description": "Error parsing"}

# 3. Vision Logic
def scan_receipt(image_path):
    try:
        img = PIL.Image.open(image_path)
        model = genai.GenerativeModel('gemini-3-flash-preview')
        prompt = """
        Analyze this receipt. Extract:
        - "amount": (number) Total Grand Total.
        - "category": (String) Category.
        - "description": (String) Merchant name.
        Return ONLY valid JSON.
        """
        response = model.generate_content([prompt, img])
        clean_text = re.sub(r"```json|```", "", response.text).strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Vision Error: {e}")
        return {"amount": 0, "category": "Error", "description": "Could not read"}