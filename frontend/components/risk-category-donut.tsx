"use client"

import dynamic from "next/dynamic"
import type { RiskCategory } from "@/lib/types"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface RiskCategoryDonutProps {
  riskCategories: RiskCategory[]
}

export function RiskCategoryDonut({ riskCategories }: RiskCategoryDonutProps) {
  const data: any[] = [
    {
      type: "pie",
      hole: 0.5,
      labels: riskCategories.map((r) => r.category),
      values: riskCategories.map((r) => r.percentage),
      textinfo: "label+percent",
      textposition: "outside",
      marker: {
        colors: [
          "rgb(100, 149, 237)",
          "rgb(255, 159, 64)",
          "rgb(153, 102, 255)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
        ],
      },
      hovertemplate: "<b>%{label}</b><br>%{percent}<extra></extra>",
    },
  ]

  const layout = {
    template: "plotly_dark",
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    title: {
      text: "Risk Contribution by Category",
      font: { size: 16, color: "rgb(229, 231, 235)" },
    },
    showlegend: false,
    font: {
      family: "var(--font-sans), sans-serif",
      color: "rgb(229, 231, 235)",
    },
    height: 400,
    margin: { l: 20, r: 20, t: 60, b: 20 },
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
