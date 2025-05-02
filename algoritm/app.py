from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("fraud_custom_catboost_extended.pkl")

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        response = jsonify({"status": "OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    data = request.json
    data = data.get('predict', data)  # dacă e împachetat
    df = pd.DataFrame([data])

    print(data)
    print(df)
    df['currency'] = df['currency'].astype(str)
    df["description"] = df["description"].astype(str)

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]

    from catboost import Pool

    # ... după ce ai încărcat modelul și ai pregătit `df`
    cat_features = ["currency", "description"]  # cele declarate la antrenare
    pool = Pool(df, cat_features=cat_features)

    shap_values = model.get_feature_importance(pool, type="ShapValues")
    columns = df.columns.tolist()

    # extrage SHAP pentru prima observație (0)
    explanation = sorted(
        [(columns[i], round(shap_values[0][i], 3)) for i in range(len(columns))],
        key=lambda x: abs(x[1]), reverse=True
    )

    return jsonify({
        "isFraud": bool(prediction),
        "fraudProbability": round(probability, 3),
        "explanation": explanation
    })


if __name__ == "__main__":
    app.run(port=8081)
