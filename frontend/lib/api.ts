import type { ProjectInput, PredictionOutput } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export async function predictProjectRisk(projectData: ProjectInput): Promise<PredictionOutput> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`)
    }

    const data: PredictionOutput = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch prediction: ${error.message}`)
    }
    throw new Error("An unexpected error occurred")
  }
}
