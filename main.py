import streamlit as st
from frontend.layout import render_header, render_input_form
from frontend.analytics import render_analytics

# 1. Page Config
st.set_page_config(page_title="SpendX", page_icon="💳", layout="centered")

# 2. Load CSS
try:
    with open('frontend/styles.css') as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
except FileNotFoundError:
    pass # Skip styles if file not found

# 3. Render Components
render_header()
render_input_form()
render_analytics()