"use client"

import { useState } from "react"
import { PredictionForm } from "@/components/prediction-form"
import { ResultsDisplay } from "@/components/results-display"
import type { ProjectInput, PredictionOutput } from "@/lib/types"
import { predictProjectRisk } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Zap } from "lucide-react"

export default function Home() {
  const [predictionData, setPredictionData] = useState<PredictionOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [originalFormData, setOriginalFormData] = useState<ProjectInput | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (formData: ProjectInput) => {
    setIsLoading(true)
    setPredictionData(null)
    setOriginalFormData(formData)

    try {
      const result = await predictProjectRisk(formData)
      setPredictionData(result)
      toast({
        title: "Analysis Complete",
        description: "Project risk prediction generated successfully.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze project"
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Prediction error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 backdrop-blur">
        <div className="container mx-auto flex flex-col items-center px-4 py-6"> {/* Added flex-col and items-center */}
          <img src="/logo.png" alt="PWRbyte Logo" className="h-16" /> {/* Adjust height (h-16) and margin-bottom (mb-2) as needed */}
          <p className="text-sm text-zinc-400">by That1Bit</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <ResultsDisplay
              predictionData={predictionData}
              isLoading={isLoading}
              originalFormData={originalFormData}
              onReanalyze={handleSubmit}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-zinc-400">
          &copy; Rudransh Joshi | That1Bit • Smart India Hackathon (PS 25192)
        </div>
      </footer>
    </div>
  )
}
