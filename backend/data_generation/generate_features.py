
import pandas as pd
import numpy as np
import random
from faker import Faker

# Initialize Faker
fake = Faker()

# --- 1. Generate Raw Data ---
num_rows = 1000
project_types = ["Substation", "Overhead Line", "Underground Cable"]
terrains = ["Plains", "Hilly", "Coastal", "Forest"]
vendor_performances = ["Excellent", "Good", "Average", "Poor"]
material_availabilities = ["High", "Medium", "Low"]
delay_reasons = [
    "Unexpected geological conditions delayed foundation work.",
    "Severe weather events led to multiple work stoppages.",
    "Issues with land acquisition and permitting caused significant delays.",
    "Supply chain disruptions for critical components like transformers.",
    "Regulatory hurdles and environmental clearances took longer than expected.",
    "Shortage of skilled labor in the remote project area.",
    "Conflicts with local communities over land use.",
    "Vendor failed to meet quality standards, requiring rework."
]

raw_data = {
    "project_name": [fake.company() + " Project" for _ in range(num_rows)],
    "project_type": [random.choice(project_types) for _ in range(num_rows)],
    "terrain": [random.choice(terrains) for _ in range(num_rows)],
    "vendor_performance": [random.choice(vendor_performances) for _ in range(num_rows)],
    "material_availability": [random.choice(material_availabilities) for _ in range(num_rows)],
    "delay_reason_text": [random.choice(delay_reasons) for _ in range(num_rows)]
}

df = pd.DataFrame(raw_data)

# --- 2. Generate Target Variables ---
def generate_overruns(row):
    time_overrun = 0
    cost_overrun = 0

    # Terrain-based overruns
    if row['terrain'] == "Hilly":
        time_overrun += np.random.randint(60, 120)
        cost_overrun += np.random.uniform(15, 25)
    elif row['terrain'] == "Forest":
        time_overrun += np.random.randint(30, 90)
        cost_overrun += np.random.uniform(10, 20)
    elif row['terrain'] == "Coastal":
        time_overrun += np.random.randint(20, 60)
        cost_overrun += np.random.uniform(5, 15)
    else: # Plains
        time_overrun += np.random.randint(0, 30)
        cost_overrun += np.random.uniform(0, 5)

    # Vendor performance-based overruns
    if row['vendor_performance'] == "Poor":
        time_overrun += np.random.randint(50, 100)
        cost_overrun += np.random.uniform(10, 20)
    elif row['vendor_performance'] == "Average":
        time_overrun += np.random.randint(20, 50)
        cost_overrun += np.random.uniform(5, 10)
    elif row['vendor_performance'] == "Good":
        time_overrun += np.random.randint(0, 20)
        cost_overrun += np.random.uniform(0, 5)

    # Material availability-based overruns
    if row['material_availability'] == "Low":
        time_overrun += np.random.randint(30, 60)
        cost_overrun += np.random.uniform(5, 15)
    elif row['material_availability'] == "Medium":
        time_overrun += np.random.randint(10, 30)
        cost_overrun += np.random.uniform(2, 7)

    return time_overrun, cost_overrun

overruns = df.apply(generate_overruns, axis=1, result_type='expand')
df['actual_time_overrun_days'] = overruns[0]
df['actual_cost_overrun_pct'] = overruns[1]


# --- 3. Implement Feature Engineering Functions ---
def get_geospatial_risk(terrain: str) -> int:
    mapping = {"Hilly": 90, "Forest": 70, "Coastal": 50, "Plains": 20}
    return mapping.get(terrain, 0)

def get_nlp_topic(text: str) -> str:
    if "land" in text.lower() or "permit" in text.lower() or "regulatory" in text.lower() or "communities" in text.lower():
        return "Land_Acquisition"
    elif "supply" in text.lower() or "material" in text.lower() or "components" in text.lower():
        return "Supply_Chain"
    elif "weather" in text.lower() or "geological" in text.lower():
        return "Environmental"
    else:
        return "Execution"

def get_vendor_sentiment(performance: str) -> float:
    mapping = {"Excellent": 1.0, "Good": 0.5, "Average": -0.5, "Poor": -1.0}
    return mapping.get(performance, 0.0)

# --- 4. Process and Save Data ---
df['geospatial_risk_score'] = df['terrain'].apply(get_geospatial_risk)
df['nlp_delay_topic'] = df['delay_reason_text'].apply(get_nlp_topic)
df['vendor_sentiment_score'] = df['vendor_performance'].apply(get_vendor_sentiment)

# Save to CSV
output_path = 'data_generation/processed_project_data.csv'
df.to_csv(output_path, index=False)

print(f"Successfully generated and saved data to {output_path}")
print(df.head())

