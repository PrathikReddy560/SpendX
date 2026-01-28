import streamlit as st
from datetime import date
from backend.database import insert_expense
# Make sure your backend/ai_engine.py has both functions!
from backend.ai_engine import parse_expense, scan_receipt

def render_header():
    """
    Renders the top header and description.
    This was missing in your file!
    """
    st.title("💳 SpendX")
    st.markdown("Your **AI-powered** financial assistant. Track, Predict, Survive.")

def render_input_form():
    """
    Renders the input form with 3 tabs: AI Text, Scan, and Manual.
    """
    with st.container():
        st.write("### 📝 Add New Expense")
        
        # Define the tabs
        tab1, tab2, tab3 = st.tabs(["✨ AI Text", "📸 Scan Bill", "✍️ Manual"])
        
        # --- TAB 1: AI TEXT PARSER ---
        with tab1:
            with st.form("ai_form", clear_on_submit=True):
                raw_text = st.text_input("Tell me what you spent:", placeholder="e.g., 'Lunch with team 450'")
                submitted_ai = st.form_submit_button("✨ Process with Gemini")
                
                if submitted_ai and raw_text:
                    with st.spinner("Gemini is thinking..."):
                        data = parse_expense(raw_text)
                        
                        if data and data['amount'] > 0:
                            insert_expense(date.today(), data['category'], data['amount'], data['description'])
                            st.success(f"✅ Saved! {data['description']} ({data['category']}) - ₹{data['amount']}")
                            st.balloons()
                        else:
                            st.error("Could not understand the amount. Try 'Burger 200'.")

        # --- TAB 2: RECEIPT SCANNER ---
        with tab2:
            st.write("Upload a bill image")
            uploaded_file = st.file_uploader("Choose Image", type=["jpg", "png", "jpeg"])
            
            if uploaded_file is not None:
                st.image(uploaded_file, caption="Uploaded Receipt", width=200)
                
                if st.button("🚀 Analyze Receipt"):
                    with st.spinner("Gemini is reading your bill..."):
                        data = scan_receipt(uploaded_file)
                        
                        if data and data['amount'] > 0:
                            insert_expense(date.today(), data['category'], data['amount'], data['description'])
                            st.success(f"✅ Extracted: {data['description']} - ₹{data['amount']}")
                            st.balloons()
                        else:
                            st.error("Could not read the bill. Try a clearer image.")

        # --- TAB 3: MANUAL ENTRY ---
        with tab3:
            with st.form("manual_form", clear_on_submit=True):
                desc = st.text_input("Description")
                amt = st.number_input("Amount", min_value=0.0)
                cat = st.selectbox("Category", ["Food", "Travel", "Grocery", "Shopping", "Bills", "Health", "Other"])
                d = st.date_input("Date", value=date.today())
                
                if st.form_submit_button("Save"):
                    if amt > 0:
                        insert_expense(d, cat, amt, desc)
                        st.success("Saved manually!")
                    else:
                        st.error("Amount must be greater than 0")