
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
import pickle
import json

# --- 1. Load Data ---
df = pd.read_csv('data_generation/processed_project_data.csv')

# --- 2. Feature Selection ---
features = [
    'geospatial_risk_score',
    'vendor_sentiment_score',
    'project_type',
    'nlp_delay_topic'
]
categorical_features = ['project_type', 'nlp_delay_topic']
numerical_features = ['geospatial_risk_score', 'vendor_sentiment_score']

X = df[features]
y_time = df['actual_time_overrun_days']
y_cost = df['actual_cost_overrun_pct']

# --- 3. Data Preprocessing ---
# One-Hot Encode categorical features
encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
encoded_cats = encoder.fit_transform(X[categorical_features])

# Get feature names after encoding
encoded_feature_names = encoder.get_feature_names_out(categorical_features)

# Create a DataFrame with the encoded features
encoded_df = pd.DataFrame(encoded_cats, columns=encoded_feature_names)

# Combine numerical features with encoded categorical features
X_processed = pd.concat([X[numerical_features], encoded_df], axis=1)

# Save the final feature names
model_features = X_processed.columns.tolist()
with open('api/models/model_features.json', 'w') as f:
    json.dump(model_features, f)

# Split data
X_train, X_test, y_time_train, y_time_test, y_cost_train, y_cost_test = train_test_split(
    X_processed, y_time, y_cost, test_size=0.2, random_state=42
)

# --- 4. Model Training ---
# Time Model
time_model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, random_state=42)
time_model.fit(X_train, y_time_train)

# Cost Model
cost_model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, random_state=42)
cost_model.fit(X_train, y_cost_train)

# --- 5. Save Artifacts ---
time_model.save_model('api/models/time_model.json')
cost_model.save_model('api/models/cost_model.json')

with open('api/models/encoder.pkl', 'wb') as f:
    pickle.dump(encoder, f)

print("Successfully trained and saved models and artifacts.")

