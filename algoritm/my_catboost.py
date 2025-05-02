import pandas as pd
from catboost import CatBoostClassifier, Pool
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import joblib

# Încarcă datele
df = pd.read_csv("fraud_training_extended.csv")

# Pregătire date
X = df.drop(columns=["isFraud"])
y = df["isFraud"]

# Conversii categorice
X["currency"] = X["currency"].astype(str)
X["description"] = X["description"].astype(str)

# Împărțire
X_train, X_test, y_train, y_test = train_test_split(
    X, y, stratify=y, test_size=0.2, random_state=42
)

# Declarăm coloanele categorice
cat_features = ["currency", "description"]

# Construim PooL
train_pool = Pool(X_train, y_train, cat_features=cat_features)
test_pool = Pool(X_test, y_test, cat_features=cat_features)

# Model
model = CatBoostClassifier(
    iterations=500,
    learning_rate=0.1,
    depth=6,
    eval_metric="AUC",
    scale_pos_weight=4,  # clase dezechilibrate
    verbose=100,
    random_state=42
)

# Antrenare
model.fit(train_pool, eval_set=test_pool)

# Evaluare
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\n📊 Classification report:")
print(classification_report(y_test, y_pred))

roc_auc = roc_auc_score(y_test, y_prob)
print(f"\n🎯 ROC AUC: {roc_auc:.4f}")

# Salvează modelul
joblib.dump(model, "fraud_custom_catboost_extended.pkl")
