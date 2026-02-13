"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { PredictionOutput, ProjectInput } from "@/lib/types"
import { HotspotChart } from "./hotspot-chart"
import { HistoricalDistributionChart } from "./historical-distribution-chart"
import { RiskCategoryDonut } from "./risk-category-donut"
import { MitigationScenarios } from "./mitigation-scenarios"
import { AlertTriangle, TrendingUp, Target, BarChart3 } from "lucide-react"

interface ResultsDisplayProps {
  predictionData: PredictionOutput | null
  isLoading: boolean
  originalFormData: ProjectInput | null
  onReanalyze: (modifiedData: ProjectInput) => void
}

export function ResultsDisplay({ predictionData, isLoading, originalFormData, onReanalyze }: ResultsDisplayProps) {
  const kpiRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (predictionData) {
      kpiRefs.current.forEach((ref) => {
        if (ref) {
          ref.classList.add("animate-pulse-border")
          setTimeout(() => {
            ref.classList.remove("animate-pulse-border")
          }, 1000)
        }
      })
    }
  }, [predictionData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-zinc-800 bg-card/50">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-24 mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-zinc-800 bg-card/50">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!predictionData) {
    return (
      <Card className="border-zinc-800 bg-card/50 backdrop-blur">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Enter project details in the form and click "Analyze Project Risk" to see predictions and risk analysis.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { predictedTimeOverrun, predictedCostOverrun, confidenceScore, hotspots, historicalData, riskCategories } =
    predictionData

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          ref={(el) => {
            kpiRefs.current[0] = el
          }}
          className="border-zinc-800 bg-card/50 backdrop-blur transition-all"
        >
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Time Overrun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">+{predictedTimeOverrun.toFixed(0)} Days</div>
            <p className="text-xs text-muted-foreground mt-2">Predicted delay from baseline</p>
          </CardContent>
        </Card>

        <Card
          ref={(el) => {
            kpiRefs.current[1] = el
          }}
          className="border-zinc-800 bg-card/50 backdrop-blur transition-all"
        >
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Cost Overrun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">+{predictedCostOverrun.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">Predicted budget increase</p>
          </CardContent>
        </Card>

        <Card
          ref={(el) => {
            kpiRefs.current[2] = el
          }}
          className="border-zinc-800 bg-card/50 backdrop-blur transition-all"
        >
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4" />
              Confidence Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{confidenceScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">Model certainty</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hotspot Analysis Chart */}
        <Card className="border-zinc-800 bg-card/50 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Risk Hotspot Analysis
            </CardTitle>
            <CardDescription>Key factors impacting project timeline (hover for details)</CardDescription>
          </CardHeader>
          <CardContent>
            {hotspots.length > 0 ? (
              <HotspotChart hotspots={hotspots} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">No hotspots identified</div>
            )}
          </CardContent>
        </Card>

        {/* Historical Distribution Chart */}
        {historicalData && historicalData.overruns.length > 0 && (
          <Card className="border-zinc-800 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Historical Context</CardTitle>
              <CardDescription>Compare current prediction with historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoricalDistributionChart
                historicalData={historicalData}
                currentPrediction={predictedTimeOverrun}
                projectType={originalFormData?.projectType || "Project"}
              />
            </CardContent>
          </Card>
        )}

        {/* Risk Category Donut */}
        {riskCategories && riskCategories.length > 0 && (
          <Card className="border-zinc-800 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Risk Categories</CardTitle>
              <CardDescription>Distribution of risk factors by category</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskCategoryDonut riskCategories={riskCategories} />
            </CardContent>
          </Card>
        )}

        {/* Mitigation Scenarios */}
        {originalFormData && (
          <div className="lg:col-span-2">
            <MitigationScenarios originalFormData={originalFormData} onReanalyze={onReanalyze} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  )
}
