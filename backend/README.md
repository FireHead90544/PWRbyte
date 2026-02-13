# PWRbyte Backend

> **AI-Powered Project Risk Prediction Engine**  
> Machine learning backend for predicting POWERGRID project cost and timeline overruns with explainable AI.

---

## 🎯 Overview

The PWRbyte backend is the intelligence core of the project, built for **Smart India Hackathon 2025** (PS25192). It provides ML-powered predictions for infrastructure project risks and explains them through SHAP-based hotspot analysis.

### Key Features

- 🔮 **Dual Prediction Models**: Separate XGBoost regressors for cost and time overruns
- 🎯 **Hotspot Identification**: SHAP-based explainability to identify risk factors
- 📊 **Synthetic Data Generation**: Realistic POWERGRID project simulation
- ⚡ **FastAPI Service**: High-performance REST API with CORS support
- 🔍 **Feature Engineering**: Geospatial, vendor sentiment, and NLP-based features

---

## 🏗️ Architecture

The backend is organized into three interconnected modules:

```
backend/
├── data_generation/          # Module B1: Data Warehousing
│   ├── generate_features.py  # Synthetic data generation
│   └── processed_project_data.csv
├── training/                 # Module B2: ML Core
│   └── train.py              # Model training pipeline
└── api/                      # Module B3: Serving Layer
    ├── app.py                # FastAPI application
    ├── requirements.txt      # Python dependencies
    └── models/               # Trained artifacts
        ├── time_model.json
        ├── cost_model.json
        ├── encoder.pkl
        └── model_features.json
```

### Module B1: Data Generation

Generates 1000 realistic POWERGRID project records with:
- **Raw Features**: Project type, terrain, vendor performance, material availability
- **Engineered Features**: Geospatial risk scores, NLP delay topics, vendor sentiment
- **Target Variables**: Actual time/cost overruns based on realistic business logic

### Module B2: ML Training

Trains XGBoost regression models:
- **Feature Selection**: Geospatial risk, vendor sentiment, project type, delay topics
- **Preprocessing**: One-hot encoding for categorical features
- **Models**: Separate regressors for time and cost predictions
- **Artifacts**: Saved models (JSON), encoder (pickle), feature names (JSON)

### Module B3: API Serving

FastAPI application exposing predictions:
- **Endpoint**: `POST /predict`
- **Processing**: Feature engineering → encoding → inference → SHAP explanation
- **Response**: Predictions + top 5 hotspots with impact scores

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **API Framework** | FastAPI with Uvicorn |
| **ML Library** | XGBoost 2.x |
| **Explainability** | SHAP (TreeExplainer) |
| **Data Processing** | Pandas, NumPy |
| **Data Generation** | Faker library |
| **Serialization** | Pickle, JSON |

---

## 🚀 Setup Instructions

### Prerequisites

- Python 3.9+ (developed with Python 3.13)
- `uv` package manager (recommended) or `pip`

### Installation

#### Option 1: Using `uv` (Recommended)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
uv venv

# Activate virtual environment
source .venv/bin/activate  # On Linux/macOS
# or
.venv\Scripts\activate     # On Windows

# Install dependencies
uv pip install fastapi "uvicorn[standard]" pydantic pandas scikit-learn xgboost shap faker
```

#### Option 2: Using `pip`

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# or .venv\Scripts\activate on Windows

pip install -r api/requirements.txt faker scikit-learn
```

### Generate Training Data

```bash
# From backend directory with activated venv
python data_generation/generate_features.py
```

**Output**: Creates `data_generation/processed_project_data.csv` with 1000 synthetic project records.

### Train ML Models

```bash
python training/train.py
```

**Output**: Saves trained models and artifacts to `api/models/`:
- `time_model.json` - XGBoost time overrun predictor
- `cost_model.json` - XGBoost cost overrun predictor  
- `encoder.pkl` - Fitted one-hot encoder
- `model_features.json` - Feature names for inference

### Run API Server

```bash
# Development server
cd api
uvicorn app:app --reload

# Production server (from backend root)
cd api
uvicorn app:app --host 0.0.0.0 --port 8000
```

**API Base URL**: http://127.0.0.1:8000

---

## 📡 API Documentation

### `POST /predict`

Predicts project cost and time overruns with explainable hotspots.

#### Request Schema

```json
{
  "projectName": "Mumbai Grid Expansion",
  "projectType": "Substation",
  "terrain": "Hilly",
  "vendorPerformance": "Poor",
  "materialAvailability": "Low"
}
```

**Field Specifications**:
- `projectName`: String - Project identifier
- `projectType`: Enum - `"Substation"`, `"Overhead Line"`, `"Underground Cable"`
- `terrain`: Enum - `"Plains"`, `"Hilly"`, `"Coastal"`, `"Forest"`
- `vendorPerformance`: Enum - `"Excellent"`, `"Good"`, `"Average"`, `"Poor"`
- `materialAvailability`: Enum - `"High"`, `"Medium"`, `"Low"`

#### Response Schema

```json
{
  "predictedCostOverrun": 19.5,
  "predictedTimeOverrun": 95,
  "confidenceScore": 88.7,
  "hotspots": [
    {
      "feature": "Geospatial Risk Score",
      "impact": 40.2,
      "description": "The terrain 'Hilly' significantly impacts the project timeline..."
    }
  ],
  "historicalData": {
    "overruns": [45, 67, 89, ...]
  },
  "riskCategories": [
    {
      "category": "Geospatial",
      "percentage": 45.3
    }
  ]
}
```

#### Example cURL Request

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Test Project",
    "projectType": "Substation",
    "terrain": "Hilly",
    "vendorPerformance": "Poor",
    "materialAvailability": "Low"
  }'
```

---

## 🧠 ML Pipeline Details

### Feature Engineering

The system transforms raw inputs into ML-ready features:

```python
# Geospatial Risk Mapping
{"Hilly": 90, "Forest": 70, "Coastal": 50, "Plains": 20}

# Vendor Sentiment Scoring
{"Excellent": 1.0, "Good": 0.5, "Average": -0.5, "Poor": -1.0}

# NLP Delay Topic Classification
Text → ["Land_Acquisition", "Supply_Chain", "Environmental", "Execution"]
```

### Model Training

- **Algorithm**: XGBoost Regressor (`reg:squarederror`)
- **Estimators**: 100 trees
- **Features**: 2 numerical (risk score, sentiment) + one-hot encoded categoricals
- **Train/Test Split**: 80/20
- **Targets**: Time overrun (days), Cost overrun (%)

### SHAP Explainability

Each prediction includes:
- Top 5 features by absolute SHAP value
- Impact magnitude (positive/negative contribution)
- Human-readable descriptions linking features to risk factors

---

## 🔄 Development Workflow

### Regenerate Data

```bash
python data_generation/generate_features.py
```

### Retrain Models

```bash
python training/train.py
```

### Test API Locally

```bash
cd api
uvicorn app:app --reload
# Visit http://127.0.0.1:8000/docs for Swagger UI
```

---

## 📦 Deployment

The demo backend is deployed on **Render**: https://notpwrbyteapi.onrender.com

To deploy your own instance:
1. Ensure models are pre-trained (include `api/models/` in deployment)
2. Set environment variables if needed
3. Use `uvicorn app:app --host 0.0.0.0 --port $PORT`

---

## 🤝 Contributing

This project was built for **Smart India Hackathon 2025** by **Team That1Bit**.


### Problem Statement
**PS25192**: Predicting Project Costs and Timeline for POWERGRID

---

## 📄 License

Built for Smart India Hackathon 2025 • Ministry of Power • POWERGRID Corporation of India Limited

---

## 🔗 Related Documentation

- [Frontend README](../frontend/README.md)
- [Main Project README](../README.md)
