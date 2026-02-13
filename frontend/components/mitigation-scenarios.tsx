"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProjectInput } from "@/lib/types"
import { Lightbulb } from "lucide-react"

interface MitigationScenariosProps {
  originalFormData: ProjectInput
  onReanalyze: (modifiedData: ProjectInput) => void
  isLoading: boolean
}

export function MitigationScenarios({ originalFormData, onReanalyze, isLoading }: MitigationScenariosProps) {
  const [vendorPerformance, setVendorPerformance] = useState(originalFormData.vendorPerformance)
  const [materialAvailability, setMaterialAvailability] = useState(originalFormData.materialAvailability)

  const handleReanalyze = () => {
    const modifiedData: ProjectInput = {
      ...originalFormData,
      vendorPerformance,
      materialAvailability,
    }
    onReanalyze(modifiedData)
  }

  const hasChanges =
    vendorPerformance !== originalFormData.vendorPerformance ||
    materialAvailability !== originalFormData.materialAvailability

  return (
    <Card className="border-zinc-800 bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Mitigation Scenarios
        </CardTitle>
        <CardDescription>Explore "what-if" scenarios by adjusting key risk factors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="scenario-vendor">Vendor Performance</Label>
          <Select value={vendorPerformance} onValueChange={(value: any) => setVendorPerformance(value)}>
            <SelectTrigger id="scenario-vendor" className="bg-zinc-950 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-700">
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenario-material">Material Availability</Label>
          <Select value={materialAvailability} onValueChange={(value: any) => setMaterialAvailability(value)}>
            <SelectTrigger id="scenario-material" className="bg-zinc-950 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-700">
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleReanalyze}
          disabled={!hasChanges || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Re-analyzing..." : "Re-analyze with Changes"}
        </Button>

        {hasChanges && !isLoading && (
          <p className="text-xs text-muted-foreground text-center">
            Click to see how these changes affect the prediction
          </p>
        )}
      </CardContent>
    </Card>
  )
}
