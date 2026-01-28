import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from backend.database import fetch_all_expenses
from backend.forecasting import predict_future_spend
from backend.ai_engine import generate_budget_advice # Import the new AI Advisor

def render_analytics():
    st.divider()
    st.write("### 📊 Spending Analytics")
    
    df = fetch_all_expenses()
    if df.empty:
        st.info("No data yet.")
        return

    # --- PART 1: The Prediction Graph ---
    st.subheader("🔮 Next Month Forecast")
    
    with st.spinner("Crunching numbers..."):
        forecast_df, error = predict_future_spend(df)
    
    if error:
        st.warning(error)
    else:
        # Create a cool Plotly Graph
        fig = go.Figure()

        # 1. Plot Historical Data (Green)
        # We aggregate by day for the graph
        daily_actual = df.groupby('date')['amount'].sum().reset_index()
        fig.add_trace(go.Scatter(
            x=daily_actual['date'], 
            y=daily_actual['amount'], 
            mode='lines+markers', 
            name='Actual Spend',
            line=dict(color='#00CC96')
        ))

        # 2. Plot Forecast (Red Dashed)
        # Filter for future dates only
        last_real_date = pd.to_datetime(daily_actual['date'].max())
        future_only = forecast_df[forecast_df['ds'] > last_real_date]
        
        fig.add_trace(go.Scatter(
            x=future_only['ds'], 
            y=future_only['yhat'], 
            mode='lines', 
            name='AI Prediction',
            line=dict(color='#EF553B', dash='dash')
        ))

        fig.update_layout(title="Spending Trend", xaxis_title="Date", yaxis_title="Amount (₹)")
        st.plotly_chart(fig, use_container_width=True)

        # --- PART 2: The Gemini Insight Card ---
        # Calculate totals for the AI
        last_30_days_total = df['amount'].sum() # Simplified for hackathon
        predicted_total = future_only['yhat'].sum()
        
        st.write("#### 🤖 AI Financial Advisor")
        
        # Call Gemini to analyze the numbers
        if st.button("Generate Insight"):
            with st.spinner("Consulting Gemini..."):
                advice = generate_budget_advice(int(last_30_days_total), int(predicted_total))
                
                # Display nicely
                st.info(f"**Projection:** You are on track to spend **₹{predicted_total:,.0f}** next month.\n\n**Advice:** {advice}")

    # --- PART 3: Standard Stats ---
    st.divider()
    col1, col2 = st.columns(2)
    col1.metric("Total Spent (All Time)", f"₹{df['amount'].sum():,.0f}")
    col2.metric("Transactions", len(df))