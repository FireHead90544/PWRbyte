# PWRbyte

<div align="center">

![PWRbyte Logo](https://raw.githubusercontent.com/FireHead90544/PWRbyte/main/frontend/public/logo.png)

**AI-Powered Decision Support System For Project Risk Prediction**

[Live Demo](https://pwrbyte.vercel.app/) • [Video Presentation](https://www.youtube.com/watch?v=EpEy6MQPAgs) • [API Endpoint](https://notpwrbyteapi.onrender.com/)

</div>

---

## 🎯 Problem Statement

**PS25192: Predicting Project Costs and Timeline**

**Organization**: Ministry of Power (MoP) | **Department**: Power Grid Corporation of India Limited  
**Category**: Software | **Theme**: Smart Automation

### Background

POWERGRID executes a huge number of infrastructure projects across India. These projects are of **national importance**, and delays in completion must be avoided. However, projects often face:

- **Cost escalations** due to unforeseen factors
- **Timeline overruns** from regulatory, environmental, and logistical challenges
- **Lack of predictive insights** to identify risk hotspots before they materialize

### Challenge

POWERGRID requires a system to:
- Predict cost and timeline overruns **before they occur**
- Identify **key risk factors (hotspots)** that need attention
- Provide **explainable insights** for decision-making

### Key Data Points

The system analyzes:
- 📍 **Project type** (substation, overhead line, underground cable)
- 🌍 **Terrain and environmental factors** (hilly, coastal, forest, plains)
- 💰 **Material and labor costs**
- 📋 **Regulatory and permitting timelines**
- 🚧 **Historical delay patterns** and hindrances
- 🌦️ **Weather and seasonal data**
- 🤝 **Vendor performance metrics**
- 📊 **Demand-supply scenario impact**

---

## 💡 Our Solution: PWRbyte

PWRbyte is an **AI-powered risk prediction engine** that not only forecasts project overruns but also **explains why** they happen. The system combines:

1. ✅ **Machine Learning Models** (XGBoost regressors for cost and time predictions)
2. ✅ **Explainable AI** (SHAP-based hotspot identification)
3. ✅ **Modern Web Interface** (Real-time predictions with interactive visualizations)
4. ✅ **Synthetic Data Generation** (Realistic POWERGRID project simulation)

### Why PWRbyte?

| Feature | Description |
|---------|-------------|
| 🔮 **Dual Predictions** | Separate models for cost overruns (%) and time overruns (days) |
| 🎯 **Hotspot Analysis** | Top 5 risk factors with impact scores using SHAP values |
| 📊 **Historical Context** | Distribution charts of past project overruns by type |
| 🔄 **What-If Scenarios** | Mitigation modeling to explore risk reduction strategies |
| ⚡ **Fast \u0026 Scalable** | FastAPI backend + Next.js frontend deployed on cloud |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PWRbyte System                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐   │
│  │   Frontend   │◄────►│   Backend    │◄────►│  ML Models   │   │
│  │  (Next.js)   │      │  (FastAPI)   │      │  (XGBoost)   │   │
│  └──────────────┘      └──────────────┘      └──────────────┘   │
│                                                                 │
│  User Interface       REST API                Prediction Core   │
│  • Input form         • /predict endpoint     • Time model      │
│  • Visualizations     • CORS enabled          • Cost model      │
│  • Hotspot charts     • SHAP integration      • SHAP explainer  │
│  • Risk dashboard     • Feature engineering   • Feature encoder │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### System Flow

1. **User Input** → Project parameters (type, terrain, vendor, materials)
2. **Feature Engineering** → Geospatial risk scoring, sentiment analysis, NLP topics
3. **ML Inference** → XGBoost predicts cost/time overruns
4. **SHAP Explanation** → Identifies top contributing features
5. **Visualization** → Interactive charts and risk categorization
6. **Decision Support** → Actionable insights for project managers

---

## 🛠️ Technology Stack

This project is entirely vibe-coded for rapid prototyping using Gemini-CLI with the below technology stack. With the entire system instructions being written explicitly by hand.

### Backend
- **Framework**: FastAPI with Uvicorn
- **ML Library**: XGBoost 2.x
- **Explainability**: SHAP (TreeExplainer)
- **Data Processing**: Pandas, NumPy, Scikit-learn
- **Data Generation**: Faker library

### Frontend
- **Framework**: Next.js 14 with React 19
- **Language**: TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts + Plotly.js
- **Forms**: React Hook Form + Zod validation

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git

---

## 📂 Project Structure

```
PWRbyte_prototype/
│
├── backend/                      # Python ML Backend
│   ├── data_generation/          # Synthetic data creation
│   │   ├── generate_features.py  # Data simulation script
│   │   └── processed_project_data.csv
│   ├── training/                 # Model training
│   │   └── train.py              # XGBoost training pipeline
│   ├── api/                      # FastAPI application
│   │   ├── app.py                # Main API server
│   │   ├── requirements.txt      # Python dependencies
│   │   └── models/               # Trained artifacts
│   │       ├── time_model.json
│   │       ├── cost_model.json
│   │       ├── encoder.pkl
│   │       └── model_features.json
│   └── README.md                 # Backend documentation
│
├── frontend/                     # Next.js Web App
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # React components
│   │   ├── prediction-form.tsx
│   │   ├── results-display.tsx
│   │   ├── hotspot-chart.tsx
│   │   └── ui/                   # shadcn components
│   ├── lib/                      # API client & utilities
│   │   ├── api.ts
│   │   └── types.ts
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── README.md                 # Frontend documentation
│
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Backend**: Python 3.9+ (with `uv` or `pip`)
- **Frontend**: Node.js 18+ (with `pnpm`/`npm`)

### 1️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install fastapi "uvicorn[standard]" pydantic pandas scikit-learn xgboost shap faker

# Generate synthetic training data
python data_generation/generate_features.py

# Train ML models
python training/train.py

# Start API server
cd api
uvicorn app:app --reload
```

**API will be available at**: http://127.0.0.1:8000

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install  # or: npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local: set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Start development server
pnpm dev  # or: npm run dev
```

**Web app will be available at**: http://localhost:3000

### 3️⃣ Usage

1. Open http://localhost:3000 in your browser
2. Fill in project details:
   - **Project Name**: Any identifier
   - **Project Type**: Substation, Overhead Line, or Underground Cable
   - **Terrain**: Plains, Hilly, Coastal, or Forest
   - **Vendor Performance**: Excellent, Good, Average, or Poor
   - **Material Availability**: High, Medium, or Low
3. Click **Analyze Project Risk**
4. View predictions, hotspots, historical trends, and mitigation scenarios

---

## 📊 Key Features

### 1. Predictive Analytics

- **Cost Overrun Prediction**: Percentage increase over budget
- **Time Overrun Prediction**: Days of delay beyond planned timeline
- **Confidence Score**: Model certainty in predictions

### 2. Explainable AI (Hotspots)

SHAP-based feature importance showing:
- **Geospatial Risk**: Impact of terrain on project complexity
- **Vendor Performance**: Historical vendor reliability scores
- **Material Availability**: Supply chain risk indicators
- **Project Type**: Inherent complexity of infrastructure category

### 3. Historical Context

Distribution charts showing:
- Past project overrun patterns by type
- Current prediction relative to historical data
- Risk severity assessment

### 4. Risk Categorization

Breakdown of risk factors into:
- **Geospatial** (terrain, location challenges)
- **Vendor-Related** (contractor performance)
- **Supply Chain** (material availability)
- **Execution** (project management factors)

### 5. Mitigation Scenarios

What-if analysis for:
- Improved vendor selection
- Better material procurement
- Alternative project approaches

---

## 🌐 (Demo) Live Deployment

| Component | URL | Status |
|-----------|-----|--------|
| **Web Application** | https://pwrbyte.vercel.app | ✅ Live |
| **API Backend** | https://notpwrbyteapi.onrender.com | ✅ Live |
| **Video Presentation** | https://www.youtube.com/watch?v=EpEy6MQPAgs | ✅ Available |

---

## 📖 Documentation

- **[Backend Documentation](https://github.com/FireHead90544/PWRbyte/tree/main/backend/README.md)**: ML pipeline, API specs, deployment guide
- **[Frontend Documentation](https://github.com/FireHead90544/PWRbyte/tree/main/frontend/README.md)**: Component architecture, setup, styling guide

---

## 🧠 Machine Learning Details

### Data Generation

- **Dataset Size**: 1000 synthetic POWERGRID project records
- **Features**: 10+ engineered features (geospatial risk, vendor sentiment, NLP topics)
- **Targets**: Time overrun (days), Cost overrun (%)
- **Realism**: Overruns generated based on realistic business logic

### Model Training

- **Algorithm**: XGBoost Gradient Boosting
- **Type**: Regression (separate models for time and cost)
- **Features**: 2 numerical + one-hot encoded categoricals
- **Validation**: Train/test split (80/20)

### Explainability

- **Method**: SHAP (SHapley Additive exPlanations)
- **Output**: Top 5 features by absolute SHAP value
- **Interpretation**: Positive/negative contributions to prediction

---

## 🏆 Hackathon Details

**Event**: Smart India Hackathon 2025  
**Problem Statement**: PS25192 - Predicting Project Costs and Timeline  
**Organization**: Ministry of Power (MoP)  
**Department**: Power Grid Corporation of India Limited  
**Category**: Software  
**Theme**: Smart Automation

---

## 📄 License

This project is licensed under GNU GPL v3, license can be found in the [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

Even though these authorities pretty much suck (very badly) at evaluating hackathon projects, acknowledging them for creating opportunity to innovate is still acceptable.

- **POWERGRID Corporation of India** for the problem statement
- **Ministry of Power (MoP)** for organizing SIH 2025
- **Smart India Hackathon** for the opportunity to innovate (More like, Scam-a-thon xD)

---

<div align="center">

**Built with ❤️ for a Smarter, More Reliable Power Grid**

*PWRbyte - Powering Predictions, Preventing Delays*

</div>
