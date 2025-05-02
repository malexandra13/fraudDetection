import pandas as pd
from catboost import Pool
import joblib
test_cases = [
    {"amount": 8500, "balance": 2000, "currency": "USD", "hour": 3, "description": "crypto", "recentTxCount": 7},
    {"amount": 150, "balance": 7000, "currency": "RON", "hour": 14, "description": "bills", "recentTxCount": 1},
    {"amount": 1500, "balance": 7000, "currency": "RON", "hour": 14, "description": "bills", "recentTxCount": 1},
    {"amount": 150, "balance": 700, "currency": "RON", "hour": 12, "description": "bills", "recentTxCount": 1},
    {"amount": 400, "balance": 3500, "currency": "EUR", "hour": 1, "description": "unknown", "recentTxCount": 6},
]
cat_features = ["currency", "description"]
model = joblib.load("fraud_custom_catboost_extended.pkl")
for i, transaction in enumerate(test_cases, 1):
    df = pd.DataFrame([transaction])
    df["currency"] = df["currency"].astype(str)
    df["description"] = df["description"].astype(str)
    pool = Pool(df, cat_features=cat_features)

    pred = model.predict(pool)[0]
    prob = model.predict_proba(pool)[0][1]
    shap_values = model.get_feature_importance(pool, type="ShapValues")
    explanation = sorted(
        [(df.columns[i], round(shap_values[0][i], 3)) for i in range(len(df.columns))],
        key=lambda x: abs(x[1]), reverse=True
    )
    print(f"\n🧪 Test {i}:")
    print(f"Predicție fraudă: {bool(pred)} | Probabilitate: {round(prob, 3)}")
    print(f"Explicație: {explanation}")
