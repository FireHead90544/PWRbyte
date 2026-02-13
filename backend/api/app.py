import pandas as pd
import xgboost as xgb
import shap
import pickle
import json
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# --- 1. Load Artifacts on Startup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
time_model = xgb.Booster()
time_model.load_model('api/models/time_model.json')

cost_model = xgb.Booster()
cost_model.load_model('api/models/cost_model.json')

# Load encoder
with open('api/models/encoder.pkl', 'rb') as f:
    encoder = pickle.load(f)

# Load model features
with open('api/models/model_features.json', 'r') as f:
    model_features = json.load(f)

# Initialize SHAP explainers
time_explainer = shap.TreeExplainer(time_model)
cost_explainer = shap.TreeExplainer(cost_model)

# --- Feature Engineering Functions (from Module B1) ---
def get_geospatial_risk(terrain: str) -> int:
    mapping = {"Hilly": 90, "Forest": 70, "Coastal": 50, "Plains": 20}
    return mapping.get(terrain, 0)

def get_vendor_sentiment(performance: str) -> float:
    mapping = {"Excellent": 1.0, "Good": 0.5, "Average": -0.5, "Poor": -1.0}
    return mapping.get(performance, 0.0)

# --- 2. Define Pydantic Schemas ---
class ProjectInput(BaseModel):
    projectName: str
    projectType: str
    terrain: str
    vendorPerformance: str
    materialAvailability: str

class Hotspot(BaseModel):
    feature: str
    impact: float
    description: str

class HistoricalData(BaseModel):
    overruns: list[int]

class RiskCategory(BaseModel):
    category: str
    percentage: float

class PredictionOutput(BaseModel):
    predictedCostOverrun: float
    predictedTimeOverrun: int
    confidenceScore: float
    hotspots: list[Hotspot]
    historicalData: HistoricalData
    riskCategories: list[RiskCategory]

# --- Helper Functions for New Data Generation ---
def generate_historical_data(project_type: str) -> HistoricalData:
    if project_type == "Underground Cable":
        overruns = [random.randint(45, 150) for _ in range(30)]
    elif project_type == "Overhead Line":
        overruns = [random.randint(20, 90) for _ in range(30)]
    else:  # Substation
        overruns = [random.randint(10, 60) for _ in range(30)]
    return HistoricalData(overruns=overruns)

def categorize_hotspots(hotspots: list[Hotspot]) -> list[RiskCategory]:
    categories = {
        "Geospatial": 0.0,
        "Vendor-Related": 0.0,
        "Supply Chain": 0.0,
        "Execution": 0.0
    }

    positive_hotspots = [h for h in hotspots if h.impact > 0]
    if not positive_hotspots:
        return []

    total_positive_impact = sum(h.impact for h in positive_hotspots)

    for h in positive_hotspots:
        if "Terrain" in h.feature or "Geospatial" in h.feature:
            categories["Geospatial"] += h.impact
        elif "Vendor" in h.feature:
            categories["Vendor-Related"] += h.impact
        elif "Material" in h.feature:
            categories["Supply Chain"] += h.impact
        else:
            categories["Execution"] += h.impact

    risk_categories = []
    for category, impact_sum in categories.items():
        if impact_sum > 0:
            percentage = round((impact_sum / total_positive_impact) * 100, 1)
            risk_categories.append(RiskCategory(category=category, percentage=percentage))

    return risk_categories

# --- 3. Create /predict Endpoint ---
@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: ProjectInput):
    # --- Pre-inference Logic ---
    geospatial_risk = get_geospatial_risk(input_data.terrain)
    vendor_sentiment = get_vendor_sentiment(input_data.vendorPerformance)
    nlp_topic = "Execution"

    input_df = pd.DataFrame({
        'geospatial_risk_score': [geospatial_risk],
        'vendor_sentiment_score': [vendor_sentiment],
        'project_type': [input_data.projectType],
        'nlp_delay_topic': [nlp_topic]
    })

    encoded_cats = encoder.transform(input_df[['project_type', 'nlp_delay_topic']])
    encoded_feature_names = encoder.get_feature_names_out(['project_type', 'nlp_delay_topic'])
    encoded_df = pd.DataFrame(encoded_cats, columns=encoded_feature_names)

    processed_df = pd.concat([input_df[['geospatial_risk_score', 'vendor_sentiment_score']].reset_index(drop=True), encoded_df], axis=1)
    processed_df = processed_df.reindex(columns=model_features, fill_value=0)

    # --- Inference & Explanation ---
    dmatrix = xgb.DMatrix(processed_df)
    predicted_time_overrun = time_model.predict(dmatrix)[0]
    predicted_cost_overrun = cost_model.predict(dmatrix)[0]

    time_shap_values = time_explainer.shap_values(processed_df)
    
    shap_values = time_shap_values[0]
    feature_names = processed_df.columns
    
    shap_series = pd.Series(shap_values, index=feature_names)
    top_features = shap_series.abs().nlargest(5)

    hotspots = []
    for feature, shap_val in top_features.items():
        description_map = {
            "geospatial_risk_score": f"The terrain '{input_data.terrain}' significantly impacts the project timeline due to logistical and construction challenges.",
            "vendor_sentiment_score": f"The vendor's performance level ('{input_data.vendorPerformance}') is a major factor in potential delays or efficiencies.",
            "project_type": f"The nature of a '{input_data.projectType}' project has inherent risks and timelines.",
            "nlp_delay_topic": "The primary source of delay is related to project execution."
        }
        desc_key = next((key for key in description_map if key in feature), "project_type")
        hotspots.append(Hotspot(
            feature=feature.replace("_", " ").title(),
            impact=round(shap_val, 2),
            description=description_map.get(desc_key, "This factor has a notable influence on the project's outcome.")
        ))

    # --- Generate New Data ---
    historical_data = generate_historical_data(input_data.projectType)
    risk_categories = categorize_hotspots(hotspots)

    # Confidence score can be simulated for now
    confidence = 88.7
    final_cost_overrun = round(float(predicted_cost_overrun), 2)
    final_time_overrun = int(round(float(predicted_time_overrun)))


    return PredictionOutput(
        predictedCostOverrun=final_cost_overrun,
        predictedTimeOverrun=final_time_overrun,
        confidenceScore=confidence,
        hotspots=hotspots,
        historicalData=historical_data,
        riskCategories=risk_categories
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)