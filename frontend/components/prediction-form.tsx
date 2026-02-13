"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProjectInput } from "@/lib/types"
import { Zap } from "lucide-react"

interface PredictionFormProps {
  onSubmit: (data: ProjectInput) => void
  isLoading: boolean
}

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<ProjectInput>({
    projectName: "",
    projectType: "Transmission",
    terrain: "Plains",
    vendorPerformance: "Good",
    materialAvailability: "Medium",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="border-zinc-800 bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-zinc-100">
          <Zap className="h-6 w-6 text-blue-400" />
          Project Risk Analysis
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Enter project details to predict cost and timeline overruns
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-zinc-200">
              Project Name
            </Label>
            <Input
              id="projectName"
              placeholder="e.g., Mumbai-Pune Transmission Line"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              required
              className="bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType" className="text-zinc-200">
              Project Type
            </Label>
            <Select
              value={formData.projectType}
              onValueChange={(value: ProjectInput["projectType"]) => setFormData({ ...formData, projectType: value })}
            >
              <SelectTrigger id="projectType" className="bg-zinc-950 border-zinc-700 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-700">
                <SelectItem value="Transmission">Transmission</SelectItem>
                <SelectItem value="Substation">Substation</SelectItem>
                <SelectItem value="Distribution">Distribution</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terrain" className="text-zinc-200">
              Terrain
            </Label>
            <Select
              value={formData.terrain}
              onValueChange={(value: ProjectInput["terrain"]) => setFormData({ ...formData, terrain: value })}
            >
              <SelectTrigger id="terrain" className="bg-zinc-950 border-zinc-700 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-700">
                <SelectItem value="Hilly">Hilly</SelectItem>
                <SelectItem value="Plains">Plains</SelectItem>
                <SelectItem value="Coastal">Coastal</SelectItem>
                <SelectItem value="Desert">Desert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendorPerformance" className="text-zinc-200">
              Vendor Performance
            </Label>
            <Select
              value={formData.vendorPerformance}
              onValueChange={(value: ProjectInput["vendorPerformance"]) =>
                setFormData({ ...formData, vendorPerformance: value })
              }
            >
              <SelectTrigger id="vendorPerformance" className="bg-zinc-950 border-zinc-700 text-zinc-100">
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
            <Label htmlFor="materialAvailability" className="text-zinc-200">
              Material Availability
            </Label>
            <Select
              value={formData.materialAvailability}
              onValueChange={(value: ProjectInput["materialAvailability"]) =>
                setFormData({ ...formData, materialAvailability: value })
              }
            >
              <SelectTrigger id="materialAvailability" className="bg-zinc-950 border-zinc-700 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-700">
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isLoading || !formData.projectName.trim()}
          >
            {isLoading ? "Analyzing..." : "Analyze Project Risk"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
