"use client"

import dynamic from "next/dynamic"
import type { Hotspot } from "@/lib/types"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface HotspotChartProps {
  hotspots: Hotspot[]
}

const getRiskColor = (impact: number, maxImpact: number): string => {
  if (maxImpact === 0) return "rgb(252, 211, 77)" // Default to yellow
  const severity = impact / maxImpact
  if (severity > 0.66) return "rgb(239, 68, 68)" // High risk: Red-500
  if (severity > 0.33) return "rgb(251, 146, 60)" // Medium risk: Orange-400
  return "rgb(252, 211, 77)" // Low risk: Yellow-400
}

export function HotspotChart({ hotspots }: HotspotChartProps) {
  const risks = hotspots.filter((h) => h.impact > 0).sort((a, b) => a.impact - b.impact)
  const mitigators = hotspots.filter((h) => h.impact < 0).sort((a, b) => a.impact - b.impact)

  const data: any[] = []

  if (risks.length > 0) {
    const maxImpact = Math.max(...risks.map((h) => h.impact))
    data.push({
      type: "bar",
      orientation: "h",
      y: risks.map((h) => `${h.feature} \u00A0\u00A0\u00A0`),
      x: risks.map((h) => h.impact),
      name: "Risks",
      marker: {
        color: risks.map((h) => getRiskColor(h.impact, maxImpact)),
      },
      // --- MODIFIED: Use built-in text placement instead of annotations ---
      text: risks.map((h) => `<i>${h.description}</i>`),
      textposition: "auto", // Automatically places text inside or outside
      constraintext: "both", // Prevents text from overflowing
      insidetextanchor: "end", // Aligns text to the right when inside the bar
      insidetextfont: {
        color: "white", // Use a contrasting color for text inside the bar
      },
      outsidetextfont: {
        color: "rgb(161, 161, 170)", // zinc-400 for text outside
      },
      hovertemplate: "<b>%{y}</b><br>Impact: +%{x} days<br>%{text}<extra></extra>",
    })
  }

  if (mitigators.length > 0) {
    data.push({
      type: "bar",
      orientation: "h",
      y: mitigators.map((h) => `\u00A0\u00A0\u00A0 ${h.feature}`),
      x: mitigators.map((h) => h.impact),
      name: "Mitigators",
      marker: {
        color: "rgb(34, 197, 94)", // Green-500
      },
      // ADDED: Also apply auto-text to mitigators
      text: mitigators.map((h) => `<i>${h.description}</i>`),
      textposition: "auto",
      constraintext: "both",
      insidetextanchor: "start",
      insidetextfont: { color: "white" },
      outsidetextfont: { color: "rgb(161, 161, 170)" },
      hovertemplate: "<b>%{y}</b><br>Impact: %{x} days<br>%{text}<extra></extra>",
    })
  }

  const layout = {
    template: "plotly_dark",
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: false,
    // MODIFIED: Right margin can be reduced now
    margin: { l: 0, r: 40, t: 40, b: 60 },
    xaxis: {
      // ADDED: Extend the range slightly to give outside text more room
      range: [
        Math.min(0, ...mitigators.map((h) => h.impact)) * 1.1,
        Math.max(0, ...risks.map((h) => h.impact)) * 1.5, // Give more space on the right
      ],
      title: "Impact (Days)",
      gridcolor: "rgba(255,255,255,0.1)",
      zerolinecolor: "rgba(255,255,255,0.3)",
    },
    yaxis: {
      gridcolor: "rgba(255,255,255,0.1)",
      automargin: true,
      tickfont: {
        color: "rgb(161, 161, 170)", // zinc-400
      },
    },
    font: {
      family: "var(--font-sans), sans-serif",
      size: 12,
      color: "rgb(229, 231, 235)",
    },
    bargap: 0.3,
    // --- REMOVED: The entire annotations block is no longer needed ---
    height: Math.max(400, hotspots.length * 50),
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
