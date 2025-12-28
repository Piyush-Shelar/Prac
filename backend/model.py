import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import timedelta
import os


#minimum three records necessary per product
def model(days1,user1):
    filename = f"{user1}_daily_sales.csv"
     
    
    if not os.path.exists(filename):
        return {"error": "User data not found"}

    df = pd.read_csv(filename)
    
    
    
    
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(["product", "date"])

  
    df["day"] = df["date"].dt.day
    df["month"] = df["date"].dt.month
    df["lag_1"] = df.groupby("product")["quantity"].shift(1)

   
    df.dropna(subset=["lag_1"], inplace=True)

    
    models = {}
    last_rows = {}

    for product in df["product"].unique():
        product_df = df[df["product"] == product]

       
        if len(product_df) < 2:
            continue

        X = product_df[["lag_1", "costPerUnit", "day", "month"]]
        y = product_df["quantity"]

        model = LinearRegression()
        model.fit(X, y)

        models[product] = model
        last_rows[product] = product_df.iloc[-1]

   
    if not models:
        print("❌ Not enough data to train models")
        


    n_days = int(days1)

    
    results = {}

    for product, model in models.items():
        total_qty = 0
        total_sales = 0

        last = last_rows[product].copy()
        cost = last["costPerUnit"]

        for _ in range(n_days):
            next_date = last["date"] + timedelta(days=1)

            X_future = pd.DataFrame([{
                "lag_1": last["quantity"],
                "costPerUnit": cost,
                "day": next_date.day,
                "month": next_date.month
            }])

            predicted_qty = max(0, int(model.predict(X_future)[0]))

            total_qty += predicted_qty
            total_sales += predicted_qty * cost

            last["quantity"] = predicted_qty
            last["date"] = next_date

        results[product] = {
            "total_quantity":int( total_qty),
            "total_sales": float(total_sales)
        }
        
    return results

  
