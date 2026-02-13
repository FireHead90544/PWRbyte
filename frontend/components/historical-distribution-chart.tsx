"use client"

import dynamic from "next/dynamic"
import type { HistoricalData } from "@/lib/types"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface HistoricalDistributionChartProps {
  historicalData: HistoricalData
  currentPrediction: number
  projectType: string
}

export function HistoricalDistributionChart({
  historicalData,
  currentPrediction,
  projectType,
}: HistoricalDistributionChartProps) {
  const overruns = historicalData.overruns

  const median = [...overruns].sort((a, b) => a - b)[Math.floor(overruns.length / 2)]
  const max = Math.max(...overruns)

  const data: any[] = [
    {
      type: "box",
      y: overruns,
      name: "Historical",
      marker: {
        color: "rgba(100, 149, 237, 0.7)",
      },
      boxmean: "sd",
    },
  ]

  const layout = {
    template: "plotly_dark",
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    title: {
      text: `Historical Overrun for ${projectType}`,
      font: { size: 16, color: "rgb(229, 231, 235)" },
    },
    yaxis: {
      title: "Time Overrun (Days)",
      gridcolor: "rgba(255,255,255,0.1)",
    },
    xaxis: {
      gridcolor: "rgba(255,255,255,0.1)",
    },
    shapes: [
      {
        type: "line",
        x0: -0.5,
        x1: 0.5,
        y0: currentPrediction,
        y1: currentPrediction,
        line: {
          color: "rgb(239, 68, 68)",
          width: 3,
          dash: "dash",
        },
      },
    ],
    annotations: [
      {
        x: 0.5,
        y: currentPrediction,
        xref: "x",
        yref: "y",
        text: `Current: ${currentPrediction.toFixed(0)} days`,
        showarrow: true,
        arrowhead: 2,
        ax: 40,
        ay: -40,
        font: { color: "rgb(239, 68, 68)", size: 12 },
        bgcolor: "rgba(0,0,0,0.7)",
        bordercolor: "rgb(239, 68, 68)",
        borderwidth: 1,
      },
      {
        x: 0,
        y: median,
        xref: "x",
        yref: "y",
        text: `Median: ${median.toFixed(0)}`,
        showarrow: false,
        font: { color: "rgb(229, 231, 235)", size: 10 },
        xanchor: "right",
        xshift: -10,
      },
      {
        x: 0,
        y: max,
        xref: "x",
        yref: "y",
        text: `Max: ${max.toFixed(0)}`,
        showarrow: false,
        font: { color: "rgb(229, 231, 235)", size: 10 },
        xanchor: "right",
        xshift: -10,
      },
    ],
    font: {
      family: "var(--font-sans), sans-serif",
      color: "rgb(229, 231, 235)",
    },
    height: 400,
    margin: { l: 60, r: 40, t: 60, b: 60 },
  }

  const config = {
    displayModeBar: false,
    responsive: true,
  }

  return (
    <div className="w-full">
      <Plot data={data} layout={layout} config={config} className="w-full" />
    </div>
  )
}
