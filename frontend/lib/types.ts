// TypeScript types matching the backend API contract

export interface ProjectInput {
  projectName: string
  projectType: "Transmission" | "Substation" | "Distribution"
  terrain: "Hilly" | "Plains" | "Coastal" | "Desert"
  vendorPerformance: "Excellent" | "Good" | "Average" | "Poor"
  materialAvailability: "High" | "Medium" | "Low"
}

export interface Hotspot {
  feature: string
  impact: number
  description: string
}

export interface HistoricalData {
  overruns: number[]
}

export interface RiskCategory {
  category: string
  percentage: number
}

export interface PredictionOutput {
  predictedTimeOverrun: number
  predictedCostOverrun: number
  confidenceScore: number
  hotspots: Hotspot[]
  historicalData: HistoricalData
  riskCategories: RiskCategory[]
}
