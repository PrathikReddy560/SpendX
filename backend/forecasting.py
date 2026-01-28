import pandas as pd
from prophet import Prophet

def predict_future_spend(df):
    """
    Takes the raw expense dataframe, aggregates it by day,
    and predicts the next 30 days of spending.
    """
    # 1. Prepare Data for Prophet
    # Prophet strictly needs two columns: 'ds' (Date) and 'y' (Value)
    df['date'] = pd.to_datetime(df['date'])
    
    # Sum up expenses by day (because you might have 5 transactions in one day)
    daily_spend = df.groupby('date')['amount'].sum().reset_index()
    daily_spend.columns = ['ds', 'y']

    # Safety Check: Need at least a few weeks of data to predict
    if len(daily_spend) < 10:
        return None, "Not enough data to forecast. Add more expenses!"

    # 2. Train the Model
    m = Prophet(yearly_seasonality=False, weekly_seasonality=True)
    m.fit(daily_spend)

    # 3. Predict Future (Next 30 Days)
    future = m.make_future_dataframe(periods=30)
    forecast = m.predict(future)

    # 4. Return just the relevant columns
    # 'ds': date, 'yhat': predicted value, 'yhat_lower'/'upper': uncertainty range
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']], None