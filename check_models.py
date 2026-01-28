import google.generativeai as genai

# PASTE YOUR ACTUAL KEY HERE inside the quotes
api_key = "AIzaSyBMgM5XQDOtkqE57VLwVWolfZNd7B_qZJ8" 

genai.configure(api_key=api_key)

print("🔍 Checking available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Available: {m.name}")
except Exception as e:
    print(f"❌ Error: {e}")